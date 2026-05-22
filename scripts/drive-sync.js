'use strict';

/**
 * drive-sync.js - Sincroniza fotos desde Google Drive para ARTES BUHO
 * Usa el hub ARTES-BUHO_API-GOOGLE (OAuth2 booking@artesbuhomanagement.com).
 * Genera config/photos-catalog.json con todas las fotos categorizadas.
 */

const fs = require('fs');
const path = require('path');
const hub = require('artes-buho-api-google');

const BASE = path.resolve(__dirname, '..');
const FOLDERS_FILE = path.join(BASE, 'config', 'drive-folders.json');
const CATALOG_FILE = path.join(BASE, 'config', 'photos-catalog.json');

const LOCATION_PATTERNS = {
  villaconejos: { evento: 'fiestas_patronales', lugar: 'Villaconejos' },
  chinch: { evento: 'fiestas_patronales', lugar: 'Chinchon' },
  colmenar: { evento: 'fiestas_patronales', lugar: 'Colmenar de Oreja' },
  soto: { evento: 'fiestas_patronales', lugar: 'Soto del Real' },
  coslada: { evento: 'fiestas_patronales', lugar: 'Coslada' },
  villablino: { evento: 'fiestas_patronales', lugar: 'Villablino' },
  roa: { evento: 'fiestas_patronales', lugar: 'Roa de Duero' },
  afteryou: { evento: 'discoteca', lugar: 'Palau Alameda Valencia' },
  'gran sala': { evento: 'discoteca', lugar: 'Palau Alameda Valencia' },
  palau: { evento: 'discoteca', lugar: 'Palau Alameda Valencia' },
  palacio: { evento: 'boda', lugar: 'Palacio de Aldovea' },
  boda: { evento: 'boda', lugar: '' },
  'mad cool': { evento: 'festival', lugar: 'Mad Cool Madrid' },
  festival: { evento: 'festival', lugar: '' },
  'real madrid': { evento: 'deportivo', lugar: 'Real Madrid' },
  bernabeu: { evento: 'deportivo', lugar: 'Santiago Bernabeu' },
  nazca: { evento: 'discoteca', lugar: 'Sala Nazca' },
  estudio: { evento: 'estudio', lugar: 'Estudio profesional' },
  dsc: { evento: 'sesion_foto', lugar: '' },
  a730: { evento: 'sesion_foto', lugar: '' },
  'img_': { evento: 'sesion_foto', lugar: '' },
};

function categorize(name, tipo) {
  const lower = (name || '').toLowerCase();
  const info = { evento: tipo, lugar: '', tags: [] };
  for (const [pattern, data] of Object.entries(LOCATION_PATTERNS)) {
    if (lower.includes(pattern)) {
      info.evento = data.evento;
      info.lugar = data.lugar;
      info.tags.push(pattern);
      break;
    }
  }
  const year = name.match(/20[12]\d/);
  if (year) info.tags.push(year[0]);
  if (lower.endsWith('.heic')) info.tags.push('heic');
  return info;
}

async function listImages(drive, folderId) {
  const results = [];
  let pageToken;
  do {
    const resp = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id, name, mimeType, size, modifiedTime)',
      pageSize: 100,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      corpora: 'allDrives',
    });
    results.push(...(resp.data.files || []));
    pageToken = resp.data.nextPageToken;
  } while (pageToken);
  return results.filter((f) => (f.mimeType || '').startsWith('image/'));
}

function mapFile(f, tipo) {
  const info = categorize(f.name, tipo);
  return {
    id: f.id,
    name: f.name,
    mime: f.mimeType || '',
    size: parseInt(f.size || 0, 10),
    modified: f.modifiedTime || '',
    evento: info.evento,
    lugar: info.lugar,
    tags: info.tags,
    url: `https://lh3.googleusercontent.com/d/${f.id}=w600`,
  };
}

async function buildCatalog() {
  console.log(`[DRIVE] Conectando como ${hub.config.account.email}...`);
  const drive = hub.clients.drive();

  const folders = JSON.parse(fs.readFileSync(FOLDERS_FILE, 'utf8'));
  const directoId = folders.fotos.directo.folder_id;
  const estudioId = folders.fotos.estudio.folder_id;

  console.log(`[DRIVE] Listando fotos directo (${directoId})...`);
  let directoFiles = [];
  try {
    directoFiles = await listImages(drive, directoId);
    console.log(`[DRIVE]   -> ${directoFiles.length} fotos`);
  } catch (e) {
    console.error(`[DRIVE] Error directo: ${e.message}`);
  }

  console.log(`[DRIVE] Listando fotos estudio (${estudioId})...`);
  let estudioFiles = [];
  try {
    estudioFiles = await listImages(drive, estudioId);
    console.log(`[DRIVE]   -> ${estudioFiles.length} fotos`);
  } catch (e) {
    console.error(`[DRIVE] Error estudio: ${e.message}`);
  }

  if (!directoFiles.length && !estudioFiles.length) {
    console.error('[DRIVE] Sin fotos. Abortando.');
    return null;
  }

  const catalog = {
    version: 2,
    account: hub.config.account.email,
    directo: directoFiles.map((f) => mapFile(f, 'directo')),
    estudio: estudioFiles.map((f) => mapFile(f, 'estudio')),
    stats: {},
  };

  catalog.directo.sort((a, b) => b.size - a.size);
  catalog.estudio.sort((a, b) => b.size - a.size);

  const eventos = {};
  for (const foto of [...catalog.directo, ...catalog.estudio]) {
    eventos[foto.evento] = (eventos[foto.evento] || 0) + 1;
  }
  catalog.stats = {
    total_directo: catalog.directo.length,
    total_estudio: catalog.estudio.length,
    total: catalog.directo.length + catalog.estudio.length,
    por_evento: eventos,
    synced_at: new Date().toISOString(),
  };

  fs.mkdirSync(path.dirname(CATALOG_FILE), { recursive: true });
  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2), 'utf8');

  console.log(`[DRIVE] Catalogo guardado: ${CATALOG_FILE}`);
  console.log(`[DRIVE] Total: ${catalog.stats.total} fotos`);
  return catalog;
}

module.exports = { buildCatalog };

if (require.main === module) {
  buildCatalog().catch((e) => {
    console.error('[DRIVE] Fallo general:', e.message);
    process.exit(1);
  });
}
