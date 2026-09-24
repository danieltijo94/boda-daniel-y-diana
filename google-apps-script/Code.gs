/**
 * Boda de Daniel Alejandro & Diana Carolina
 * - Lista oficial de invitados (pestaña "Lista de Invitados") y plano de mesas (pestaña "Mesas").
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

// Pestaña con la lista de invitados: una fila por persona. Columnas que se reconocen por su título:
// Nombre · Pases · Numero de Mesa · Familia · Código (Familia y Código se agregan solas al final si faltan).
// Pases vacío = 1. Pases 2 o más = esa persona trae acompañantes.
// Las filas con la misma Familia reciben una sola invitación; si Familia está vacía, la persona va sola.
const HOJA_INVITADOS = "Lista de Invitados";
const COL_MESAS = ["Mesa", "Sillas"];
const COLUMNAS = ["Fecha", "Código", "Familia", "Asistencia", "Personas", "Pases", "Asistentes", "Restricciones / alergias", "Canción", "No asisten"];
// Una fila por persona: quién va, quién no y su restricción (para el catering y el plano de mesas)
const HOJA_PERSONAS = "Asistencia por persona";
const COL_PERSONAS = ["Código", "Familia", "Invitado", "Nombre indicado", "¿Asiste?", "Restricción", "Actualizado"];

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
    // Los pases y el nombre de la familia salen de la lista de invitados
    const inv = p.codigo ? buscarInvitado(p.codigo) : null;
    const pases = inv && inv.ok ? inv.invitados.length : toInt(p.pases, 1);
    const detalle = leerDetalle(p, inv);
    const asiste = detalle ? detalle.some((x) => x.asiste) : p.asistencia === "Sí";
    const personas = detalle ? detalle.filter((x) => x.asiste).length
      : asiste ? Math.min(Math.max(toInt(p.personas, 1), 1), pases) : 0;
    const fila = [
      new Date(),
      limpiar(p.codigo),
      limpiar(inv && inv.ok ? inv.familia : p.nombre),
      asiste ? "Sí" : "No",
      personas,
      pases,
      limpiar(p.asistentes),
      limpiar(p.restricciones),
      limpiar(asiste ? p.cancion : ""),
      limpiar(p.noAsisten),
    ];

    const hoja = obtenerHoja();
    const codigo = fila[1];
    const existente = codigo ? buscarFila(hoja, codigo) : 0;
    if (existente) {
      hoja.getRange(existente, 1, 1, fila.length).setValues([fila]);
    } else {
      hoja.appendRow(fila);
    }

    if (detalle) guardarPorPersona(fila[1], fila[2], detalle);
    const errorPlaylist = asiste && p.cancion ? agregarAPlaylist(p.cancion) : null;
    enviarCorreo(fila, Boolean(existente), hoja, errorPlaylist, detalle);
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
    // La hoja que ya tiene los títulos de confirmaciones (empieza con "Fecha"); si no hay, se crea
    hoja = libro.getSheets().find((h) => String(h.getRange(1, 1).getValues()[0][0]).trim() === "Fecha")
      || libro.insertSheet("Confirmaciones");
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

// Confirmación por persona que envía la invitación: [{ nombre, dado, asiste, restriccion }]
// Solo se aceptan los nombres de esa invitación (o la persona que confirma sin código).
function leerDetalle(p, inv) {
  let lista;
  try { lista = JSON.parse(p.detalle || "null"); } catch (err) { return null; }
  if (!Array.isArray(lista) || !lista.length) return null;
  const validos = inv && inv.ok ? inv.invitados : null;
  const vistos = {};
  const out = lista.filter((x) => {
    if (!x || vistos[x.nombre] || (validos && validos.indexOf(x.nombre) < 0)) return false;
    vistos[x.nombre] = true;
    return true;
  }).map((x) => ({
      nombre: limpiar(validos ? x.nombre : x.nombre || p.nombre).slice(0, 80),
      dado: limpiar(x.dado).slice(0, 60),
      asiste: x.asiste === true,
      restriccion: x.asiste === true ? limpiar(x.restriccion).slice(0, 150) : "",
    }));
  return out.length ? out.slice(0, validos ? validos.length : 1) : null;
}

// Reemplaza las filas de esa invitación en la pestaña "Asistencia por persona"
function guardarPorPersona(codigo, familia, detalle) {
  const hoja = hojaCon(HOJA_PERSONAS, COL_PERSONAS);
  const clave = (c, f) => (c ? String(c).toUpperCase() : "sin código|" + sinTildes(f));
  const yo = clave(codigo, familia);
  const n = hoja.getLastRow() - 1;
  const otras = n > 0 ? hoja.getRange(2, 1, n, COL_PERSONAS.length).getValues().filter((r) => clave(r[0], r[1]) !== yo) : [];
  const ahora = new Date();
  const nuevas = detalle.map((x) => [codigo, familia, x.nombre, x.dado, x.asiste ? "Sí" : "No", x.restriccion, ahora]);
  const filas = otras.concat(nuevas);
  if (n > 0) hoja.getRange(2, 1, n, COL_PERSONAS.length).clearContent();
  hoja.getRange(2, 1, filas.length, COL_PERSONAS.length).setValues(filas);
}

function enviarCorreo(fila, actualizado, hoja, errorPlaylist, detalle) {
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
  ].concat(detalle && codigo ? [""].concat(detalle.map((x) =>
    `${x.asiste ? "✓" : "✗"} ${x.dado ? `${x.dado} (${x.nombre})` : x.nombre}${x.restriccion ? " — " + x.restriccion : ""}`)) : [
    `Asistentes: ${asistentes || "—"}`,
    `Restricciones / alergias: ${restricciones || "—"}`,
  ]).concat([
    "",
    `Canción: ${cancion || "—"}` + (errorPlaylist === "" ? " (agregada a la playlist ✓)"
      : errorPlaylist ? ` (⚠️ no se agregó a la playlist: ${errorPlaylist})` : ""),
    "",
    `Total hasta ahora: ${totales.personas} personas confirmadas (${totales.si} sí · ${totales.no} no).`,
    `Ver la lista completa: ${hoja.getParent().getUrl()}`,
  ]).join("\n");

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

function sinTildes(s) {
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

// Pestaña de invitados (se busca sin importar mayúsculas); con crear=true se crea si no existe
function hojaInvitados(crear) {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = libro.getSheets().find((h) => sinTildes(h.getName()) === sinTildes(HOJA_INVITADOS))
    || libro.getSheetByName("Invitados");
  if (hoja || !crear) return hoja;
  const nueva = libro.insertSheet(HOJA_INVITADOS);
  nueva.getRange(1, 1, 1, 5).setValues([["Nombre", "Pases", "Numero de Mesa", "Familia", "Código"]])
    .setFontWeight("bold").setBackground("#f4dcdc");
  nueva.setFrozenRows(1);
  return nueva;
}

// Ubica cada columna por su título; con agregar=true crea al final las que falten (Familia, Código, Mesa)
function columnas(hoja, agregar) {
  const ancho = Math.max(hoja.getLastColumn(), 1);
  const titulos = hoja.getRange(1, 1, 1, ancho).getValues()[0].map(sinTildes);
  const col = (...nombres) => titulos.findIndex((t) => nombres.indexOf(t) >= 0) + 1;
  const c = {
    nombre: col("nombre", "nombres", "invitado"),
    pases: col("pases", "cupos"),
    mesa: col("numero de mesa", "mesa", "no. de mesa", "n° de mesa", "# de mesa"),
    familia: col("familia", "invitacion", "grupo"),
    codigo: col("codigo"),
  };
  if (agregar) {
    let siguiente = titulos.filter(Boolean).length ? ancho + 1 : 1;
    [["nombre", "Nombre"], ["mesa", "Numero de Mesa"], ["familia", "Familia"], ["codigo", "Código"]].forEach(([k, titulo]) => {
      if (c[k]) return;
      hoja.getRange(1, siguiente).setValue(titulo).setFontWeight("bold");
      c[k] = siguiente++;
    });
  }
  return c;
}

// Una fila por persona → { fila, codigo, familia, nombre, pases, mesa, conFamilia }
function leerInvitados(hoja, c) {
  c = c || columnas(hoja, false);
  const n = hoja.getLastRow() - 1;
  if (n < 1 || !c.nombre) return [];
  const valor = (r, k) => (c[k] ? String(r[c[k] - 1]).trim() : "");
  return hoja.getRange(2, 1, n, Math.max(hoja.getLastColumn(), 1)).getValues().map((r, i) => {
    const nombre = valor(r, "nombre");
    const familia = valor(r, "familia");
    return {
      fila: i + 2, nombre, conFamilia: Boolean(familia), familia: familia || nombre,
      codigo: valor(r, "codigo").toUpperCase(),
      pases: Math.max(1, toInt(valor(r, "pases"), 1)),
      mesa: valor(r, "mesa"),
    };
  }).filter((x) => x.nombre);
}

// Nombres para la invitación: la persona y sus acompañantes (si Pases es mayor que 1)
function conAcompanantes(x) {
  const extra = x.pases - 1;
  const nombres = [x.nombre];
  for (let i = 1; i <= extra; i++) nombres.push(extra === 1 ? `Acompañante de ${x.nombre}` : `Acompañante ${i} de ${x.nombre}`);
  return nombres;
}

// Da un código a cada invitación que no lo tenga. Las filas con la misma Familia quedan con el mismo
// código (el de la primera fila de esa familia), aunque se hayan agrupado después.
function completarCodigos(hoja) {
  const c = columnas(hoja, true);
  const filas = leerInvitados(hoja, c);
  const porFamilia = {};
  const usados = {};
  filas.forEach((x) => {
    if (!x.codigo) return;
    usados[x.codigo] = true;
    if (x.conFamilia) porFamilia[sinTildes(x.familia)] = porFamilia[sinTildes(x.familia)] || x.codigo;
  });
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let nuevos = 0;
  filas.forEach((x) => {
    const deFamilia = x.conFamilia ? porFamilia[sinTildes(x.familia)] : "";
    if (x.codigo && (!deFamilia || deFamilia === x.codigo)) return;
    let codigo = deFamilia;
    if (!codigo) {
      do { codigo = ""; for (let i = 0; i < 5; i++) codigo += letras[Math.floor(Math.random() * letras.length)]; } while (usados[codigo]);
      usados[codigo] = true;
      if (x.conFamilia) porFamilia[sinTildes(x.familia)] = codigo;
    }
    hoja.getRange(x.fila, c.codigo).setValue(codigo);
    nuevos++;
  });
  return nuevos;
}

function buscarInvitado(codigo) {
  const cod = String(codigo || "").trim().toUpperCase();
  if (!cod) return { ok: false, error: "sin código" };
  const hoja = hojaInvitados(false);
  const filas = hoja ? leerInvitados(hoja).filter((x) => x.codigo === cod) : [];
  if (!filas.length) return { ok: false, error: "no existe" };
  const invitados = [];
  filas.forEach((x) => invitados.push(...conAcompanantes(x)));
  return { ok: true, codigo: cod, familia: filas[0].familia, invitados };
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
  const hoja = hojaInvitados(true);
  completarCodigos(hoja);
  const conf = {};
  const hc = obtenerHoja();
  const n = hc.getLastRow() - 1;
  if (n > 0) {
    hc.getRange(2, 1, n, COLUMNAS.length).getValues().forEach((r) => {
      const c = String(r[1]).trim().toUpperCase();
      if (c) conf[c] = { asistencia: r[3], asistentes: String(r[6]).split(",").map((x) => x.trim()).filter(Boolean), restricciones: {} };
    });
  }
  // La asistencia por persona (formulario nuevo) manda sobre el resumen de la fila
  const hp = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA_PERSONAS);
  const np = hp ? hp.getLastRow() - 1 : 0;
  if (np > 0) {
    const porCodigo = {};
    hp.getRange(2, 1, np, COL_PERSONAS.length).getValues().forEach((r) => {
      const c = String(r[0]).trim().toUpperCase();
      if (!c) return;
      porCodigo[c] = porCodigo[c] || { asistentes: [], restricciones: {} };
      if (r[4] === "Sí") porCodigo[c].asistentes.push(String(r[2]));
      if (r[5]) porCodigo[c].restricciones[String(r[2])] = String(r[5]);
    });
    Object.keys(porCodigo).forEach((c) => {
      conf[c] = { asistencia: porCodigo[c].asistentes.length ? "Sí" : "No", ...porCodigo[c] };
    });
  }
  const familias = [];
  const indice = {};
  leerInvitados(hoja).forEach((x) => {
    if (!indice[x.codigo]) {
      indice[x.codigo] = { codigo: x.codigo, familia: x.familia, personas: [], confirmacion: conf[x.codigo] || null };
      familias.push(indice[x.codigo]);
    }
    const nombres = conAcompanantes(x);
    const r = conf[x.codigo] ? conf[x.codigo].restricciones : {};
    const restricciones = nombres.filter((nm) => r[nm]).map((nm) => (nombres.length > 1 ? `${nm}: ${r[nm]}` : r[nm]));
    indice[x.codigo].personas.push({ nombre: x.nombre, pases: x.pases, nombres, mesa: x.mesa, restricciones });
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
    const hi = hojaInvitados(true);
    const c = columnas(hi, true);
    const asig = d.asignaciones || {};
    leerInvitados(hi, c).forEach((x) => {
      const k = x.codigo + "|" + x.nombre;
      if (k in asig && String(asig[k]) !== x.mesa) hi.getRange(x.fila, c.mesa).setValue(limpiar(asig[k]));
    });
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

// Menú en la hoja de cálculo
function onOpen() {
  SpreadsheetApp.getUi().createMenu("💍 Boda")
    .addItem("Preparar lista de invitados y mesas", "prepararHojas")
    .addItem("Generar códigos que falten", "generarCodigos")
    .addToUi();
}

function generarCodigos() {
  const n = completarCodigos(hojaInvitados(true));
  console.log(n ? `Se generaron códigos para ${n} filas.` : "Todas las filas ya tienen código.");
}

// Ejecuta esta función una vez: agrega las columnas Familia y Código a la lista de invitados (o la crea
// con datos de ejemplo si no existe), crea la pestaña Mesas y genera los códigos que falten
function prepararHojas() {
  let hi = hojaInvitados(false);
  if (!hi) {
    hi = hojaInvitados(true);
    hi.getRange(2, 1, 4, 4).setValues([
      ["Daniel Tijo", "", "Novios", "Daniel Tijo y Diana Sanchez"],
      ["Diana Sanchez", "", "Novios", "Daniel Tijo y Diana Sanchez"],
      ["Tía Marta", 2, "1", ""],
      ["Carlos Pérez", 1, "", "Familia Pérez"],
    ]);
  }
  const hm = hojaCon("Mesas", COL_MESAS);
  if (hm.getLastRow() < 2) hm.getRange(2, 1, 2, 2).setValues([["1", 10], ["2", 10]]);
  columnas(hi, true);
  obtenerHoja();
  console.log(`Listo: lista de invitados ("${hi.getName()}") con columnas Familia y Código, Mesas y Confirmaciones.` +
    " Llena la columna Familia para agrupar a quienes van en la misma invitación; los códigos se crean al abrir enlaces.html.");
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
