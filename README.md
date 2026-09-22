# 💍 Daniel & Diana — Invitación de boda

Invitación web floral con sobre animado, música, pétalos cayendo, cuenta regresiva,
ubicaciones, itinerario, galería, código de vestimenta, regalos y confirmación con Google Form.

## Enlace personalizado
Cada familia recibe un enlace con su nombre y número de pases:

```
https://danieltijo94.github.io/boda-daniel-y-diana/?familia=Familia%20Pérez&pases=2
```

Usa `enlaces.html` para generarlos y enviarlos por WhatsApp.

## Qué editar
- **`script.js` → `CONFIG`**: fecha y hora, fecha límite, enlace del Google Form, lugar para el calendario.
- **`index.html`**: textos, padres, lugares y enlaces de Google Maps, itinerario, vestimenta, datos bancarios.
- **`assets/cancion.mp3`**: la canción de fondo.
- **`assets/`**: fotos; en la sección "Galería" reemplaza cada `<figure class="ph">` por `<img src="assets/foto1.jpg" alt="...">`.

## Publicar en GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
