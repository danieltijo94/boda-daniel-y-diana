# Instrucciones para Claude — Invitación de boda

Proyecto: invitación web de la boda de Daniel Alejandro & Diana Carolina (GitHub Pages, sin dependencias).
Responde siempre **en español** y con explicaciones sencillas (el usuario no es programador).

## Regla obligatoria: documento de seguimiento
**Cada vez que se haga un cambio** en el proyecto, actualiza `CLAUDE_BODA_INVITACION.md` en el mismo commit:

1. **Historial de cambios** (sección 4): agrega una fila con commit, fecha y descripción del cambio
   (para el commit actual puedes usar la fila del commit anterior y completar el hash en el siguiente cambio).
2. **Última versión de la tarjeta** (sección 1): actualiza datos, secciones o links si cambiaron, y la fecha de "Última actualización".
3. **Estado y pendientes** (sección 3): marca lo terminado, agrega lo nuevo pendiente, mueve ideas
   programadas fuera de "Ideas propuestas" y registra decisiones nuevas.
4. **Scripts** (sección 5): si cambió `google-apps-script/*.gs` o el manifiesto, copia la versión completa y actual.

## Convenciones
- Archivos principales: `index.html`, `styles.css`, `script.js` (datos en `CONFIG`), `panel.js` (páginas de los novios).
- La lista de invitados vive en Google Sheets (pestaña del usuario "Lista de Invitados": Nombre, Pases, Numero de Mesa,
  + Familia y Código que agrega el script; y pestaña Mesas), servida por `google-apps-script/Code.gs`;
  ya no hay `invitados.csv`. La clave `CLAVE_NOVIOS` va solo en Apps Script.
- Al cambiar `styles.css` o `script.js`, sube el `?v=` en `index.html` para que los celulares no usen la versión vieja.
- **Nunca subas secretos ni la lista real de invitados** al repositorio (es público): la palabra secreta de la playlist, la URL del script
  de la pareja y `CLAVE_NOVIOS` van solo en Apps Script.
- Después de cambiar un script de Google, recuérdale al usuario publicar una **nueva versión**
  (Implementar → Gestionar implementaciones → ✏️ → Nueva versión).
- Prueba los cambios visuales con Playwright en tamaño celular (390×844) antes de subirlos.
- Trabaja y publica en la rama `claude/tender-cerf-3qmwm1` (es la que usa GitHub Pages).

## Cómo trabajamos (acordado con el usuario)
- **Antes de empezar, lee `CLAUDE_BODA_INVITACION.md`**, en especial la sección 3 "🛠️ Plan de trabajo".
- Las funciones del plan se hacen **una a una, en orden** (1 llegada y transporte → 2 clima en vivo →
  3 plano de mesas → 4 pase QR de entrada → 5 modo "día de la boda" → 6 página de agradecimiento →
  7 panel de los novios). Al terminar una: probarla, subirla, actualizar su estado en la tabla del plan
  (✅ Hecho) y **esperar a que el usuario la pruebe y dé el visto bueno** antes de empezar la siguiente.
- Antes de programar una función, confirma los datos que falten (por ejemplo, coordenadas de Hacienda Chic
  para el clima y Waze) o usa un valor provisional y dilo.
- Pendiente abierto: confirmar que la playlist funciona desde la invitación (el correo dice
  "(agregada a la playlist ✓)" o el motivo del fallo).

## Notas del entorno de pruebas
- Desde el contenedor no se puede acceder a Google, YouTube, Open-Meteo ni github.io (red bloqueada): los scripts de
  Google los prueba el usuario. `Code.gs` se puede probar localmente con una imitación de Sheets en Node
  (cargar el archivo en `vm` de Node con SpreadsheetApp/ContentService simulados y responder con él
  las peticiones a script.google.com interceptadas en Playwright).
- Para ver las fuentes reales en Playwright, instálalas con `npm pack @fontsource/pinyon-script
  @fontsource/cinzel @fontsource/cormorant-garamond` y sírvelas interceptando `fonts.googleapis.com`.
