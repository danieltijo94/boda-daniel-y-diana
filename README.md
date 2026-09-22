# 💍 Daniel & Diana — Invitación de boda

Invitación web floral con sobre animado, música, pétalos cayendo, cuenta regresiva,
ubicaciones, itinerario, galería, código de vestimenta, regalos y confirmación con Google Form.

## Invitados y pases
La lista de invitados está en **`invitados.csv`** (se puede abrir con Excel o Google Sheets):

```
codigo,familia,pases
FP4M9,Familia Pérez Gómez,4
TM8Q1,Tía Marta,1
```

- `codigo`: código único y corto de cada invitación (letras y números, sin espacios).
- `familia`: el nombre tal como aparecerá en la invitación.
- `pases`: cuántas personas incluye la invitación.

Cada invitado recibe un enlace con su código, por ejemplo
`https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9`.
Si alguien cambia el código del enlace por uno que no existe, verá la invitación general sin nombre ni pases.

Abre **`enlaces.html`** para ver todos los enlaces con botones de copiar y enviar por WhatsApp.

## Qué editar
- **`script.js` → `CONFIG`**: fecha y hora, fecha límite, enlace del Google Form, lugar para el calendario.
- **`index.html`**: textos, padres, lugares y enlaces de Google Maps, itinerario, vestimenta, datos bancarios.
- **`assets/cancion.mp3`**: la canción de fondo.
- **`assets/`**: fotos; en la sección "Galería" reemplaza cada `<figure class="ph">` por `<img src="assets/foto1.jpg" alt="...">`.

## Publicar en GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
