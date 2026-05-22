/**
 * server.js — Servidor del Email Builder de ARTES BUHO MANAGEMENT
 * Desarrollado por RUBEN COTON
 * - Sirve archivos estaticos (index.html, config/, cache/)
 * - API /api/photos-catalog — devuelve el catalogo completo de fotos
 * - API /api/sync-drive — ejecuta el sync con Google Drive
 * - Auto-sync cada 30 min si el catalogo tiene mas de 1 hora
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8090;
const BASE = path.resolve(__dirname);
const CATALOG_FILE = path.join(BASE, 'config', 'photos-catalog.json');

// Hub Google (ARTES-BUHO_API-GOOGLE) + drive-sync local en Node
let driveSync = null;
let hub = null;
try {
  driveSync = require('./scripts/drive-sync');
  hub = require('artes-buho-api-google');
  console.log('[HUB] ARTES-BUHO_API-GOOGLE cargado. Cuenta:', hub.config.account.email);
} catch (e) {
  console.warn('[HUB] No se pudo cargar el hub Google:', e.message);
}

// Cargar .env local si existe (API keys para cascada IA)
try {
  const envPath = path.join(BASE, '.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    });
    console.log('[ENV] .env cargado');
  }
} catch (e) { console.warn('[ENV] Error:', e.message); }

// Cascada IA (adaptada de ARTES-BUHO_RAMON con cooldown compartido)
let brain = null;
try {
  brain = require('./scripts/brain-router');
  console.log('[BRAIN] Cascada IA lista');
} catch (e) {
  console.warn('[BRAIN] Error cargando brain-router:', e.message);
}

// Content types
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.heic': 'image/heic', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.webp': 'image/webp'
};

// Sync con Drive usando el hub (Node, sin Python)
function runDriveSync(callback) {
  if (!driveSync) {
    if (callback) callback(false, 'Hub no disponible');
    return;
  }
  console.log('[SYNC] Ejecutando sync con Google Drive via hub...');
  driveSync.buildCatalog()
    .then((cat) => {
      console.log('[SYNC] OK. Total fotos:', cat ? cat.stats.total : 0);
      if (callback) callback(true, cat);
    })
    .catch((err) => {
      console.error('[SYNC] Error:', err.message);
      if (callback) callback(false, err.message);
    });
}

// Check if catalog needs refresh (older than 1 hour)
function needsSync() {
  try {
    const stat = fs.statSync(CATALOG_FILE);
    return (Date.now() - stat.mtimeMs) > 3600000;
  } catch {
    return true;
  }
}

// Server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // CORS headers en TODAS las respuestas
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

  // API: Get photo catalog
  if (url.pathname === '/api/photos-catalog') {
    try {
      const data = fs.readFileSync(CATALOG_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (e) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Catalog not found. Run sync first.' }));
    }
    return;
  }

  // API: Trigger Drive sync
  if (url.pathname === '/api/sync-drive') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    runDriveSync();
    res.end(JSON.stringify({ status: 'sync_started' }));
    return;
  }

  // API: Generar con cascada IA (cache + Ollama local + cloud fallback)
  // POST /api/brain/generate  body: { system?, user?, prompt?, tier?, maxTokens?, temperature?, useCache? }
  if (url.pathname === '/api/brain/generate' && req.method === 'POST') {
    if (!brain) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'brain-router no disponible' }));
      return;
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 2_000_000) req.destroy(); });
    req.on('end', async () => {
      try {
        const params = JSON.parse(body || '{}');
        const result = await brain.generate(params);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        console.error('[BRAIN] Error:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // API: Estado de la cascada IA
  if (url.pathname === '/api/brain/status') {
    if (!brain) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'brain-router no disponible' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(brain.status(), null, 2));
    return;
  }

  // API: Crear borrador en Gmail (booking@artesbuhomanagement.com)
  // POST /api/create-draft  body: { asunto, html, to? }
  if (url.pathname === '/api/create-draft' && req.method === 'POST') {
    if (!hub) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Hub Google no disponible' }));
      return;
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; if (body.length > 5_000_000) req.destroy(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body || '{}');
        const asunto = (data.asunto || '').toString();
        const html = (data.html || '').toString();
        const to = (data.to || '').toString(); // destinatario opcional (puede quedar vacio)
        if (!asunto || !html) throw new Error('Falta asunto o html');

        const gmail = hub.clients.gmail();
        // Construir MIME en base64url
        const from = hub.config.account.email;
        const boundary = '=_BUHO_' + Date.now();
        const headers = [
          'MIME-Version: 1.0',
          'From: ' + from,
          to ? 'To: ' + to : 'To: ',
          'Subject: =?UTF-8?B?' + Buffer.from(asunto, 'utf8').toString('base64') + '?=',
          'Content-Type: multipart/alternative; boundary="' + boundary + '"',
          '',
          '--' + boundary,
          'Content-Type: text/html; charset=UTF-8',
          'Content-Transfer-Encoding: 7bit',
          '',
          html,
          '',
          '--' + boundary + '--',
        ].join('\r\n');
        const raw = Buffer.from(headers, 'utf8')
          .toString('base64')
          .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const resp = await gmail.users.drafts.create({
          userId: 'me',
          requestBody: { message: { raw } },
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, draftId: resp.data.id, messageId: resp.data.message && resp.data.message.id, account: from }));
      } catch (err) {
        console.error('[GMAIL] Error crear borrador:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // API: Listar archivos de una carpeta Drive — util para buscar logos/recursos
  // GET /api/drive-folder?id=FOLDER_ID
  if (url.pathname === '/api/drive-folder') {
    const folderId = url.searchParams.get('id');
    if (!folderId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Falta parametro id' }));
      return;
    }
    if (!hub) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Hub no disponible' }));
      return;
    }
    const drive = hub.clients.drive();
    drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, size, modifiedTime)',
      pageSize: 200,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    })
      .then((r) => {
        const files = (r.data.files || []).map((f) => ({
          ...f,
          url: `https://lh3.googleusercontent.com/d/${f.id}=w600`,
        }));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ folder_id: folderId, count: files.length, files }, null, 2));
      })
      .catch((err) => {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      });
    return;
  }

  // Static files — con proteccion contra path traversal
  const rawPath = url.pathname;
  const safePath = path.normalize(rawPath).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(BASE, rawPath === '/' || safePath === '\\' || safePath === '' ? 'index.html' : safePath);
  filePath = path.resolve(filePath);

  // SEGURIDAD: verificar que el archivo esta dentro de BASE
  if (!filePath.startsWith(BASE)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`[EMAIL BUILDER] Servidor en http://localhost:${PORT}`);

  // Auto-sync on startup if catalog is stale
  if (needsSync()) {
    runDriveSync();
  } else {
    console.log('[SYNC] Catalogo actualizado, no necesita sync');
  }

  // Auto-sync periodico cada 30 min
  setInterval(() => {
    if (needsSync()) runDriveSync();
  }, 1800000);
});
