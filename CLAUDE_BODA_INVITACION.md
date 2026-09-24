# 💍 Invitación de boda · Daniel Alejandro & Diana Carolina

Documento de seguimiento del proyecto: qué se hizo, cómo funciona, qué falta y la última versión de cada pieza.

> **Última actualización:** 24 de septiembre de 2026 (plan de nuevas funciones)
> **Rama de trabajo:** `claude/tender-cerf-3qmwm1` (es la que publica GitHub Pages)

---

## 1. Última versión de la tarjeta

| | |
|---|---|
| **Invitación publicada** | https://danieltijo94.github.io/boda-daniel-y-diana/ |
| **Ejemplo con invitado** | https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9 (Familia Pérez Gómez, 4 pases) |
| **Prueba propia** | https://danieltijo94.github.io/boda-daniel-y-diana/?i=DT7K2 |
| **Enlaces para enviar por WhatsApp** | https://danieltijo94.github.io/boda-daniel-y-diana/enlaces.html |
| **Página de fotos (destino del QR)** | https://danieltijo94.github.io/boda-daniel-y-diana/fotos.html |
| **Tarjeta QR para imprimir (mesas)** | https://danieltijo94.github.io/boda-daniel-y-diana/qr-mesa.html |
| **Hoja de confirmaciones (Google Sheets)** | https://docs.google.com/spreadsheets/d/1dJpGfw0tYUVGXEwcRdgg4oP-WTlBkTo9WSq6OkTh2No/edit |
| **Script de confirmaciones (URL publicada)** | configurada en `script.js` → `CONFIG.rsvpEndpoint` |

**Versión actual del diseño:** *orquídeas + dorado* (rediseño del commit `e88c476`, con Waze, QR de fotos y
playlist añadidos en `bf3d469` y posteriores). Es la que se ve en el link de arriba.

### Datos de la boda
- **Novios:** Daniel Alejandro & Diana Carolina
- **Fecha:** sábado 19 de junio de 2027, 4:00 p.m. (hora de Colombia)
- **Lugar (ceremonia y recepción):** Hacienda Chic, Bogotá — [Google Maps](https://maps.app.goo.gl/DuaCmXVdwyJRUusX6)
- **Confirmar antes del:** 30 de abril de 2027
- **Código de vestimenta:** Formal · colores reservados: blanco (novia), burdeos (damas de honor), azul noche (novio)
- **Regalos:** lluvia de sobres (sin datos bancarios)
- **Evento solo para adultos**

### Qué tiene la invitación (en orden)
1. **Aviso para Samsung Internet**: pantalla vino y dorado con botón "Abrir en Chrome" (Samsung oscurece la página a la fuerza) y opción "Continuar aquí".
2. **Sobre animado** rosado con sello de cera "D&D"; al tocarlo se abre, sale la carta, caen pétalos y suena la música.
3. **Portada**: marco dorado doble, monograma D&D, "Con la bendición de Dios y de nuestras familias", nombres en caligrafía, fecha y lugar, ramas de orquídeas animadas.
4. **Tarjeta del invitado**: cita de Cantares 8:7, nombre de la familia y número de pases.
5. **Cuenta regresiva** + botón "Agendar en mi calendario" (Google Calendar).
6. **¿Dónde y cuándo?**: Hacienda Chic, botones **Google Maps** y **Waze**.
7. **Itinerario**: 4:00 Coffee time · 5:00 Ceremonia religiosa · 6:00 Brindis · 6:30 Cena · 7:30 ¡A celebrar!
8. **Galería** "Nuestra historia" (espacios para fotos, pendiente).
9. **Código de vestimenta**: Formal + colores reservados.
10. **Regalos**: texto de lluvia de sobres.
11. **Comparte tus fotos**: QR + botón hacia `fotos.html`.
12. **Confirma tu asistencia** (formulario dentro de la invitación):
    - ¿Nos acompañarás? → "¡Sí, ahí estaré!" / "No podré asistir".
    - Si es "Sí": casillas con **el nombre de cada invitado de la tarjeta** para marcar quiénes asisten,
      **restricciones alimenticias o alergias** y **link de YouTube de la canción que no puede faltar**.
    - Al enviar: destellos, mensaje de gracias y opción "Cambiar mi respuesta".
13. **Pie**: nombres, fecha 19 · 06 · 2027 y agradecimiento.

**Estilo:** fondo marfil y rosa, orquídeas phalaenopsis (SVG propias), detalles dorados, letras Pinyon Script
(caligrafía), Cinzel (mayúsculas) y Cormorant Garamond (texto). Pétalos de orquídea y destellos dorados cayendo.

---

## 2. Cómo funciona

### Archivos del repositorio
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación |
| `styles.css` | Diseño (colores, letras, animaciones) |
| `script.js` | Lógica: `CONFIG` (fecha, fecha límite, URL del script, lugar), invitado por código, formulario, cuenta regresiva |
| `invitados.csv` | **Lista de invitados** (código, familia y nombres) |
| `enlaces.html` | Lista de todos los enlaces personalizados con botón de WhatsApp |
| `fotos.html` | Página del QR: abre el álbum compartido (`ALBUM_URL`, pendiente) |
| `qr-mesa.html` | Tarjeta A6 para imprimir con el QR de fotos |
| `assets/qr-fotos.svg` | Código QR (apunta a `fotos.html`, nunca cambia) |
| `assets/cancion.mp3` | Música de fondo (**pendiente**) |
| `google-apps-script/Code.gs` | Script de confirmaciones (cuenta de Daniel, en la hoja) |
| `google-apps-script/Playlist-pareja.gs` | Script de la playlist (cuenta de la pareja, dueña de la playlist) |
| `google-apps-script/appsscript-pareja.json` | Manifiesto para activar YouTube en el script de la pareja |
| `CONFIGURAR-CORREO.md`, `PLAYLIST.md`, `FOTOS.md` | Guías paso a paso |

### Invitados por código
Cada familia recibe un enlace con un código: `https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9`. La invitación busca el código en
`invitados.csv` y muestra su nombre y pases. Si alguien cambia el código por uno que no existe, ve la
invitación general sin nombre ni pases.

Formato de `invitados.csv` (los nombres van separados por `|`; la cantidad de nombres = número de pases):
```
codigo,familia,invitados
DT7K2,Daniel Tijo y Diana Sanchez,Daniel Tijo|Diana Sanchez
FP4M9,Familia Pérez Gómez,Carlos Pérez|María Gómez|Juan Pérez|Laura Pérez
TM8Q1,Tía Marta,Marta Rodríguez
JL3R6,Juan y Laura,Juan Martínez|Laura Ríos
```
> ⚠️ Los datos actuales son **de ejemplo**. Falta la lista real.
> Nota: el repositorio es público, así que quien conozca la dirección exacta de `invitados.csv` podría verlo.

### Confirmaciones → hoja + correo + playlist
```
Invitado confirma en la invitación
        │
        ▼
Script de confirmaciones (Code.gs, cuenta de Daniel)
   ├─ guarda / actualiza la fila en la hoja "Confirmaciones Boda Daniel y Diana"
   ├─ si hay canción → la envía al script de la pareja (con palabra secreta)
   │        └─ Playlist-pareja.gs agrega el video a la playlist PLSZ7h_cwdW9k (si no está)
   └─ envía correo: familia, asistentes, restricciones, canción (✓ agregada / ⚠️ motivo) y totales
```
- Si una familia vuelve a confirmar, **se actualiza su fila** (no se duplica).
- La **palabra secreta** compartida entre los dos scripts **no se guarda en el repositorio** (es público):
  está solo en los scripts de Google y en el chat.
- Cada vez que se cambia un script hay que publicar: **Implementar → Gestionar implementaciones → ✏️ →
  Versión: Nueva versión → Implementar** (la URL no cambia).

### Publicación
GitHub Pages publica la rama `claude/tender-cerf-3qmwm1` (Settings → Pages). Cada cambio subido se ve en
1–3 minutos. Los archivos `styles.css` y `script.js` llevan `?v=…` para que los celulares no usen versiones viejas.

---

## 3. Estado actual y pendientes

### ⏳ En curso
- **Playlist:** el script de la pareja ya agrega canciones (probado ✅). Falta confirmar que **la versión
  publicada** del script de confirmaciones tenga `PLAYLIST_WEBAPP_URL` y `PLAYLIST_CLAVE` y hacer una prueba
  desde la invitación. El correo ahora dice "(agregada a la playlist ✓)" o el motivo si falla.

### 📋 Pendiente de ustedes
- [ ] Lista real de invitados (familia + nombre de cada persona).
- [ ] Fotos para la galería "Nuestra historia".
- [ ] Canción de fondo (`assets/cancion.mp3`).
- [ ] Crear el **álbum compartido de Google Fotos** (con "Colaborar" y "Compartir mediante enlace") y pasar el link para `fotos.html`.
- [ ] Revisar que el botón de **Waze** llegue al sitio correcto; si no, pasar las coordenadas del lugar.
- [ ] Probar en Samsung Internet el botón **"Abrir en Chrome"**.
- [ ] (Opcional) Agregar a Diana en `CORREOS_EXTRA` para que también reciba los avisos.

### 🛠️ Plan de trabajo: nuevas funciones (se hacen una a una y se prueban antes de seguir)

**Orden propuesto:** 1 → 2 → 3 → 4 → 5 → 6 → 7. El plano de mesas va antes que el pase QR y el modo "día de
la boda", porque ambos muestran la mesa de cada familia.

| # | Función | Estado |
|---|---|---|
| 1 | Información de llegada y transporte | ⏳ Siguiente |
| 2 | Clima en vivo | 🔜 Por hacer |
| 3 | Plano de mesas | 🔜 Por hacer |
| 4 | Pase QR de entrada por familia | 🔜 Por hacer |
| 5 | Modo "día de la boda" | 🔜 Por hacer |
| 6 | Página de agradecimiento | 🔜 Por hacer |
| 7 | Panel de los novios | 🔜 Por hacer (al final) |

**1. Información de llegada y transporte** (en vez de preguntas frecuentes)
- Nueva sección elegante junto a "¿Dónde y cuándo?", con íconos dorados:
  - 🚗 **Parqueadero limitado:** los cupos para carros son limitados, por lo que se recomienda no llevar carro.
  - 🔑 **Valet parking:** disponible en el lugar, bajo la responsabilidad de cada invitado.
  - 🍸 **Conductor elegido:** se puede contratar directamente en el sitio, con costo adicional.
  - 🌙 **Hora de finalización:** la celebración termina a las **12:00 de la noche**.
- Agregar "12:00 a.m. · Fin de la celebración" al itinerario. El evento del calendario ya termina a medianoche.

**2. Clima en vivo**
- Cada vez que se abre la invitación se consulta el clima en línea (Open-Meteo: gratis y sin registro).
- **Hasta 16 días antes:** se muestra el **pronóstico real** del 19 de junio, de 4 p.m. a 12 a.m. (temperatura,
  probabilidad de lluvia y un consejo, por ejemplo "lleva abrigo" o "lleva paraguas").
- **Antes de eso:** muestra el clima típico de junio en Bogotá y el aviso "el pronóstico estará disponible desde el 3 de junio".
- Se necesitan las **coordenadas de Hacienda Chic** (mientras tanto se usa Bogotá).

**3. Plano de mesas**
- Nueva columna `mesa` en `invitados.csv`.
- Página `mesas.html` para los novios: plano visual de las mesas con quién se sienta en cada una
  (para revisar e imprimir para la entrada).
- La mesa se muestra en la invitación **solo el día de la boda** (ver punto 5) y en el pase QR.

**4. Pase QR de entrada por familia**
- Cuando una familia confirma "Sí", su invitación muestra un **pase con código QR** (familia, personas confirmadas y mesa).
- Página `entrada.html` (protegida con clave) para quien reciba en la puerta: escanea el QR con la cámara del
  celular, muestra familia, cuántos confirmaron y su mesa, y **registra la llegada** en la hoja.
- Requiere actualizar el script de confirmaciones (nueva columna "Llegada").

**5. Modo "día de la boda"**
- El 19 de junio de 2027 la invitación cambia sola:
  - **Itinerario en vivo:** "Ahora: Brindis 🥂 · Siguiente: Cena 6:30".
  - **"Tu mesa es la 5"** y el pase QR a la vista.
  - Botones grandes para **subir fotos** y **ver la playlist**.
- Para probarlo antes se usará un link especial (por ejemplo `?modo=boda`).

**6. Página de agradecimiento**
- Desde el 20 de junio de 2027 la invitación se convierte en "¡Gracias por acompañarnos!", con el álbum de
  fotos de los invitados, la playlist y el espacio para las fotos oficiales.
- Para probarlo antes: `?modo=gracias`.

**7. Panel de los novios** *(se hace al final)*
- Página con clave: confirmados, pendientes y quiénes no asisten; resumen de restricciones para el catering;
  canciones sugeridas; recordatorio por WhatsApp a los pendientes. Incluye la idea del "recordatorio de pendientes".

### 💡 Ideas propuestas que aún no se programan
1. **Mensaje personal para cada familia** (columna en `invitados.csv`).
2. **"Agendar" en iPhone y Outlook** (archivo de calendario .ics, además de Google Calendar).
3. **Nuestra historia**: línea de tiempo con fotos (cómo se conocieron, primera cita, propuesta).
4. **Libro de buenos deseos**: los invitados dejan un mensaje (se guarda en la hoja).
5. **Trivia "¿Cuánto conoces a los novios?"** con ranking.
6. **Versión en inglés** con botón para cambiar el idioma.
7. **Invitación en PDF para imprimir** (abuelos o quien prefiera papel).
8. **Transmisión en vivo** para quien no pueda asistir.
9. **Sección de hospedaje** para invitados de fuera de Bogotá.
10. **Hashtag de la boda** para las redes sociales.
11. **Mostrar la playlist en la invitación** o compartirla con el DJ (se incluirá en los puntos 5 y 6 del plan).
12. **Versión nocturna** de la invitación (descartada por ahora; se optó por el aviso "Abrir en Chrome").
13. Publicar desde la rama `main` en lugar de la rama de trabajo.

### 🗂️ Decisiones tomadas (para no repetir)
- **Este documento se actualiza con cada cambio** (regla guardada en `CLAUDE.md`).
- Las **preguntas frecuentes** se reemplazan por una sección de **llegada y transporte**.
- Las nuevas funciones se hacen **una a una**, probando cada una antes de seguir.
- **Confirmación dentro de la invitación** (no Google Form), guardada en Google Sheets + correo vía Apps Script.
- **Invitados por código** en `invitados.csv` (no `?familia=…&pases=…`, que cualquiera podía editar).
- **Modo oscuro:** Chrome se controla con `color-scheme`; **Samsung Internet no se puede controlar** → aviso "Abrir en Chrome". El truco de invertir colores se probó y se retiró.
- **Fotos de invitados:** álbum compartido de Google Fotos (no ocupa el espacio de la cuenta de los novios, no requiere script).
- **Playlist:** vive en la cuenta de la pareja; por eso existe un segundo script (YouTube solo deja editar a la dueña).
- Se quitaron: sección de padres, datos bancarios y paleta de colores sugerida.

---

## 4. Historial de cambios

| Commit | Fecha | Cambio |
|---|---|---|
| `8aadd3f` | 2026-09-22 21:29 | Invitación de boda floral: sobre animado, música, cuenta regresiva y secciones |
| `88c6016` | 2026-09-22 21:36 | Invitados por código desde invitados.csv |
| `39e235b` | 2026-09-22 21:40 | Confirmación de asistencia dentro de la invitación con aviso por correo |
| `1717b78` | 2026-09-22 21:43 | Usar la hoja de confirmaciones creada en Drive |
| `355a107` | 2026-09-22 21:49 | Conectar la confirmación de asistencia al Apps Script |
| `1615ce7` | 2026-09-22 21:56 | Evitar que el modo oscuro del celular altere los colores |
| `e82b0d0` | 2026-09-22 22:01 | Mantener la paleta rosa con el modo oscuro de Samsung Internet |
| `e200dd4` | 2026-09-22 22:07 | Forzar descarga de la versión nueva de estilos y script |
| `efd05f2` | 2026-09-22 22:14 | Compensar el modo oscuro forzado de Samsung Internet |
| `06922f9` | 2026-09-22 22:30 | Sugerir abrir la invitación en Chrome desde Samsung Internet |
| `e88c476` | 2026-09-23 01:07 | Rediseño con orquídeas y datos reales de la boda |
| `bf3d469` | 2026-09-23 01:16 | Waze, QR para fotos de invitados y playlist de YouTube |
| `d680e5a` | 2026-09-23 01:30 | Configurar la playlist de YouTube de la boda |
| `567a9f0` | 2026-09-23 01:41 | Crear la playlist desde el script y diagnosticar permisos |
| `4119871` | 2026-09-23 01:43 | Agregar canciones a la playlist de la cuenta de la pareja |
| `50e8b17` | 2026-09-23 01:54 | Manifiesto para activar YouTube sin el diálogo de servicios |
| `af8af1c` | 2026-09-23 02:04 | Revisar la playlist real antes de agregar una canción |
| `6425697` | 2026-09-24 16:43 | Explicar en el correo por qué una canción no llegó a la playlist |
| `2f16850` | 2026-09-24 | Documento de seguimiento del proyecto (este archivo) |
| `7ecc05d` | 2026-09-24 | Regla en `CLAUDE.md`: actualizar este documento con cada cambio |
| `cf5c79a` | 2026-09-24 | Plan de trabajo de nuevas funciones (llegada, clima, mesas, pase QR, modo boda, agradecimiento) |
| — | 2026-09-24 | El panel de los novios entra al plan como último punto |

---

## 5. Última versión de los scripts

Para actualizarlos: copiar desde el link "raw", pegar en Apps Script, **volver a escribir los valores
secretos** (URL de la playlist y palabra secreta) y publicar una **nueva versión**.

### 5.1 `google-apps-script/Code.gs` — confirmaciones (cuenta de Daniel)
Link para copiar: https://raw.githubusercontent.com/danieltijo94/boda-daniel-y-diana/claude/tender-cerf-3qmwm1/google-apps-script/Code.gs

Valores a llenar en Apps Script (no se guardan en el repositorio):
`PLAYLIST_WEBAPP_URL` = URL `/exec` del script de la pareja · `PLAYLIST_CLAVE` = palabra secreta.

```javascript
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

    const errorPlaylist = p.cancion ? agregarAPlaylist(p.cancion) : null;
    enviarCorreo(fila, Boolean(existente), hoja, errorPlaylist);
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
```

### 5.2 `google-apps-script/Playlist-pareja.gs` — playlist (cuenta de la pareja)
Link para copiar: https://raw.githubusercontent.com/danieltijo94/boda-daniel-y-diana/claude/tender-cerf-3qmwm1/google-apps-script/Playlist-pareja.gs

Valor a llenar en Apps Script: `CLAVE` = la misma palabra secreta.

```javascript
/**
 * Script para la cuenta DUEÑA de la playlist de YouTube.
 * Recibe las canciones que envía el script de confirmaciones y las agrega a la playlist.
 * Instrucciones: ver PLAYLIST.md en el repositorio.
 */

// ID de la playlist (lo que va después de "list=" en su link)
const PLAYLIST_ID = "PLSZ7h_cwdW9k";

// Palabra secreta: debe ser EXACTAMENTE la misma en los dos scripts
const CLAVE = "";

function doPost(e) {
  const p = (e && e.parameter) || {};
  const responder = (obj) => ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  if (!CLAVE || p.clave !== CLAVE) return responder({ ok: false, error: "clave" });
  if (!/^[\w-]{11}$/.test(p.video || "")) return responder({ ok: false, error: "video" });
  const error = agregar(p.video);
  return responder(error ? { ok: false, error: error } : { ok: true });
}

// ¿La canción ya está en la playlist? (se revisa la playlist real, por si alguien la borró)
function yaEsta(videoId) {
  const r = YouTube.PlaylistItems.list("id", { playlistId: PLAYLIST_ID, videoId: videoId, maxResults: 1 });
  return (r.items || []).length > 0;
}

// Agrega el video a la playlist si todavía no está. Devuelve "" si todo salió bien, o el error.
function agregar(videoId) {
  try {
    if (yaEsta(videoId)) return "";
    YouTube.PlaylistItems.insert({
      snippet: { playlistId: PLAYLIST_ID, resourceId: { kind: "youtube#video", videoId: videoId } },
    }, "snippet");
    return "";
  } catch (err) {
    console.error("No se pudo agregar a la playlist: " + err);
    return String(err).slice(0, 200);
  }
}

// Ejecuta esta función una vez para dar permisos y comprobar que funciona
function probar() {
  const error = agregar("2Vv-BfVoq4g");
  console.log(error ? "No se agregó: " + error : "¡Canción agregada a la playlist!");
}
```

### 5.3 `appsscript.json` del script de la pareja (activa YouTube)
```json
{
  "timeZone": "America/Bogota",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "YouTube",
        "serviceId": "youtube",
        "version": "v3"
      }
    ]
  },
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8"
}
```
