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
- Archivos principales: `index.html`, `styles.css`, `script.js` (datos en `CONFIG`), `invitados.csv`.
- Al cambiar `styles.css` o `script.js`, sube el `?v=` en `index.html` para que los celulares no usen la versión vieja.
- **Nunca subas secretos** al repositorio (es público): la palabra secreta de la playlist y la URL del script
  de la pareja van solo en Apps Script.
- Después de cambiar un script de Google, recuérdale al usuario publicar una **nueva versión**
  (Implementar → Gestionar implementaciones → ✏️ → Nueva versión).
- Prueba los cambios visuales con Playwright en tamaño celular (390×844) antes de subirlos.
- Trabaja y publica en la rama `claude/tender-cerf-3qmwm1` (es la que usa GitHub Pages).
