# 💍 Invitación de boda · Daniel Alejandro & Diana Carolina

Documento de seguimiento del proyecto: qué se hizo, cómo funciona, qué falta y la última versión de cada pieza.

> **Última actualización:** 24 de septiembre de 2026 (punto 3: editor de mesas sobre la pestaña "Lista de Invitados")
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
| **Plano de mesas (novios, con clave)** | https://danieltijo94.github.io/boda-daniel-y-diana/mesas.html |
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
6. **¿Dónde y cuándo?**: Hacienda Chic (Cra. 7 #247-15, 4.8270016, -74.0314436), botones **Google Maps** y **Waze** (Waze va a las coordenadas exactas).
7. **El clima** (en vivo, Open-Meteo): se consulta cada vez que se abre la invitación. Muestra 4 p.m., 6 p.m.,
   9 p.m. y 12 a.m. con ícono, temperatura y lluvia, más un consejo (abrigo / paraguas).
   - Desde 15 días antes (4 de junio de 2027): **pronóstico real** del día de la boda.
   - Antes: **clima típico** calculado en vivo con lo que pasó del 12 al 26 de junio de los últimos 5 años.
   - Sin conexión: texto fijo ("tardes frescas y noches frías, lleva abrigo").
   - Pruebas: `?clima=hoy` (pronóstico de hoy) y `?clima=tipico`.
   - Coordenadas en `CONFIG.clima`: Hacienda Chic (4.8270, -74.0314).
8. **Llegada y transporte**: tarjeta con íconos dorados — cupos de parqueadero limitados (se recomienda no llevar carro),
   valet parking bajo la responsabilidad de cada invitado, conductor elegido contratable en el lugar con costo adicional,
   y la celebración termina a las 12:00 de la noche.
9. **Itinerario**: 4:00 Coffee time · 5:00 Ceremonia religiosa · 6:00 Brindis · 6:30 Cena · 7:30 ¡A celebrar! · 12:00 a.m. Fin de la celebración
10. **Galería** "Nuestra historia" (espacios para fotos, pendiente).
11. **Código de vestimenta**: Formal + colores reservados.
12. **Regalos**: texto de lluvia de sobres.
13. **Comparte tus fotos**: QR + botón hacia `fotos.html`.
14. **Confirma tu asistencia** (formulario dentro de la invitación):
    - ¿Nos acompañarás? → "¡Sí, ahí estaré!" / "No podré asistir".
    - Si es "Sí": casillas con **el nombre de cada invitado de la tarjeta** para marcar quiénes asisten,
      **restricciones alimenticias o alergias** y **link de YouTube de la canción que no puede faltar**.
    - Al enviar: destellos, mensaje de gracias y opción "Cambiar mi respuesta".
15. **Pie**: nombres, fecha 19 · 06 · 2027 y agradecimiento.

**Estilo:** fondo marfil y rosa, orquídeas phalaenopsis (SVG propias), detalles dorados, letras Pinyon Script
(caligrafía), Cinzel (mayúsculas) y Cormorant Garamond (texto). Pétalos de orquídea y destellos dorados cayendo.

---

## 2. Cómo funciona

### Archivos del repositorio
| Archivo | Para qué sirve |
|---|---|
| `index.html` | La invitación |
| `styles.css` | Diseño (colores, letras, animaciones) |
| `script.js` | Lógica: `CONFIG` (fecha, fecha límite, URL del script, lugar, clima), invitado por código (lo pide al script de Google), formulario, cuenta regresiva, clima |
| `panel.js` | Compartido por las páginas de los novios: `ENDPOINT` (misma URL que `CONFIG.rsvpEndpoint`), pide la clave `CLAVE_NOVIOS` (la recuerda en ese navegador), lee la lista y guarda el plano |
| `enlaces.html` | Lista de todos los enlaces personalizados con botón de WhatsApp: pases, mesa y si ya confirmó (con clave) |
| `mesas.html` | **Editor del plano de mesas** (con clave): crear/renombrar/eliminar mesas, sillas con −/+, arrastrar personas o familias, ✓/✗ de confirmación, Guardar en Google Sheets e Imprimir |
| `INVITADOS-Y-MESAS.md` | Guía: pestañas Invitados/Mesas, primera configuración y uso del plano |
| `fotos.html` | Página del QR: abre el álbum compartido (`ALBUM_URL`, pendiente) |
| `qr-mesa.html` | Tarjeta A6 para imprimir con el QR de fotos |
| `assets/qr-fotos.svg` | Código QR (apunta a `fotos.html`, nunca cambia) |
| `assets/cancion.mp3` | Música de fondo (**pendiente**) |
| `google-apps-script/Code.gs` | Script de confirmaciones (cuenta de Daniel, en la hoja) |
| `google-apps-script/Playlist-pareja.gs` | Script de la playlist (cuenta de la pareja, dueña de la playlist) |
| `google-apps-script/appsscript-pareja.json` | Manifiesto para activar YouTube en el script de la pareja |
| `CONFIGURAR-CORREO.md`, `PLAYLIST.md`, `FOTOS.md` | Guías paso a paso |

### Invitados por código (lista en Google Sheets)
Cada familia recibe un enlace con un código: `https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9`.
La invitación le pide esa familia al script de Google (`?accion=invitado&codigo=…`), que la busca en la pestaña
**Invitados** y devuelve solo esa familia (nombre y personas). Se guarda en el celular para cargar al instante la
próxima vez. Si el código no existe, se ve la invitación general sin nombre ni pases.

Hoja "Confirmaciones Boda Daniel y Diana" — pestañas:
| Pestaña | Columnas |
|---|---|
| **Lista de Invitados** (creada por el usuario, ~100 personas) | `Nombre` · `Pases` · `Numero de Mesa` + `Familia` · `Código` (las agrega `prepararHojas` al final) |
| **Mesas** | `Mesa` (número o texto, ej. `Novios`) · `Sillas` |
| **Confirmaciones** | respuestas del formulario (la hoja cuyo A1 es "Fecha" se renombra así; si no hay, se crea) |

- Las columnas se reconocen **por su título** (sin tildes ni mayúsculas), no por su posición.
- **Familia**: filas con el mismo texto = una sola invitación. Vacía = invitación individual (se muestra el Nombre).
- **Pases**: vacío/1 = solo la persona; N > 1 = la persona + "Acompañante de …" (ocupa N sillas en el plano).
- **Código**: lo genera el script al abrir `enlaces.html`/`mesas.html` o con el menú **💍 Boda → Generar códigos
  que falten**. Si se agrupa a alguien después, toma el código de la primera fila de su familia.
- `?accion=lista&clave=…` (con `CLAVE_NOVIOS`) devuelve todas las familias, sus personas (nombre, pases, nombres
  con acompañantes, mesa), su confirmación y las mesas. Guardar el plano es un POST en JSON
  `{accion:"guardarMesas", clave, mesas, asignaciones}`; cada fila se reconoce por `código|nombre`.
- Al confirmar, el script toma los **pases y el nombre de la familia de la Lista de Invitados** (no del navegador).
- La mesa se asigna **por persona** (una fila). En la invitación todavía no se muestra: aparecerá el día de la
  boda (punto 5) y en el pase QR (punto 4).
- `invitados.csv` se eliminó del repositorio: la lista ya no es pública. **Nunca subir la lista real al repositorio.**


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
- [x] Lista real de invitados: ya está en la pestaña **Lista de Invitados** (~100 personas).
- [ ] **Actualizar el script de confirmaciones** (nuevo `Code.gs`): poner `CLAVE_NOVIOS`, ejecutar `prepararHojas` y publicar
  una **nueva versión** (ver `INVITADOS-Y-MESAS.md`). Hasta hacerlo, la invitación no muestra el nombre de la familia.
- [ ] Llenar la columna **Familia** de la Lista de Invitados (quiénes van en la misma invitación) **antes de enviar enlaces**,
  y armar las mesas en `mesas.html` (mesas nuevas empiezan con 10 sillas; se ajustan con − / +).
- [ ] Fotos para la galería "Nuestra historia".
- [ ] Canción de fondo (`assets/cancion.mp3`).
- [ ] Crear el **álbum compartido de Google Fotos** (con "Colaborar" y "Compartir mediante enlace") y pasar el link para `fotos.html`.
- [ ] Probar en Samsung Internet el botón **"Abrir en Chrome"**.
- [ ] (Opcional) Agregar a Diana en `CORREOS_EXTRA` para que también reciba los avisos.

### 🛠️ Plan de trabajo: nuevas funciones (se hacen una a una y se prueban antes de seguir)

**Orden propuesto:** 1 → 2 → 3 → 4 → 5 → 6 → 7. El plano de mesas va antes que el pase QR y el modo "día de
la boda", porque ambos muestran la mesa de cada familia.

| # | Función | Estado |
|---|---|---|
| 1 | Información de llegada y transporte | ✅ Hecho (aprobado) |
| 2 | Clima en vivo | ✅ Hecho (aprobado) |
| 3 | Plano de mesas (editor + lista en Google Sheets) | ✅ Hecho (esperando visto bueno) |
| 4 | Pase QR de entrada por familia | ⏳ Siguiente |
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
- **Antes de eso:** muestra el clima típico (promedio en vivo de los últimos 5 años) y el aviso "el pronóstico aparecerá desde el 4 de junio de 2027".
- Usa las **coordenadas de Hacienda Chic** (4.8270, -74.0314), guardadas en `CONFIG.clima`.

**3. Plano de mesas** (rehecho a pedido: editor interactivo)
- La lista oficial de invitados pasa a **Google Sheets** (pestañas Invitados y Mesas); se quita `invitados.csv`.
- `mesas.html` (con clave de los novios, pensado para computador y usable en celular): crear mesas, cambiar
  nombre y sillas, arrastrar personas (o familias completas) a las mesas, ver quién confirmó, **Guardar**
  (actualiza la hoja) e **Imprimir**. Se sienta **por persona**; mesas en **cuadrícula**.
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
- **Invitados por código** (no `?familia=…&pases=…`, que cualquiera podía editar). La lista oficial vive en
  **Google Sheets** (pestaña Invitados, una fila por persona); `invitados.csv` se eliminó.
- **Plano de mesas:** editor en `mesas.html` que guarda en la hoja; asignación **por persona**; mesas en **cuadrícula**
  (no salón libre); pensado para **computador**. Protegido con `CLAVE_NOVIOS` (solo en Apps Script).
- Se usa la pestaña que creó el usuario (**Lista de Invitados**) en vez de una nueva; el script solo le agrega
  las columnas Familia y Código. Las invitaciones se agrupan por la columna **Familia**.
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
| `8401fcd` | 2026-09-24 | El panel de los novios entra al plan como último punto |
| `b46a7df` | 2026-09-24 | Forma de trabajo acordada guardada en `CLAUDE.md` |
| `21c0f55` | 2026-09-24 | Punto 1: sección "Llegada y transporte" y "12:00 a.m. Fin de la celebración" en el itinerario |
| `ad2540e` | 2026-09-24 | Punto 2: sección "El clima" en vivo (pronóstico real o clima típico de los últimos 5 años) |
| `af0cd7a` | 2026-09-24 | Coordenadas reales de Hacienda Chic (4.8270016, -74.0314436) para el clima y el botón de Waze |
| `d3ff6d0` | 2026-09-24 | Punto 3 (primera versión): plano de mesas de solo lectura y columna `mesa` en `invitados.csv` |
| `7bfe280` | 2026-09-24 | Punto 3 rehecho: lista de invitados en Google Sheets (pestañas Invitados y Mesas), editor interactivo `mesas.html`, `panel.js` con clave, `enlaces.html` con confirmaciones; se elimina `invitados.csv` |
| — | 2026-09-24 | El script usa la pestaña del usuario **Lista de Invitados** (Nombre, Pases, Numero de Mesa) y le agrega Familia y Código; acompañantes por Pases; códigos unificados por familia |

---

## 5. Última versión de los scripts

Para actualizarlos: copiar desde el link "raw", pegar en Apps Script, **volver a escribir los valores
secretos** (URL de la playlist y palabra secreta) y publicar una **nueva versión**.

### 5.1 `google-apps-script/Code.gs` — confirmaciones, invitados y mesas (cuenta de Daniel)
Link para copiar: https://raw.githubusercontent.com/danieltijo94/boda-daniel-y-diana/claude/tender-cerf-3qmwm1/google-apps-script/Code.gs

Valores a llenar en Apps Script (no se guardan en el repositorio):
`PLAYLIST_WEBAPP_URL` = URL `/exec` del script de la pareja · `PLAYLIST_CLAVE` = palabra secreta ·
`CLAVE_NOVIOS` = clave de los novios para `enlaces.html` y `mesas.html`.

```javascript
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
    // Los pases y el nombre de la familia salen de la lista de invitados
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
    indice[x.codigo].personas.push({ nombre: x.nombre, pases: x.pases, nombres: conAcompanantes(x), mesa: x.mesa });
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
