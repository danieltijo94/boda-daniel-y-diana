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
