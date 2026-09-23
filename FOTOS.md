# 📸 Fotos de los invitados

La invitación tiene una sección **"Comparte tus fotos"** con un código QR, y hay una tarjeta para imprimir
y poner en las mesas (`qr-mesa.html`). El QR lleva a `fotos.html`, que abre el álbum compartido.

El QR **no cambia nunca**: si cambias de álbum, solo actualizas el enlace en `fotos.html`.

## Dónde se guardan: álbum compartido de Google Fotos (recomendado)

- No necesita ningún script.
- Las fotos que sube cada invitado **ocupan el espacio de su propia cuenta**, no el tuyo.
- Todos pueden ver las fotos de todos en tiempo real, y tú puedes descargarlas todas al final.
- Los invitados necesitan una cuenta de Google (casi todos los Android la tienen; en iPhone pueden entrar desde el navegador).

### Crear el álbum
1. Abre **Google Fotos** → **Crear → Álbum compartido** (o crea un álbum y toca **Compartir**).
2. Ponle nombre, por ejemplo *"Boda Daniel & Diana 💍"*.
3. En las opciones del álbum activa **Colaborar** (para que otros puedan agregar fotos) y **Compartir mediante enlace**.
4. Copia el enlace y pégalo en `fotos.html`:
   ```js
   const ALBUM_URL = "https://photos.app.goo.gl/…";
   ```
   (o pásaselo a Claude para que lo configure).
