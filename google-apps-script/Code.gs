/**
 * Boda de Daniel Alejandro & Diana Carolina
 * - Lista oficial de invitados (pestaña "Invitados") y plano de mesas (pestaña "Mesas").
 * - Confirmaciones: guarda cada respuesta (pestaña "Confirmaciones") y envía un correo de aviso.
 * Instrucciones: ver CONFIGURAR-CORREO.md e INVITADOS-Y-MESAS.md en el repositorio.
 */

// Correos adicionales que también deben recibir el aviso (opcional)
const CORREOS_EXTRA = []; // ej: ["diana@gmail.com"]

// Playlist de YouTube (ver PLAYLIST.md). La playlist está en otra cuenta, así que las canciones
// se envían al script de esa cuenta:
const PLAYLIST_WEBAPP_URL = ""; // URL (termina en /exec) del script Playlist-pareja.gs
const PLAYLIST_CLAVE = "";      // la misma palabra secreta que en Playlist-pareja.gs

// Clave de los novios para ver la lista completa (enlaces.html) y guardar el plano (mesas.html).
// Escríbela solo aquí en Apps Script; nunca en el repositorio.
const CLAVE_NOVIOS = "";

const COL_INVITADOS = ["Código", "Familia", "Invitado", "Mesa"];
const COL_MESAS = ["Mesa", "Sillas"];
const COLUMNAS = ["Fecha", "Código", "Familia", "Asistencia", "Personas", "Pases", "Asistentes", "Restricciones / alergias", "Canción"];

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Lecturas: la invitación pide su familia; enlaces.html y mesas.html piden la lista completa (con clave)
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.accion === "invitado") return responder(buscarInvitado(p.codigo));
  if (p.accion === "lista") {
    if (!claveOk(p.clave)) return responder({ ok: false, error: "clave" });
    return responder(listaCompleta());
  }
  return responder({ ok: true, mensaje: "El script de la boda está funcionando" });
}

function doPost(e) {
  // Plano de mesas: llega como JSON en texto
  if (e && e.postData && String(e.postData.contents || "").trim().charAt(0) === "{") {
    let d;
    try { d = JSON.parse(e.postData.contents); } catch (err) { return responder({ ok: false, error: "datos" }); }
    if (d.accion === "guardarMesas") return responder(guardarMesas(d));
    return responder({ ok: false, error: "accion" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (!p.nombre || !p.asistencia) return responder({ ok: false, error: "faltan datos" });
    // Los pases y el nombre de la familia salen de la pestaña "Invitados"
    const inv = p.codigo ? buscarInvitado(p.codigo) : null;
    const pases = inv && inv.ok ? inv.invitados.length : toInt(p.pases, 1);
    const asiste = p.asistencia === "Sí";
    const personas = asiste ? Math.min(Math.max(toInt(p.personas, 1), 1), pases) : 0;
    const fila = [
      new Date(),
      limpiar(p.codigo),
      limpiar(inv && inv.ok ? inv.familia : p.nombre),
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

    const errorPlaylist = p.cancion ? agregarAPlaylist(p.cancion) : null;
    enviarCorreo(fila, Boolean(existente), hoja, errorPlaylist);
    return responder({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function obtenerHoja() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName("Confirmaciones");
  if (!hoja) {
    // La primera hoja que no sea de invitados ni mesas pasa a llamarse "Confirmaciones"
    hoja = libro.getSheets().find((h) => ["Invitados", "Mesas"].indexOf(h.getName()) < 0) || libro.insertSheet();
    hoja.setName("Confirmaciones");
  }
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

function enviarCorreo(fila, actualizado, hoja, errorPlaylist) {
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
    `Canción: ${cancion || "—"}` + (errorPlaylist === "" ? " (agregada a la playlist ✓)"
      : errorPlaylist ? ` (⚠️ no se agregó a la playlist: ${errorPlaylist})` : ""),
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
// Devuelve "" si se agregó, o el motivo por el que no se pudo.
function agregarAPlaylist(url) {
  const videoId = idDeYouTube(url);
  if (!videoId) return "el link no es de un video de YouTube";
  if (!PLAYLIST_WEBAPP_URL || !PLAYLIST_CLAVE) return "falta PLAYLIST_WEBAPP_URL o PLAYLIST_CLAVE en la versión publicada";
  try {
    const res = UrlFetchApp.fetch(PLAYLIST_WEBAPP_URL, {
      method: "post",
      payload: { clave: PLAYLIST_CLAVE, video: videoId },
      muteHttpExceptions: true,
    });
    const texto = res.getContentText();
    let r;
    try { r = JSON.parse(texto); } catch (e) {
      return "el script de la playlist respondió algo inesperado (código " + res.getResponseCode() + "). Revisa que su acceso sea 'Cualquier usuario'";
    }
    if (r.ok === true) return "";
    if (r.error === "clave") return "la clave no coincide con la del script de la playlist";
    return "el script de la playlist no pudo agregarla (" + (r.error || "sin detalle") + ")";
  } catch (err) {
    return "no se pudo conectar con el script de la playlist: " + err;
  }
}

/* ---------- Invitados y mesas ---------- */
function claveOk(clave) {
  return Boolean(CLAVE_NOVIOS) && String(clave || "") === CLAVE_NOVIOS;
}

function hojaCon(nombre, columnas) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = libro.getSheetByName(nombre);
  if (!hoja) hoja = libro.insertSheet(nombre);
  hoja.getRange(1, 1, 1, columnas.length).setValues([columnas]).setFontWeight("bold").setBackground("#f4dcdc");
  hoja.setFrozenRows(1);
  return hoja;
}

// Una fila por persona: Código | Familia | Invitado | Mesa
function leerInvitados(hoja) {
  const n = hoja.getLastRow() - 1;
  if (n < 1) return [];
  const cuenta = {};
  return hoja.getRange(2, 1, n, 4).getValues().map((r, i) => {
    const familia = String(r[1]).trim();
    const codigo = String(r[0]).trim().toUpperCase();
    cuenta[familia] = (cuenta[familia] || 0) + 1;
    return {
      fila: i + 2, codigo, familia,
      nombre: String(r[2]).trim() || `${familia} (${cuenta[familia]})`,
      mesa: String(r[3]).trim(),
    };
  }).filter((x) => x.familia);
}

// Da un código a cada familia que no lo tenga (la misma familia comparte código)
function completarCodigos(hoja) {
  const filas = leerInvitados(hoja);
  const porFamilia = {};
  const usados = {};
  filas.forEach((x) => { if (x.codigo) { usados[x.codigo] = true; porFamilia[x.familia] = porFamilia[x.familia] || x.codigo; } });
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let nuevos = 0;
  filas.forEach((x) => {
    if (x.codigo) return;
    let c = porFamilia[x.familia];
    if (!c) {
      do { c = ""; for (let i = 0; i < 5; i++) c += letras[Math.floor(Math.random() * letras.length)]; } while (usados[c]);
      usados[c] = true;
      porFamilia[x.familia] = c;
    }
    hoja.getRange(x.fila, 1).setValue(c);
    nuevos++;
  });
  return nuevos;
}

function buscarInvitado(codigo) {
  const c = String(codigo || "").trim().toUpperCase();
  if (!c) return { ok: false, error: "sin código" };
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Invitados");
  const filas = hoja ? leerInvitados(hoja).filter((x) => x.codigo === c) : [];
  if (!filas.length) return { ok: false, error: "no existe" };
  return { ok: true, codigo: c, familia: filas[0].familia, invitados: filas.map((x) => x.nombre) };
}

function leerMesas() {
  const hoja = hojaCon("Mesas", COL_MESAS);
  const n = hoja.getLastRow() - 1;
  if (n < 1) return [];
  return hoja.getRange(2, 1, n, 2).getValues()
    .filter((r) => String(r[0]).trim())
    .map((r) => ({ mesa: String(r[0]).trim(), sillas: toInt(r[1], 10) }));
}

// Lista para los novios: familias, personas con su mesa, confirmación y mesas
function listaCompleta() {
  const hoja = hojaCon("Invitados", COL_INVITADOS);
  completarCodigos(hoja);
  const conf = {};
  const hc = obtenerHoja();
  const n = hc.getLastRow() - 1;
  if (n > 0) {
    hc.getRange(2, 1, n, COLUMNAS.length).getValues().forEach((r) => {
      const c = String(r[1]).trim().toUpperCase();
      if (c) conf[c] = { asistencia: r[3], asistentes: String(r[6]).split(",").map((x) => x.trim()).filter(Boolean) };
    });
  }
  const familias = [];
  const indice = {};
  leerInvitados(hoja).forEach((x) => {
    if (!indice[x.codigo]) {
      indice[x.codigo] = { codigo: x.codigo, familia: x.familia, personas: [], confirmacion: conf[x.codigo] || null };
      familias.push(indice[x.codigo]);
    }
    indice[x.codigo].personas.push({ nombre: x.nombre, mesa: x.mesa });
  });
  return { ok: true, familias, mesas: leerMesas() };
}

// Guarda el plano: las mesas (nombre y sillas) y la mesa de cada persona
function guardarMesas(d) {
  if (!claveOk(d.clave)) return { ok: false, error: "clave" };
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const hm = hojaCon("Mesas", COL_MESAS);
    if (hm.getLastRow() > 1) hm.getRange(2, 1, hm.getLastRow() - 1, 2).clearContent();
    const mesas = (d.mesas || []).map((m) => [limpiar(m.mesa), toInt(m.sillas, 10)]);
    if (mesas.length) hm.getRange(2, 1, mesas.length, 2).setValues(mesas);

    // Cada persona se reconoce por "código|nombre"; las filas nuevas que no conocía el plano no se tocan
    const hi = hojaCon("Invitados", COL_INVITADOS);
    const asig = d.asignaciones || {};
    leerInvitados(hi).forEach((x) => {
      const k = x.codigo + "|" + x.nombre;
      if (k in asig && String(asig[k]) !== x.mesa) hi.getRange(x.fila, 4).setValue(limpiar(asig[k]));
    });
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Menú en la hoja de cálculo
function onOpen() {
  SpreadsheetApp.getUi().createMenu("💍 Boda")
    .addItem("Preparar pestañas Invitados y Mesas", "prepararHojas")
    .addItem("Generar códigos que falten", "generarCodigos")
    .addToUi();
}

function generarCodigos() {
  const n = completarCodigos(hojaCon("Invitados", COL_INVITADOS));
  console.log(n ? `Se generaron códigos para ${n} filas.` : "Todas las filas ya tienen código.");
}

// Ejecuta esta función una vez: crea las pestañas y, si están vacías, pone invitados y mesas de ejemplo
function prepararHojas() {
  const hi = hojaCon("Invitados", COL_INVITADOS);
  if (hi.getLastRow() < 2) {
    const ejemplo = [
      ["DT7K2", "Daniel Tijo y Diana Sanchez", "Daniel Tijo", "Novios"],
      ["DT7K2", "Daniel Tijo y Diana Sanchez", "Diana Sanchez", "Novios"],
      ["FP4M9", "Familia Pérez Gómez", "Carlos Pérez", "1"],
      ["FP4M9", "Familia Pérez Gómez", "María Gómez", "1"],
      ["FP4M9", "Familia Pérez Gómez", "Juan Pérez", "1"],
      ["FP4M9", "Familia Pérez Gómez", "Laura Pérez", "1"],
      ["TM8Q1", "Tía Marta", "Marta Rodríguez", "1"],
      ["JL3R6", "Juan y Laura", "Juan Martínez", ""],
      ["JL3R6", "Juan y Laura", "Laura Ríos", ""],
    ];
    hi.getRange(2, 1, ejemplo.length, 4).setValues(ejemplo);
  }
  const hm = hojaCon("Mesas", COL_MESAS);
  if (hm.getLastRow() < 2) hm.getRange(2, 1, 3, 2).setValues([["Novios", 10], ["1", 10], ["2", 10]]);
  obtenerHoja();
  completarCodigos(hi);
  console.log("Listo: pestañas Invitados, Mesas y Confirmaciones preparadas.");
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
  const error = agregarAPlaylist("https://youtu.be/2Vv-BfVoq4g");
  console.log(error ? "No se agregó: " + error : "¡Canción agregada a la playlist!");
}

// Ejecuta esta función una vez desde el editor para autorizar el envío de correos
function probar() {
  doPost({ parameter: {
    codigo: "PRUEBA", nombre: "Familia Prueba", asistencia: "Sí", personas: "2", pases: "2",
    asistentes: "Invitado Uno, Invitado Dos", restricciones: "Vegetariano", cancion: "",
  } });
}
