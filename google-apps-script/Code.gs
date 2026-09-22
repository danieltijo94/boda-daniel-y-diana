/**
 * Confirmaciones de la boda de Daniel & Diana
 * Guarda cada respuesta en esta hoja de cálculo y envía un correo de aviso.
 * Instrucciones: ver CONFIGURAR-CORREO.md en el repositorio.
 */

// Correos adicionales que también deben recibir el aviso (opcional)
const CORREOS_EXTRA = []; // ej: ["diana@gmail.com"]

const COLUMNAS = ["Fecha", "Código", "Nombre", "Asistencia", "Personas", "Pases", "Mensaje"];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
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
      limpiar(p.mensaje),
    ];

    const hoja = obtenerHoja();
    const codigo = fila[1];
    const existente = codigo ? buscarFila(hoja, codigo) : 0;
    if (existente) {
      hoja.getRange(existente, 1, 1, fila.length).setValues([fila]);
    } else {
      hoja.appendRow(fila);
    }

    enviarCorreo(fila, Boolean(existente), hoja);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheetByName("Confirmaciones") || libro.insertSheet("Confirmaciones");
  if (hoja.getLastRow() === 0) {
    hoja.appendRow(COLUMNAS);
    hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold").setBackground("#f3d9d3");
    hoja.setFrozenRows(1);
  }
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

function enviarCorreo(fila, actualizado, hoja) {
  const [, codigo, nombre, asistencia, personas, pases, mensaje] = fila;
  const totales = totalConfirmados(hoja);
  const asunto = asistencia === "Sí"
    ? `💍 ${nombre} confirmó: ${personas} de ${pases} ${pases === 1 ? "persona" : "personas"}`
    : `💌 ${nombre} no podrá asistir`;
  const cuerpo = [
    actualizado ? "(Actualizó su respuesta anterior)" : "¡Nueva confirmación!",
    "",
    `Nombre: ${nombre}`,
    `Código: ${codigo || "sin código"}`,
    `¿Asiste?: ${asistencia}`,
    `Personas: ${personas} de ${pases}`,
    `Mensaje: ${mensaje || "—"}`,
    "",
    `Total hasta ahora: ${totales.personas} personas confirmadas (${totales.si} sí · ${totales.no} no).`,
    `Ver la lista completa: ${hoja.getParent().getUrl()}`,
  ].join("\n");

  const destinatarios = [Session.getEffectiveUser().getEmail()].concat(CORREOS_EXTRA).join(",");
  MailApp.sendEmail(destinatarios, asunto, cuerpo);
}

function totalConfirmados(hoja) {
  const n = hoja.getLastRow() - 1;
  const r = { personas: 0, si: 0, no: 0 };
  if (n < 1) return r;
  hoja.getRange(2, 4, n, 2).getValues().forEach(([asiste, personas]) => {
    if (asiste === "Sí") { r.si++; r.personas += Number(personas) || 0; } else { r.no++; }
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

// Ejecuta esta función una vez desde el editor para autorizar el envío de correos
function probar() {
  doPost({ parameter: { codigo: "PRUEBA", nombre: "Prueba", asistencia: "Sí", personas: "2", pases: "2", mensaje: "Esto es una prueba" } });
}
