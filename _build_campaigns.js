/**
 * Generador de 4 campañas HTML PRO para ARTES BÚHO MANAGEMENT
 * v2 — Copywriting senior B2B · AIDA · P.D. · scannability · urgencia real
 */
const fs = require('fs');
const path = require('path');

const BASE = 'C:/Users/elrub/Desktop/html';

const LOGO_HEADER = 'https://lh3.googleusercontent.com/d/REPLACE_WITH_FILE_ID=w240';
const LOGO_FOOTER = 'https://lh3.googleusercontent.com/d/REPLACE_WITH_FILE_ID=w160';
const TEL = '+34 649 63 59 07';
const TEL_RAW = '+34 6XX XXX XXX';
const WA = '34649635907';
const EMAIL = 'contratacion@artesbuho.com';

function driveImg(id, w) { return `https://lh3.googleusercontent.com/d/${id}=w${w}`; }
function ytThumb(id) { return `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }
function ytWatch(id) { return `https://www.youtube.com/watch?v=${id}`; }
function driveView(id) { return `https://drive.google.com/file/d/${id}/view`; }

function emailHTML(cfg) {
  const ideal = (cfg.idealPara || []).map((s, i) => `
                  ${i > 0 ? '<td width="4"></td>' : ''}
                  <td width="${Math.floor(100 / cfg.idealPara.length)}%" style="padding:10px 6px; background-color:#FFF8E7; text-align:center; border-radius:4px;">
                    <p style="margin:0; color:#1a1a1a; font-size:13px; font-weight:bold;">${s}</p>
                  </td>`).join('');

  const stats = cfg.stats ? `
          <tr>
            <td style="padding:0 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8E7; border-left:4px solid #D62828; border-radius:4px;">
                <tr><td style="padding:16px 20px; text-align:center;">
                  <p style="margin:0; color:#1a1a1a; font-size:14px; font-weight:bold; line-height:1.5;">${cfg.stats}</p>
                </td></tr>
              </table>
            </td>
          </tr>` : '';

  const introParas = (cfg.intro || []).map(p => `
              <p style="margin:0 0 14px; color:#444444; font-size:15px; line-height:1.6;">${p}</p>`).join('');

  const bodyHTML = (cfg.bodyBlocks || []).map(b => {
    if (b.type === 'text') {
      return `
          <tr>
            <td style="padding:0 40px 16px;">
              ${b.html}
            </td>
          </tr>`;
    }
    if (b.type === 'subhero') {
      return `
          <tr>
            <td style="padding:16px 40px 6px;">
              <p style="margin:0 0 6px; color:#D62828; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">${b.eyebrow || ''}</p>
              <h3 style="margin:0 0 10px; color:#1a1a1a; font-size:20px; line-height:1.3; font-weight:bold;">${b.title}</h3>
              ${b.badge ? `<p style="margin:0 0 10px;"><span style="display:inline-block; background-color:#F4B400; color:#1a1a1a; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:3px; letter-spacing:1px;">${b.badge}</span></p>` : ''}
              ${(b.paragraphs || []).map(p => `<p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">${p}</p>`).join('')}
            </td>
          </tr>`;
    }
    return '';
  }).join('');

  const mediaHTML = (cfg.mediaBlocks || []).map(m => {
    if (m.type === 'video') {
      return `
          <tr>
            <td style="padding:6px 40px 18px;">
              <p style="margin:0 0 10px; color:#1a1a1a; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">${m.label}</p>
              <a href="${m.url}" target="_blank" style="display:block; text-decoration:none;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px; overflow:hidden;">
                  <tr><td style="background-color:#000000;">
                    <img src="${m.thumb}" alt="${m.alt}" width="520" style="display:block; width:100%; max-width:520px; height:auto; border:0;" border="0">
                  </td></tr>
                  <tr><td style="background-color:#D62828; padding:10px; text-align:center;">
                    <span style="color:#ffffff; font-size:13px; font-weight:bold; letter-spacing:1px;">▶ ${m.cta || 'VER VÍDEO'}</span>
                  </td></tr>
                </table>
              </a>
            </td>
          </tr>`;
    }
    if (m.type === 'button') {
      return `
          <tr>
            <td style="padding:0 40px 14px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background-color:#ffffff; border:2px solid #D62828; border-radius:6px;">
                  <a href="${m.url}" target="_blank" style="display:block; padding:14px 20px; color:#D62828; text-decoration:none; font-size:15px; font-weight:bold;">${m.label}</a>
                </td></tr>
              </table>
            </td>
          </tr>`;
    }
    return '';
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cfg.title}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif;">

  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; color:#f4f4f4; line-height:1px;">
    ${cfg.preheader} &#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;">
    <tr>
      <td align="center" style="padding:24px 10px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; max-width:600px;">

          <tr>
            <td style="background-color:#D62828; padding:28px 40px 22px; text-align:center;">
              <img src="${LOGO_HEADER}" alt="ARTES BÚHO" width="90" style="display:block; margin:0 auto 10px; width:90px; height:auto; border:0; background-color:#ffffff; border-radius:50%; padding:6px;" border="0">
              <h1 style="margin:4px 0 2px; color:#ffffff; font-size:24px; font-weight:bold; letter-spacing:4px;">ARTES BÚHO</h1>
              <p style="margin:0; color:#F4B400; font-size:11px; letter-spacing:5px; text-transform:uppercase; font-weight:700;">Management</p>
            </td>
          </tr>

          <tr><td style="height:4px; background-color:#F4B400;"></td></tr>

          <tr>
            <td style="background-color:#FFF8E7; padding:14px 40px; text-align:center; border-bottom:1px solid #f0e6c8;">
              <span style="font-size:11px; color:#888888; letter-spacing:2px; font-weight:700;">${cfg.badgeLabel}</span><br>
              <span style="font-size:16px; color:#D62828; font-weight:bold; letter-spacing:1px;">${cfg.badgeName}</span>
            </td>
          </tr>

          ${cfg.heroImg ? `<tr>
            <td style="padding:0; background-color:#000000;">
              ${cfg.heroLink ? `<a href="${cfg.heroLink}" target="_blank" style="display:block; text-decoration:none;">` : ''}
                <img src="${cfg.heroImg}" alt="${cfg.heroAlt}" width="600" style="display:block; width:100%; max-width:600px; height:auto; border:0; margin:0;" border="0">
              ${cfg.heroLink ? `</a>` : ''}
            </td>
          </tr>` : `<tr>
            <td style="padding:0; background-color:#1a1a1a;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:56px 40px; text-align:center; background-color:#1a1a1a;">
                  <p style="margin:0 0 8px; color:#F4B400; font-size:11px; letter-spacing:5px; font-weight:bold; text-transform:uppercase;">${cfg.heroKickerTop || ''}</p>
                  <p style="margin:0 0 8px; color:#ffffff; font-size:36px; font-weight:bold; letter-spacing:3px; line-height:1.1;">${cfg.heroKickerMain || ''}</p>
                  <p style="margin:14px 0 0; color:#F4B400; font-size:13px; letter-spacing:2px; font-weight:bold;">${cfg.heroKickerSub || ''}</p>
                </td></tr>
              </table>
            </td>
          </tr>`}

          <tr>
            <td style="background-color:#D62828; padding:14px 40px; text-align:center;">
              <p style="margin:0; color:#F4B400; font-size:11px; letter-spacing:3px; font-weight:700; text-transform:uppercase;">${cfg.tagTop}</p>
              <p style="margin:4px 0 0; color:#ffffff; font-size:18px; font-weight:bold; letter-spacing:1px;">${cfg.tagMain}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 40px 6px;">
              <p style="margin:0 0 14px; color:#1a1a1a; font-size:16px; font-weight:bold;">Buenos días,</p>
              <h2 style="margin:0 0 18px; color:#1a1a1a; font-size:22px; line-height:1.3; font-weight:bold;">${cfg.h2}</h2>${introParas}
            </td>
          </tr>
${stats}
${bodyHTML}
${mediaHTML}

          ${cfg.idealPara ? `<tr>
            <td style="padding:10px 40px 24px;">
              <p style="margin:0 0 12px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Ideal para</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>${ideal}</tr>
              </table>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:0 40px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4B400; border-radius:6px;">
                <tr><td style="padding:22px 26px;">
                  <p style="margin:0 0 12px; color:#1a1a1a; font-size:16px; font-weight:bold; line-height:1.4;">${cfg.firmeza}</p>
                  ${cfg.cierreIntro ? `<p style="margin:0 0 10px; color:#1a1a1a; font-size:14px; line-height:1.6;">${cfg.cierreIntro}</p>` : ''}
                  ${(cfg.cierreBullets || []).length ? `<p style="margin:0 0 4px; color:#1a1a1a; font-size:14px; line-height:1.7;">${cfg.cierreBullets.map((b, i) => `<strong>${i+1}.</strong> ${b}`).join('<br>')}</p>` : ''}
                  <p style="margin:14px 0 0; color:#1a1a1a; font-size:14px; line-height:1.5;"><strong>Sin compromiso.</strong> Le paso propuesta concreta en 24 h.</p>
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background-color:#D62828; border-radius:6px;">
                  <a href="mailto:${EMAIL}" style="display:block; padding:16px 20px; color:#ffffff; text-decoration:none; font-size:16px; font-weight:bold;">Responder a este correo</a>
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 12px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background-color:#F4B400; border-radius:6px;">
                  <a href="https://wa.me/${WA}" target="_blank" style="display:block; padding:16px 20px; color:#1a1a1a; text-decoration:none; font-size:16px; font-weight:bold;">Escribir por WhatsApp</a>
                </td></tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 40px 22px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center" style="background-color:#ffffff; border:2px solid #D62828; border-radius:6px;">
                  <a href="tel:${TEL_RAW}" style="display:block; padding:14px 20px; color:#1a1a1a; text-decoration:none;">
                    <span style="display:block; font-size:12px; font-weight:bold; color:#888888; letter-spacing:1px; text-transform:uppercase; margin-bottom:4px;">Llamar o WhatsApp</span>
                    <span style="display:block; font-size:22px; font-weight:bold; color:#D62828; letter-spacing:1px;">${TEL}</span>
                    <span style="display:block; font-size:11px; color:#888888; margin-top:4px;">Román · CEO ARTES BÚHO</span>
                  </a>
                </td></tr>
              </table>
            </td>
          </tr>

          ${cfg.ps ? `<tr>
            <td style="padding:0 40px 18px;">
              <p style="margin:0; color:#666666; font-size:13px; line-height:1.6; font-style:italic; border-left:3px solid #F4B400; padding-left:14px;">
                <strong style="color:#1a1a1a; font-style:normal;">P. D.:</strong> ${cfg.ps}
              </p>
            </td>
          </tr>` : ''}

          <tr>
            <td style="padding:0 40px 34px;">
              <p style="margin:0 0 2px; color:#1a1a1a; font-size:15px; font-weight:bold;">Un saludo,</p>
              <p style="margin:8px 0 2px; color:#1a1a1a; font-size:15px; font-weight:bold;">Román</p>
              <p style="margin:0; color:#666666; font-size:13px;">CEO · ARTES BÚHO Management</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#D62828; padding:24px 40px; text-align:center;">
              <img src="${LOGO_FOOTER}" alt="ARTES BÚHO" width="72" style="display:block; margin:0 auto 10px; width:72px; height:auto; border:0; background-color:#ffffff; border-radius:50%; padding:5px;" border="0">
              <p style="margin:0 0 6px; color:#ffffff; font-size:13px; font-weight:700; letter-spacing:2px;">ARTES BÚHO MANAGEMENT</p>
              <p style="margin:0 0 10px; color:#ffe8a8; font-size:11px;">Booking &amp; Management de artistas · Producción técnica</p>
              <p style="margin:0 0 4px; font-size:12px;">
                <a href="mailto:${EMAIL}" style="color:#ffffff; text-decoration:none; font-weight:bold;">${EMAIL}</a>
              </p>
              <p style="margin:0 0 10px; font-size:12px;">
                <a href="tel:${TEL_RAW}" style="color:#ffffff; text-decoration:none; font-weight:bold;">Tel. y WhatsApp · ${TEL}</a>
              </p>
              <p style="margin:12px 0 0; color:#ffd6a0; font-size:10px; line-height:1.5;">
                Si no desea seguir recibiendo comunicaciones comerciales, responda a este correo con la palabra BAJA.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ============================================================
// === 01 · LINZE ===
// ============================================================
const LINZE = emailHTML({
  title: 'LINZE para su festival 2026 (quedan pocos huecos de verano)',
  preheader: 'SOLD OUT en Villanos · +400K streams · 45 fechas firmadas · Movistar Music',
  badgeLabel: 'ARTISTA REPRESENTADO',
  badgeName: 'LINZE',
  heroImg: driveImg('19je4y5t-QYlpLQgQqydHi16KDyYDYhev', 1200),
  heroAlt: 'LINZE en directo — banda pop/rock',
  heroLink: 'https://drive.google.com/drive/folders/REPLACE_WITH_ID',
  tagTop: 'Pop · rock · festivales',
  tagMain: '45 CONCIERTOS FIRMADOS PARA 2026',
  h2: 'Festivales 2026: LINZE cierra ya sus últimos huecos',
  intro: [
    'En Villanos dejaron el cartel colgando un <strong>SOLD OUT</strong> y al público pidiendo bises. En 2026 ya tienen <strong>45 fechas firmadas</strong> — y queremos que la suya sea una de las siguientes.',
    'Representamos a <strong>LINZE</strong>. Están cerrando los últimos huecos antes de enero, y los fines de semana de <strong>junio a septiembre</strong> son lo primero en irse.',
  ],
  stats: '45 fechas 2026 &nbsp;·&nbsp; SOLD OUT en Villanos &nbsp;·&nbsp; +400.000 streams',
  bodyBlocks: [
    { type: 'text', html: `
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Por qué funcionan en festival</p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">
        Ganaron <strong>7 concursos nacionales</strong>, con <strong>Movistar Music</strong> como más destacado. Arriba del escenario son potentes, con repertorio propio y guiños a himnos que todo el mundo canta.
      </p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Qué se llevan sus asistentes:</strong> adolescentes bailando, gente de 40+ coreando estribillos, y vídeos en redes sociales al día siguiente. El tipo de directo que hace que el concejal de al lado le pregunte de quién es la programación.
      </p>
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Tres formatos según su espacio</p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.7;">
        · <strong>Concierto 75&#8242;</strong> — ideal festival · 400-3.000 personas<br>
        · <strong>Show 90&#8242; + bises</strong> — cabeza de cartel patronales · 1.000+<br>
        · <strong>Formato acústico reducido</strong> — chiringuitos, bodas, corporativos
      </p>` },
  ],
  mediaBlocks: [
    { type: 'video', label: 'Videoclip oficial', thumb: ytThumb('1i2n8GtvV7U'), url: ytWatch('1i2n8GtvV7U'), alt: 'LINZE — videoclip oficial', cta: 'VER VIDEOCLIP EN YOUTUBE' },
    { type: 'button', label: '▶ Ver Live Promo en Drive', url: driveView('17hy7ytwlq36xLFwQvTYCZUHNxscpaIM6') },
    { type: 'button', label: '📒 Descargar dossier completo', url: driveView('13GbKdWzBinqb5dJ8zkTExtTo99IjVYpn') },
    { type: 'button', label: '🎧 Escuchar en Spotify', url: 'https://open.spotify.com/intl-es/artist/1tTfoCV93H1A7jvq1PpRJq' },
  ],
  idealPara: ['Festivales pop/rock', 'Fiestas patronales', 'Chiringuitos y camping'],
  firmeza: 'Cerramos agenda 2026 estas semanas. Si le encaja, le paso propuesta en 24 h.',
  cierreIntro: 'Solo necesito:',
  cierreBullets: [
    'Localidad y fecha tentativa',
    'Tipo de evento (festival · patronales · privado)',
    'Aforo aproximado',
  ],
  ps: 'Si va justo de tiempo, el videoclip de arriba resume lo que son en 3 minutos. Viéndolo una vez decide si hablamos.',
});

// ============================================================
// === 02 · GINEL ===
// ============================================================
const GINEL = emailHTML({
  title: 'GINEL para su ciclo 2026: caché cerrado antes del disco',
  preheader: 'Noches del Botánico · LA VOZ · gira Perú · 1.000 € cerrado · ventana hasta enero',
  badgeLabel: 'ARTISTA REPRESENTADO',
  badgeName: 'GINEL (FUSIÓN)',
  heroImg: ytThumb('PvSw8mxLcLE'),
  heroAlt: 'GINEL — Live Session',
  heroLink: ytWatch('PvSw8mxLcLE'),
  tagTop: 'Fusión · indie · jazz',
  tagMain: 'NUEVO DISCO · ENERO 2026',
  h2: 'Una propuesta distinta para su festival o ciclo cultural de 2026',
  intro: [
    'Si busca un concierto del que la gente siga hablando al día siguiente, <strong>GINEL</strong> funciona. Tocan donde otras bandas aspiran a tocar: <strong>Noches del Botánico</strong>, gira por Perú, selección para <strong>LA VOZ</strong>.',
    'Y en <strong>enero de 2026 sale su nuevo disco</strong>. Antes de esa fecha hay caché ajustado; después, la agenda se llena rápido y sube.',
  ],
  stats: '16 fechas 2026 &nbsp;·&nbsp; Botánico emergente &nbsp;·&nbsp; Gira Perú &nbsp;·&nbsp; Disco enero 2026',
  bodyBlocks: [
    { type: 'text', html: `
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Condiciones transparentes</p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Caché cerrado: 1.000 € + IVA + técnica + hospitalidad.</strong> Sin sobrecostes ocultos. Banda completa, show propio, ficha técnica sencilla.
      </p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Formato:</strong> concierto de 60 minutos, ampliable a 75 con bises. Encajan bien en programaciones mixtas con otros artistas.
      </p>
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Para quién es</p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.7;">
        · Programaciones que valoran <strong>calidad artística</strong> sobre "himno para la plaza"<br>
        · Ciclos con público atento (teatros, fundaciones, festivales de autor)<br>
        · Eventos corporativos con espacio para escucha
      </p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6; background-color:#FFF8E7; padding:12px 14px; border-left:3px solid #D62828;">
        <strong>Ventana de oportunidad:</strong> precontratar antes de la salida del disco (enero 2026) = mismo caché con agenda más llena después.
      </p>` },
  ],
  mediaBlocks: [
    { type: 'video', label: 'Live Session', thumb: ytThumb('PvSw8mxLcLE'), url: ytWatch('PvSw8mxLcLE'), alt: 'GINEL — Live Session', cta: 'VER LIVE SESSION' },
    { type: 'video', label: 'Videoclip (versión estudio)', thumb: ytThumb('bLXQcm41Mbk'), url: ytWatch('bLXQcm41Mbk'), alt: 'GINEL — videoclip estudio', cta: 'VER VIDEOCLIP' },
    { type: 'video', label: 'Live Promo — Bioreel', thumb: ytThumb('HBkcVgXNIXs'), url: ytWatch('HBkcVgXNIXs'), alt: 'GINEL — bioreel', cta: 'VER LIVE PROMO' },
    { type: 'button', label: '🎧 Escuchar en Spotify', url: 'https://open.spotify.com/intl-es/artist/0kya6J0XCDJHcqmUHbZn7K' },
    { type: 'button', label: '📷 Ver en Instagram', url: 'https://www.instagram.com/ginelmusic/' },
  ],
  idealPara: ['Festivales indie/jazz', 'Ciclos culturales', 'Eventos corporativos'],
  firmeza: 'Estamos cerrando últimas fechas de 2026 antes del disco. Le confirmo en 24 h.',
  cierreIntro: 'Solo necesito:',
  cierreBullets: [
    'Localidad y fecha tentativa',
    'Espacio (aforo / formato)',
    'Contacto directo del responsable',
  ],
  ps: 'Si solo tiene 20 segundos, pulse la Live Session arriba. Así se hace una idea del directo actual antes de decidir.',
});

// ============================================================
// === 03 · KOKORE + CARNAVAL ===
// ============================================================
const INFANTIL = emailHTML({
  title: 'Para que los niños salgan cantando: dos espectáculos 2026',
  preheader: 'Premio JUVENALIA 2023 · compañía profesional · música, baile y teatro · colegios, teatros, ayuntamientos',
  badgeLabel: 'COMPAÑÍA REPRESENTADA · 2 ESPECTÁCULOS',
  badgeName: 'RAQUEL, ARIANA Y CINTIA',
  heroImg: driveImg('1qPqhrOZNzkZbELoc-SqTZccltRE8t5CT', 1200),
  heroAlt: 'El viaje de Kokore y Noa — espectáculo musical infantil',
  heroLink: 'https://drive.google.com/drive/folders/REPLACE_WITH_ID',
  tagTop: 'Música · baile · teatro',
  tagMain: 'DOS ESPECTÁCULOS INFANTILES DE AUTOR',
  h2: 'Dos espectáculos premiados para su programación infantil 2026',
  intro: [
    'Pensado para que <strong>los niños salgan cantando</strong> y los padres anoten el nombre para el año que viene. Dos espectáculos musicales infantiles, una misma compañía profesional, y <strong>un premio JUVENALIA 2023</strong> de respaldo.',
    'Representamos a <strong>Raquel Salamanca, Ariana Duro y Cintia Rosado</strong>. Montan sus propios montajes desde cero: música, baile y teatro en directo, con puesta en escena cuidada y ficha técnica asumible por cualquier sala.',
  ],
  stats: 'Compañía profesional &nbsp;·&nbsp; 2 espectáculos en gira &nbsp;·&nbsp; Premio JUVENALIA 2023',
  bodyBlocks: [
    { type: 'subhero', eyebrow: 'Espectáculo 1', title: 'El viaje de Kokore y Noa', badge: 'Familiar · de 3 a 10 años · 50 min', paragraphs: [
      'Dos aventureras y sus mascotas — una guitarra con vida propia y una cebra con dotes escénicas — recorren el mundo descubriéndose a través de <strong>música, baile y teatro</strong>.',
      '<strong>Ficha técnica ligera:</strong> sonido básico + play. Montaje rápido, versátil para sala de teatro, patio de colegio o plaza cubierta.',
    ] },
  ],
  mediaBlocks: [
    { type: 'video', label: 'Vídeo Promo en directo', thumb: ytThumb('CDAg_R5i6-g'), url: ytWatch('CDAg_R5i6-g'), alt: 'El viaje de Kokore y Noa — directo', cta: 'VER VÍDEO PROMO' },
    { type: 'button', label: '📒 Dossier — El viaje de Kokore y Noa', url: driveView('1Mq9wEewSubO7enbfg7xUTo8JNdVBsHMl') },
  ],
  idealPara: ['Colegios', 'Ayuntamientos', 'Teatros y asociaciones'],
  firmeza: 'Primavera y fin de curso son las primeras fechas en cerrarse. Le confirmo disponibilidad hoy.',
  cierreIntro: 'Solo necesito:',
  cierreBullets: [
    'Localidad y fecha(s) de interés',
    'Tipo de espacio (colegio, teatro, plaza)',
    'Franja de edad del público',
  ],
  ps: 'Si prefiere ver un minuto en vez de leer, el vídeo arriba es de un pase real en teatro. Así ve la reacción del público objetivo.',
});

const INFANTIL_EXTRA = `
          <tr>
            <td style="padding:16px 40px 6px;">
              <p style="margin:0 0 6px; color:#D62828; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">Espectáculo 2</p>
              <h3 style="margin:0 0 10px; color:#1a1a1a; font-size:20px; line-height:1.3; font-weight:bold;">El carnaval de los animales</h3>
              <p style="margin:0 0 10px;"><span style="display:inline-block; background-color:#F4B400; color:#1a1a1a; font-size:11px; font-weight:bold; padding:4px 10px; border-radius:3px; letter-spacing:1px;">Premiado · JUVENALIA 2023 · 55 min</span></p>
              <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.6;">
                Montaje inspirado en <em>El Carnaval de los animales</em> de Camille Saint-Saëns. Los niños hacen un viaje artístico jugando con sus animales favoritos. Probado con públicos de 4 a 10 años; ya programado en varios ayuntamientos.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 40px 18px;">
              <p style="margin:0 0 10px; color:#1a1a1a; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Vídeo completo</p>
              <a href="https://www.youtube.com/watch?v=ccxxffDzLfI" target="_blank" style="display:block; text-decoration:none;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:6px; overflow:hidden;">
                  <tr><td style="background-color:#000000;">
                    <img src="https://img.youtube.com/vi/ccxxffDzLfI/hqdefault.jpg" alt="El carnaval de los animales — Artes Búho" width="520" style="display:block; width:100%; max-width:520px; height:auto; border:0;" border="0">
                  </td></tr>
                  <tr><td style="background-color:#D62828; padding:10px; text-align:center;">
                    <span style="color:#ffffff; font-size:13px; font-weight:bold; letter-spacing:1px;">▶ VER EN YOUTUBE</span>
                  </td></tr>
                </table>
              </a>
            </td>
          </tr>
`;
const INFANTIL_FINAL = INFANTIL.replace(/(\s*<tr>\s*<td style="padding:10px 40px 24px;">\s*<p[^>]*>Ideal para)/, INFANTIL_EXTRA + '$1');

// ============================================================
// === 04 · SONIDO E ILUMINACIÓN ===
// ============================================================
const SONIDO = emailHTML({
  title: 'Sus eventos 2026 con una sola factura técnica',
  preheader: 'Sonido + iluminación · equipo propio · técnicos en plantilla · PRL y RC · Madrid',
  badgeLabel: 'SERVICIO DE ARTES BÚHO',
  badgeName: 'SONIDO + ILUMINACIÓN',
  heroImg: null,
  heroKickerTop: 'ARTES BÚHO · producción técnica',
  heroKickerMain: 'SONIDO + LUZ',
  heroKickerSub: 'EQUIPO PROPIO · TÉCNICOS PROPIOS · FACTURA ÚNICA',
  tagTop: 'Producción técnica',
  tagMain: 'SONIDO · ILUMINACIÓN · BACKLINE',
  h2: 'Sonido e iluminación profesional con equipo propio',
  intro: [
    'Usted tiene un evento en 2026. Necesita que <strong>suene bien, que se vea mejor</strong>, y que haya <strong>una sola persona</strong> respondiendo el teléfono cuando algo cambia 48 horas antes.',
    'Ahí entramos nosotros. En <strong>ARTES BÚHO</strong> somos empresa proveedora de <strong>sonido e iluminación</strong> con equipo en propiedad, técnicos en plantilla y oficina en Madrid. Una interlocución, una factura.',
  ],
  stats: 'Equipo propio &nbsp;·&nbsp; Técnicos en plantilla &nbsp;·&nbsp; PRL + seguro RC',
  bodyBlocks: [
    { type: 'text', html: `
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Tres señales de que nos necesita</p>
      <p style="margin:0 0 14px; color:#444444; font-size:15px; line-height:1.7;">
        · El año pasado tuvo que <strong>coordinar a tres proveedores distintos</strong> el mismo día.<br>
        · Hubo una incidencia técnica <strong>y nadie respondió</strong> al teléfono.<br>
        · Le pidieron <strong>factura rápida</strong> y tuvo que perseguir a varios para poder emitirla.
      </p>
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Lo que montamos</p>
      <p style="margin:0 0 8px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Sonido:</strong> PA L-Acoustics, d&amp;b y QSC · monitores · microfonía inalámbrica · mesas digitales · multipista.
      </p>
      <p style="margin:0 0 8px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Iluminación:</strong> cabezas móviles, blinders, par LED, plotters, ambientación arquitectónica, máquinas de humo.
      </p>
      <p style="margin:0 0 14px; color:#444444; font-size:15px; line-height:1.6;">
        <strong>Servicios:</strong> diseño técnico, personal certificado PRL, seguro RC, montaje y desmontaje.
      </p>
      <p style="margin:0 0 10px; color:#1a1a1a; font-size:13px; font-weight:bold; letter-spacing:1px; text-transform:uppercase;">Por qué nosotros</p>
      <p style="margin:0 0 12px; color:#444444; font-size:15px; line-height:1.7;">
        · <strong>Una factura</strong> para todo. Adiós al "llama al de luces, llama al de sonido".<br>
        · <strong>Equipo propio.</strong> No alquilamos lo que le montamos a usted.<br>
        · <strong>Técnicos en plantilla.</strong> El material lo usan todos los días; saben cómo responde.
      </p>` },
  ],
  mediaBlocks: [
    { type: 'button', label: '📒 Descargar dossier técnico', url: driveView('1S1lx_bbFuLYySrGG0Wqdjdfx1UJoq59b') },
  ],
  idealPara: ['Espectáculos', 'Conferencias', 'Bodas y eventos'],
  firmeza: 'Las fechas mayo-octubre (bodas y exteriores) se reservan con 3-6 meses de antelación.',
  cierreIntro: 'Solo necesito:',
  cierreBullets: [
    'Fecha, lugar y tipo de evento',
    'Aforo y espacio (interior/exterior)',
    'Qué necesita: sonido, iluminación o ambos',
  ],
  ps: 'Si tiene un evento inminente y no puede esperar a coordinar correos, llame al +34 649 63 59 07. Lo descolgamos.',
});

// ============================================================
// === BRIEFINGS (con datos esperados y KPIs detallados) ===
// ============================================================

function writeCampaign(folder, baseName, html) {
  const full = path.join(BASE, folder);
  const htmlPath = path.join(full, baseName + '.html');
  const txtPath = path.join(full, baseName + '.txt');
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.writeFileSync(txtPath, html, 'utf8');
  console.log(`  ${folder}/${baseName}.html + .txt  (${html.length} bytes)`);
}

function writeBrief(folder, brief) {
  const p = path.join(BASE, folder, '_CAMPAÑA.txt');
  fs.writeFileSync(p, brief, 'utf8');
  console.log(`  ${folder}/_CAMPAÑA.txt (${brief.length} bytes)`);
}

const BRIEF_LINZE = `===============================================================
  CAMPAÑA 1 · LINZE
  Pop / Rock · Festivales y fiestas patronales 2026
===============================================================

NOMBRE DE CAMPAÑA (CRM / plataforma)
  ARTES-BUHO_2026_LINZE_FESTIVALES-POP-ROCK

---------------------------------------------------------------
ASUNTO PRINCIPAL (el que va al aire)
---------------------------------------------------------------
  Festivales 2026: LINZE cierra sus últimos huecos

VARIANTES A/B
  A) 45 fechas firmadas para 2026: ¿LINZE en tu festival?
  B) Sold out en Villanos, +400K streams: cerramos agenda 2026

PREVIEW TEXT
  +400K streams · SOLD OUT en Villanos · Movistar Music · 7 concursos ganados

---------------------------------------------------------------
A QUIÉN SE DIRIGE (targeting)
---------------------------------------------------------------
  · Concejalías de Cultura y Festejos de ayuntamientos
  · Dirección artística de festivales pop/rock
  · Programadores de salas medianas y grandes (400-3000 aforo)
  · Chiringuitos con programación de verano
  · Campings con espacio escénico
  · Promotores de fiestas patronales
  · Empresas de eventos privados (fin de gira · corporativos)

PAÍSES / ÁREA: España peninsular + Baleares
PRIMER IMPACTO: gestores de contratación / directores artísticos

---------------------------------------------------------------
HORARIO RECOMENDADO DE ENVÍO
---------------------------------------------------------------
  · Martes o miércoles, 10:30 - 12:00
  · Evitar lunes (bandeja llena) y viernes tarde
  · Temporada óptima: enero-marzo (cuando cierran programación)

---------------------------------------------------------------
ESTRUCTURA DE LA CAMPAÑA
---------------------------------------------------------------
  · Tamaño lista recomendada: 300-500 contactos segmentados
  · Envío en bloques de 100 cada 30 min (protege reputación)
  · Follow-up 1: día 4 si no abre (asunto: "Lo vio?")
  · Follow-up 2: día 10 si abrió sin responder (oferta de llamada 10 min)
  · Cierre de campaña: día 21

---------------------------------------------------------------
CTAs / RESULTADOS ESPERADOS
---------------------------------------------------------------
  CTA 1 (primaria):  Responder a este correo (mailto vacío)
  CTA 2 (secundaria): WhatsApp a Román (sin mensaje preconfigurado)
  CTA 3 (terciaria): Llamar al +34 649 63 59 07

  KPIs objetivo (sobre lista 400 contactos):
    Open rate:     38-45%    (152-180 aperturas)
    CTR:           7-10%     (10-18 clics a vídeo/dossier)
    Respuestas:    2-4%      (8-16 respuestas útiles)
    Reuniones:     1-2%      (4-8 llamadas/reuniones)
    Cierres:       0.5-1%    (2-4 fechas firmadas)
  ROI: con 2 cierres a caché medio, se cubre con margen el envío.

---------------------------------------------------------------
POSICIONAMIENTO Y NOTAS ESTRATÉGICAS
---------------------------------------------------------------
  · Usar el P.S. como gancho secundario: "el videoclip en 3 min"
  · Preheader complementa asunto (no repite)
  · 3 formatos mencionados cubren objeciones de tamaño
  · Caché no visible (segmento alto de festivales)
  · Si se generan muchas respuestas "¿cuánto cuesta?",
    A/B testear versión con rango (ej: "cachés desde 3.500 €")
`;

const BRIEF_GINEL = `===============================================================
  CAMPAÑA 2 · GINEL (Fusión)
  Festivales, ciclos culturales, eventos corporativos 2026
===============================================================

NOMBRE DE CAMPAÑA
  ARTES-BUHO_2026_GINEL_FUSION-INDIE-JAZZ

---------------------------------------------------------------
ASUNTO PRINCIPAL
---------------------------------------------------------------
  Propuesta distinta para su festival/ciclo 2026: GINEL (fusión)

VARIANTES A/B
  A) GINEL en 2026: nuevo disco, Botánico y LA VOZ
  B) Fusión de autor para su ciclo 2026: caché cerrado 1.000€

PREVIEW TEXT
  Nuevo disco enero 2026 · Noches del Botánico · LA VOZ · caché cerrado 1.000 €

---------------------------------------------------------------
A QUIÉN SE DIRIGE
---------------------------------------------------------------
  · Directores artísticos de festivales indie/fusión/jazz
  · Programadores de ciclos culturales y teatros medianos
  · Ayuntamientos con programación cultural (no solo patronales)
  · Fundaciones y centros culturales (CaixaForum, Matadero, Conde Duque...)
  · Empresas de eventos corporativos premium
  · Bodas de gama alta con ceremonia musical
  · Embajadas y centros culturales extranjeros

PAÍSES: España + Portugal fronterizo + Latinoamérica (ya gira en Perú)

---------------------------------------------------------------
HORARIO RECOMENDADO DE ENVÍO
---------------------------------------------------------------
  · Miércoles o jueves, 11:00 - 13:00
  · Horario oficina cultural
  · Ventana ideal: nov-feb para programación de primavera

---------------------------------------------------------------
ESTRUCTURA DE LA CAMPAÑA
---------------------------------------------------------------
  · Tamaño lista recomendada: 150-250 contactos HIPER segmentados
  · Es un segmento más nicho; priorizar calidad a volumen
  · Follow-up 1 (día 5): "¿Recibió la propuesta?"
  · Follow-up 2 (día 12): muestra específica
    (Live Session completa en Spotify)
  · Cierre de campaña: día 21

---------------------------------------------------------------
CTAs / RESULTADOS ESPERADOS
---------------------------------------------------------------
  CTA 1: Responder al correo
  CTA 2: WhatsApp
  CTA 3: Llamar

  KPIs objetivo (sobre lista 200 contactos):
    Open rate:     35-42%    (70-84 aperturas)
    CTR:           6-9%      (4-8 clics a vídeos)
    Respuestas:    2-3%      (4-6 respuestas útiles)
    Reuniones:     1-2%      (2-4 reuniones)
    Cierres:       1-1.5%    (2-3 fechas firmadas)
  ROI: con 2 cierres a 1.000 €, +2.000 € brutos.
       Caché directo visible = menos fricción de respuesta.

---------------------------------------------------------------
POSICIONAMIENTO Y NOTAS ESTRATÉGICAS
---------------------------------------------------------------
  · Caché visible = decisión deliberada: ayuda en cultural B2B,
    reduce tiempo perdido con quien no tiene presupuesto
  · Social proof fuerte: Botánico, Roberto Mira, LA VOZ
  · URGENCIA REAL: precontratar antes del disco enero 2026
  · Dossier Drive NO disponible (archivo eliminado) —
    sube nuevo y se añade al correo
`;

const BRIEF_INFANTIL = `===============================================================
  CAMPAÑA 3 · COMPAÑÍA INFANTIL
  El viaje de Kokore y Noa + El carnaval de los animales
===============================================================

NOMBRE DE CAMPAÑA
  ARTES-BUHO_2026_INFANTIL_KOKORE-CARNAVAL

---------------------------------------------------------------
ASUNTO PRINCIPAL
---------------------------------------------------------------
  Dos espectáculos premiados para su programación infantil 2026

VARIANTES A/B
  A) Música, teatro y baile para niños: dos montajes de gira 2026
  B) Premio JUVENALIA 2023: dos espectáculos infantiles para su teatro

PREVIEW TEXT
  Compañía profesional · Premio JUVENALIA 2023 · Música, baile y teatro

---------------------------------------------------------------
A QUIÉN SE DIRIGE
---------------------------------------------------------------
  · Dirección de colegios públicos, concertados y privados (AMPA)
  · Concejalías de Cultura con programación infantil
  · Concejalías de Educación
  · Salas y teatros con cartelera familiar
  · Asociaciones vecinales, centros culturales, casas de cultura
  · Empresas family friendly / parques temáticos
  · Organizadores de fiestas navideñas y fin de curso
  · Fundaciones y obras sociales
  · Festivales de teatro infantil

PAÍSES / ÁREA: España peninsular + islas

---------------------------------------------------------------
HORARIO RECOMENDADO DE ENVÍO
---------------------------------------------------------------
  · Martes 9:30 - 11:00 (horario apertura de colegios)
  · Evitar periodos vacacionales escolares
  · Ventanas altas: septiembre, enero, marzo

---------------------------------------------------------------
ESTRUCTURA DE LA CAMPAÑA
---------------------------------------------------------------
  · Tamaño lista recomendada: 500-800 contactos
  · Segmentación por CCAA (gastos gira)
  · Follow-up 1 (día 3): "Dejé el pase en vídeo"
  · Follow-up 2 (día 10): calendario de disponibilidad
  · Envío en lunes matutino NO (se satura bandeja colegios)
  · Cierre de campaña: día 21

---------------------------------------------------------------
CTAs / RESULTADOS ESPERADOS
---------------------------------------------------------------
  KPIs objetivo (sobre lista 600 contactos):
    Open rate:     40-48%    (240-288 aperturas)
    CTR:           8-12%     (19-34 clics)
    Respuestas:    3-5%      (18-30 respuestas)
    Reuniones:     2-3%      (12-18 programaciones)
    Cierres:       1.5-2.5%  (9-15 fechas firmadas)
  ROI: infantil tiene mayor ratio de cierre por mail
       (colegios/ayuntamientos buscan proveedor fiable)

---------------------------------------------------------------
POSICIONAMIENTO Y NOTAS ESTRATÉGICAS
---------------------------------------------------------------
  · Enfoque: COMPAÑÍA profesional con 2 espectáculos
    (igual estrategia que Viejetes). No es "dos artistas sueltos".
  · Premio JUVENALIA = autoridad externa. Usar siempre.
  · Ficha técnica ligera = argumento fuerte (colegios sin medios).
  · Edades visibles en badges evita preguntas obvias.
  · Cross-sell con SONIDO: si el colegio/teatro no tiene técnica,
    podemos ir llave en mano (mencionar en follow-up 2).
`;

const BRIEF_SONIDO = `===============================================================
  CAMPAÑA 4 · SONIDO E ILUMINACIÓN
  Servicio técnico — B2B empresa proveedora
===============================================================

NOMBRE DE CAMPAÑA
  ARTES-BUHO_2026_PRODUCCION-TECNICA_SONIDO-ILUMINACION

---------------------------------------------------------------
ASUNTO PRINCIPAL
---------------------------------------------------------------
  Sonido e iluminación con equipo propio para sus eventos 2026

VARIANTES A/B
  A) ¿Quién monta sonido y luz de sus eventos 2026?
  B) Producción técnica llave en mano: una factura, un interlocutor

PREVIEW TEXT
  Equipo propio · técnicos en plantilla · una interlocución, una factura · PRL + RC

---------------------------------------------------------------
A QUIÉN SE DIRIGE
---------------------------------------------------------------
  · Wedding planners y agencias de bodas premium
  · Agencias de eventos corporativos (MICE)
  · Hoteles con espacios para bodas y conferencias
  · Organizadores de congresos y ferias
  · Productoras audiovisuales que subcontratan técnica
  · Teatros municipales sin equipo propio suficiente
  · Ayuntamientos para fiestas patronales y actos institucionales
  · Centros culturales, auditorios, palacios de congresos
  · Discográficas / managers de artistas que no representamos

PAÍSES / ÁREA: Madrid y CC.AA. limítrofes (radio 300 km)

---------------------------------------------------------------
HORARIO RECOMENDADO DE ENVÍO
---------------------------------------------------------------
  · Martes-jueves, 9:30 - 11:30
  · Antes de que cierren proveedores de temporada alta (marzo-mayo)

---------------------------------------------------------------
ESTRUCTURA DE LA CAMPAÑA
---------------------------------------------------------------
  · Tamaño lista recomendada: 200-400 contactos B2B
  · Segmentar por tipo: bodas / MICE / culturales
  · Follow-up 1 (día 5): "¿Propuesta técnica para [evento específico]?"
  · Follow-up 2 (día 12): caso de éxito (evento ya realizado)
  · Cierre de campaña: día 21

---------------------------------------------------------------
CTAs / RESULTADOS ESPERADOS
---------------------------------------------------------------
  KPIs objetivo (sobre lista 300 contactos):
    Open rate:     30-38%    (90-114 aperturas)
    CTR:           5-8%      (5-9 clics dossier)
    Respuestas:    1-3%      (3-9 respuestas)
    Reuniones:     1-2%      (3-6 reuniones)
    Cierres:       0.5-1.5%  (2-5 eventos cerrados)
  ROI: ticket medio B2B técnico = 1.500-8.000 €/evento.
       Un solo cierre compensa toda la campaña.

---------------------------------------------------------------
POSICIONAMIENTO Y NOTAS ESTRATÉGICAS
---------------------------------------------------------------
  · Único envío B2B puro (no artístico).
  · Hablar de fiabilidad, plazos, certificaciones y facturación única.
  · Cross-sell PERFECTO con los otros 3:
    cliente de LINZE/GINEL que necesita técnica, cliente de
    KOKORE que programa en plaza sin equipo, etc.
  · En follow-up mencionar "también representamos artistas"
    por si el destinatario es promotor y no solo técnico.
`;

console.log('Generando campañas v2 PRO...');
writeCampaign('01-LINZE', 'linze', LINZE);
writeBrief('01-LINZE', BRIEF_LINZE);
writeCampaign('02-GINEL', 'ginel', GINEL);
writeBrief('02-GINEL', BRIEF_GINEL);
writeCampaign('03-KOKORE-CARNAVAL', 'kokore-carnaval', INFANTIL_FINAL);
writeBrief('03-KOKORE-CARNAVAL', BRIEF_INFANTIL);
writeCampaign('04-SONIDO-ILUMINACION', 'sonido-iluminacion', SONIDO);
writeBrief('04-SONIDO-ILUMINACION', BRIEF_SONIDO);
console.log('OK');
