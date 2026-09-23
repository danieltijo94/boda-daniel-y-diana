# 💍 Daniel Alejandro & Diana Carolina — Invitación de boda

Invitación web con orquídeas, detalles dorados, sobre animado, música, pétalos cayendo, cuenta regresiva,
ubicaciones, itinerario, galería, código de vestimenta, regalos y confirmación de asistencia dentro de la página (con aviso por correo, ver `CONFIGURAR-CORREO.md`).

## Invitados y pases
La lista de invitados está en **`invitados.csv`** (se puede abrir con Excel o Google Sheets):

```
codigo,familia,invitados
FP4M9,Familia Pérez Gómez,Carlos Pérez|María Gómez|Juan Pérez|Laura Pérez
TM8Q1,Tía Marta,Marta Rodríguez
```

- `codigo`: código único y corto de cada invitación (letras y números, sin espacios).
- `familia`: el nombre tal como aparecerá en la invitación.
- `invitados`: el nombre de cada persona incluida, separados por `|`. La cantidad de nombres es el número de pases,
  y al confirmar cada familia marca quiénes asistirán. (No uses comas dentro de los nombres.)

Cada invitado recibe un enlace con su código, por ejemplo
`https://danieltijo94.github.io/boda-daniel-y-diana/?i=FP4M9`.
Si alguien cambia el código del enlace por uno que no existe, verá la invitación general sin nombre ni pases.

Abre **`enlaces.html`** para ver todos los enlaces con botones de copiar y enviar por WhatsApp.

## Qué editar
- **`script.js` → `CONFIG`**: fecha y hora, fecha límite, URL del script de confirmaciones, lugar para el calendario.
- **`index.html`**: textos, padres, lugares y enlaces de Google Maps, itinerario, vestimenta, datos bancarios.
- **`assets/cancion.mp3`**: la canción de fondo.
- **`assets/`**: fotos; en la sección "Galería" reemplaza cada `<figure class="ph">` por `<img src="assets/foto1.jpg" alt="...">`.

## Publicar en GitHub Pages
Settings → Pages → Source: *Deploy from a branch* → rama `main`, carpeta `/ (root)`.
