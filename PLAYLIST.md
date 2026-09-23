# 🎵 Playlist con las canciones de los invitados

Cuando un invitado confirma y pega el link de YouTube de su canción, el script de Google la agrega
automáticamente a una playlist tuya de YouTube (sin repetir canciones). También queda anotada en la hoja
y en el correo de aviso.

## Configurarla (una sola vez, unos 5 minutos)

1. **Crea la playlist** en YouTube con tu cuenta de Google: en [youtube.com](https://www.youtube.com) →
   tu foto → **Tu canal** (si te pide crear un canal, créalo) → **Crear → Nueva playlist**.
   Ponle un nombre como *"Boda Daniel & Diana 💍"* y elige la privacidad:
   - **No listada**: solo la ve quien tenga el link (recomendado).
2. **Copia el ID de la playlist**: abre la playlist; en la dirección verás `list=PLxxxxxxxx…`.
   El ID es todo lo que va después de `list=`.
3. Abre tu hoja de confirmaciones → **Extensiones → Apps Script**.
4. Pega la última versión de `google-apps-script/Code.gs` (si no lo has hecho) y pon el ID en:
   ```js
   const PLAYLIST_ID = "PLxxxxxxxx…";
   ```
5. En el menú de la izquierda, junto a **Servicios**, pulsa **+** → busca **YouTube Data API v3** → **Añadir**.
6. Arriba elige la función **`probarPlaylist`** y pulsa **▶ Ejecutar**. Acepta los permisos de YouTube.
   Debería agregarse una canción de prueba a tu playlist (luego la puedes quitar).
7. **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar.**

Listo: desde ahí cada canción sugerida entra sola a la playlist. El día de la boda le compartes el link
de la playlist a tu DJ.
