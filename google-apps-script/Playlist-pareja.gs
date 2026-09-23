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
  return responder({ ok: agregar(p.video) });
}

// Agrega el video a la playlist (una sola vez por canción)
function agregar(videoId) {
  const props = PropertiesService.getScriptProperties();
  const clave = "yt:" + PLAYLIST_ID + ":" + videoId;
  if (props.getProperty(clave)) return true;
  try {
    YouTube.PlaylistItems.insert({
      snippet: { playlistId: PLAYLIST_ID, resourceId: { kind: "youtube#video", videoId: videoId } },
    }, "snippet");
    props.setProperty(clave, "1");
    return true;
  } catch (err) {
    console.error("No se pudo agregar a la playlist: " + err);
    return false;
  }
}

// Ejecuta esta función una vez para dar permisos y comprobar que funciona
function probar() {
  console.log(agregar("2Vv-BfVoq4g") ? "¡Canción agregada a la playlist!" : "No se agregó: revisa PLAYLIST_ID y el servicio YouTube Data API.");
}
