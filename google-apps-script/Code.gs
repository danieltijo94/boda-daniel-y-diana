/**
 * Confirmaciones de la boda de Daniel Alejandro & Diana Carolina
 * Guarda cada respuesta en esta hoja de cálculo y envía un correo de aviso.
 * Instrucciones: ver CONFIGURAR-CORREO.md en el repositorio.
 */

// Correos adicionales que también deben recibir el aviso (opcional)
const CORREOS_EXTRA = []; // ej: ["diana@gmail.com"]

// Playlist de YouTube (ver PLAYLIST.md). La playlist está en otra cuenta, así que las canciones
// se envían al script de esa cuenta:
const PLAYLIST_WEBAPP_URL = ""; // URL (termina en /exec) del script Playlist-pareja.gs
const PLAYLIST_CLAVE = "";      // la misma palabra secreta que en Playlist-pareja.gs

const COLUMNAS = ["Fecha", "Código", "Familia", "Asistencia", "Personas", "Pases", "Asistentes", "Restricciones / alergias", "Canción"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (!p.nombre || !p.asistencia) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "faltan datos" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    const pases = toInt(p.pases, 1);
    const asiste = p.asistencia === "Sí";
    const personas = asiste ? Math.min(Math.max(toInt(p.personas, 1), 1), pases) : 0;
    const fila = [
      new Date(),
      limpiar(p.codigo),
      limpiar(p.nombre),
      asiste ? "Sí" : "No",
      personas,
      pases,
      limpiar(p.asistentes),
      limpiar(p.restricciones),
      limpiar(p.cancion),
    ];

    const hoja = obtenerHoja();
    const codigo = fila[1];
    const existente = codigo ? buscarFila(hoja, codigo) : 0;
    if (existente) {
      hoja.getRange(existente, 1, 1, fila.length).setValues([fila]);
    } else {
      hoja.appendRow(fila);
    }

    const enPlaylist = agregarAPlaylist(p.cancion);
    enviarCorreo(fila, Boolean(existente), hoja, enPlaylist);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName("Confirmaciones") || libro.getSheets()[0];
  // Encabezados siempre al día (también si la hoja venía de una versión anterior)
  hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS])
    .setFontWeight("bold").setBackground("#f4dcdc");
  hoja.setFrozenRows(1);
  return hoja;
}

function buscarFila(hoja, codigo) {
  const n = hoja.getLastRow() - 1;
  if (n < 1) return 0;
  const codigos = hoja.getRange(2, 2, n, 1).getValues();
  for (let i = 0; i < codigos.length; i++) {
    if (String(codigos[i][0]).toUpperCase() === codigo.toUpperCase()) return i + 2;
  }
  return 0;
}

function enviarCorreo(fila, actualizado, hoja, enPlaylist) {
  const [, codigo, familia, asistencia, personas, pases, asistentes, restricciones, cancion] = fila;
  const totales = totalConfirmados(hoja);
  const asunto = asistencia === "Sí"
    ? `💍 ${familia} confirmó: ${personas} de ${pases} ${pases === 1 ? "persona" : "personas"}`
    : `💌 ${familia} no podrá asistir`;
  const cuerpo = [
    actualizado ? "(Actualizó su respuesta anterior)" : "¡Nueva confirmación!",
    "",
    `Familia: ${familia}`,
    `Código: ${codigo || "sin código"}`,
    `¿Asiste?: ${asistencia}`,
    `Personas: ${personas} de ${pases}`,
    `Asistentes: ${asistentes || "—"}`,
    `Restricciones / alergias: ${restricciones || "—"}`,
    `Canción: ${cancion || "—"}${enPlaylist ? " (agregada a la playlist ✓)" : ""}`,
    "",
    `Total hasta ahora: ${totales.personas} personas confirmadas (${totales.si} sí · ${totales.no} no).`,
    `Ver la lista completa: ${hoja.getParent().getUrl()}`,
  ].join("\n");

  const destinatarios = [Session.getEffectiveUser().getEmail()].concat(CORREOS_EXTRA).join(",");
  MailApp.sendEmail(destinatarios, asunto, cuerpo);
}

/* ---------- Playlist de YouTube ---------- */
function idDeYouTube(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : "";
}

// Envía la canción al script de la cuenta dueña de la playlist. Nunca hace fallar la confirmación.
function agregarAPlaylist(url) {
  const videoId = idDeYouTube(url);
  if (!PLAYLIST_WEBAPP_URL || !PLAYLIST_CLAVE || !videoId) return false;
  try {
    const res = UrlFetchApp.fetch(PLAYLIST_WEBAPP_URL, {
      method: "post",
      payload: { clave: PLAYLIST_CLAVE, video: videoId },
      muteHttpExceptions: true,
    });
    return JSON.parse(res.getContentText()).ok === true;
  } catch (err) {
    console.error("No se pudo enviar la canción a la playlist: " + err);
    return false;
  }
}

function totalConfirmados(hoja) {
  const n = hoja.getLastRow() - 1;
  const r = { personas: 0, si: 0, no: 0 };
  if (n < 1) return r;
  hoja.getRange(2, 4, n, 2).getValues().forEach(([asiste, personas]) => {
    if (asiste === "Sí") { r.si++; r.personas += Number(personas) || 0; } else if (asiste === "No") { r.no++; }
  });
  return r;
}

function toInt(v, def) {
  const n = parseInt(v, 10);
  return isNaN(n) ? def : n;
}

// Evita que un texto se interprete como fórmula en la hoja
function limpiar(v) {
  const s = String(v || "").slice(0, 500).trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Ejecuta esta función para comprobar que las canciones llegan a la playlist
function probarPlaylist() {
  const ok = agregarAPlaylist("https://youtu.be/2Vv-BfVoq4g");
  console.log(ok ? "¡Canción agregada a la playlist!" : "No se agregó: revisa PLAYLIST_WEBAPP_URL y que la clave sea igual en los dos scripts.");
}

// Ejecuta esta función una vez desde el editor para autorizar el envío de correos
function probar() {
  doPost({ parameter: {
    codigo: "PRUEBA", nombre: "Familia Prueba", asistencia: "Sí", personas: "2", pases: "2",
    asistentes: "Invitado Uno, Invitado Dos", restricciones: "Vegetariano", cancion: "",
  } });
}
