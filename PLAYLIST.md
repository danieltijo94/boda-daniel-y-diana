# 🎵 Playlist con las canciones de los invitados

Cuando un invitado confirma y pega el link de YouTube de su canción, el script de Google la agrega
automáticamente a una playlist tuya de YouTube (sin repetir canciones). También queda anotada en la hoja
y en el correo de aviso.

## Configurarla (una sola vez, unos 5 minutos)

> La playlist debe pertenecer a la **misma cuenta de Google** dueña del script (la de la hoja de
> confirmaciones). Si es de otra cuenta, YouTube responde "Forbidden".

1. Asegúrate de que tu cuenta tenga canal de YouTube: [youtube.com](https://www.youtube.com) → tu foto →
   **Crear un canal** (si ya lo tienes, sáltate este paso).
2. Abre tu hoja de confirmaciones → **Extensiones → Apps Script** y pega la última versión de
   `google-apps-script/Code.gs`. Guarda.
3. En el menú de la izquierda, junto a **Servicios**, pulsa **+** → **YouTube Data API v3** → **Añadir**
   (si ya lo agregaste, no hace falta repetirlo).
4. Arriba elige la función **`crearPlaylist`** y pulsa **▶ Ejecutar**. En el registro aparece el link de la
   nueva playlist *"Boda Daniel Alejandro & Diana Carolina 💍"* (no listada). Queda configurada sola.
5. (Opcional) Elige **`probarPlaylist`** y ejecútala: debe decir *"¡Canción agregada a la playlist!"*.
6. **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar.**

¿Algo falla? Ejecuta **`diagnosticoPlaylist`**: muestra qué canal usa el script y sus playlists.

### Que otra persona también pueda agregar canciones
En YouTube abre la playlist → **⋮ → Colaborar** → activa *"Los colaboradores pueden añadir videos"* y
comparte el link de invitación.
