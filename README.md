# 💍 Daniel Alejandro & Diana Carolina — Invitación de boda

Invitación web con orquídeas, detalles dorados, sobre animado, música, pétalos cayendo, cuenta regresiva,
ubicaciones, itinerario, galería, código de vestimenta, regalos y confirmación de asistencia dentro de la página (con aviso por correo, ver `CONFIGURAR-CORREO.md`).

## Invitados, pases y mesas
La lista oficial de invitados está en **Google Sheets** (pestaña **Lista de Invitados**, una fila por persona:
Nombre · Pases · Numero de Mesa · Familia · Código). Quienes comparten Familia reciben una sola invitación.
Ver **`INVITADOS-Y-MESAS.md`**.

Cada invitado recibe un enlace con su código, por ejemplo
`https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9`.
Si alguien cambia el código del enlace por uno que no existe, verá la invitación general sin nombre ni pases.

Páginas de los novios (piden la clave `CLAVE_NOVIOS` del script):
- **`enlaces.html`**: todos los enlaces con botones de copiar y enviar por WhatsApp.
- **`mesas.html`**: plano de mesas para crear mesas y sentar a cada invitado; guarda en Google Sheets.

## Qué editar
- **`script.js` → `CONFIG`**: fecha y hora, fecha límite, URL del script de confirmaciones, lugar para el calendario.
- **`index.html`**: textos, padres, lugares y enlaces de Google Maps, itinerario, vestimenta, datos bancarios.
- **`assets/cancion.mp3`**: la canción de fondo.
- **`assets/`**: fotos; en la sección "Galería" reemplaza cada `<figure class="ph">` por `<img src="assets/foto1.jpg" alt="...">`.

## Publicar en GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
