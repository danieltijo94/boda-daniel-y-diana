# 🎵 Playlist con las canciones de los invitados

Cuando un invitado confirma y pega el link de YouTube de su canción, el script de Google la agrega
automáticamente a una playlist tuya de YouTube (sin repetir canciones). También queda anotada en la hoja
y en el correo de aviso.

## Cómo funciona

La playlist pertenece a **otra cuenta de Google** (no a la del script de confirmaciones), y YouTube solo
deja agregar canciones a la persona dueña. Por eso hay dos scripts:

1. **`google-apps-script/Playlist-pareja.gs`**: vive en la cuenta **dueña de la playlist**. Recibe cada
   canción y la agrega.
2. **`google-apps-script/Code.gs`** (el de las confirmaciones): al recibir una canción, se la envía al
   script anterior.

Los dos comparten una **palabra secreta** (`CLAVE` / `PLAYLIST_CLAVE`) para que nadie más pueda agregar
canciones. No la subas al repositorio.

## Parte A: en la cuenta dueña de la playlist

1. Entra a [script.google.com](https://script.google.com) → **Nuevo proyecto**. Ponle de nombre *"Playlist boda"*.
2. Borra lo que aparece y pega el contenido de `google-apps-script/Playlist-pareja.gs`.
3. Escribe la palabra secreta en `const CLAVE = "…";` y revisa que `PLAYLIST_ID` sea el de la playlist. Guarda.
4. Junto a **Servicios** pulsa **+** → **YouTube Data API v3** → **Añadir**.
   Si esa ventana sale vacía: ⚙️ **Configuración del proyecto** → activa *"Mostrar el archivo de manifiesto
   appsscript.json en el editor"* → vuelve al editor (**< >**), abre `appsscript.json`, reemplaza todo su
   contenido por el de `google-apps-script/appsscript-pareja.json` y guarda.
5. Elige la función **`probar`** → **▶ Ejecutar** → acepta los permisos. Debe decir *"¡Canción agregada a la playlist!"*.
6. **Implementar → Nueva implementación → ⚙️ Aplicación web** · Ejecutar como: **Yo** · Acceso: **Cualquier usuario** →
   **Implementar**. Copia la URL (termina en `/exec`).

## Parte B: en la cuenta de las confirmaciones

1. Abre la hoja de confirmaciones → **Extensiones → Apps Script** y pega la última versión de `Code.gs`.
2. Pega la URL de la parte A en `PLAYLIST_WEBAPP_URL` y la misma palabra secreta en `PLAYLIST_CLAVE`. Guarda.
3. Elige **`probarPlaylist`** → **▶ Ejecutar** → acepta el nuevo permiso ("conectarse a un servicio externo").
4. **Implementar → Gestionar implementaciones → ✏️ → Versión: Nueva versión → Implementar.**
