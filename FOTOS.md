# 📸 Fotos de los invitados (se guardan en tu Google Drive)

En la invitación (sección "Comparte tus fotos") y en las mesas (`qr-mesa.html`) hay un **código QR** que lleva a
`fotos.html`. El QR **no cambia nunca**.

## Cómo funciona
1. El invitado escanea el QR (o toca "Subir fotos" en la invitación).
2. Toca **Elegir fotos**, selecciona varias de su galería y se suben solas, con una barra de avance.
   **No necesita cuenta de Google.**
3. Las fotos llegan a la carpeta **"Fotos boda – invitados"** de tu Google Drive (la crea el script la primera vez).
   - El nombre de cada archivo lleva quién la subió y la hora, por ejemplo `Familia Pérez – 2027-06-19 21.15.03 – k0ij.jpg`.
     Si el invitado abrió antes su invitación en ese celular, se sabe su familia; si no, puede escribir su nombre (opcional).
   - Las fotos se reducen a 2560 px antes de subirlas (siguen viéndose muy bien) para que suban rápido.
   - Videos: hasta 45 MB cada uno (`MAX_MB_ARCHIVO` en el script).
4. Botón **"Ver las fotos de todos"**: abre la carpeta en modo **solo ver** (nadie puede borrar ni editar).
   Si no quieres que la vean, pon `VER_FOTOS_INVITADOS = false` en el script.

Las fotos ocupan espacio de tu cuenta de Google (la gratuita trae 15 GB, unas 4.000 a 6.000 fotos de celular).

## Activarlo (una vez)
1. Abre la hoja → **Extensiones → Apps Script**, pega el nuevo
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs) y vuelve a llenar las claves.
2. Selecciona la función **`probarFotos`** y pulsa **▶ Ejecutar**. Google pedirá un permiso nuevo
   (**acceso a Google Drive**): acéptalo. En el registro aparece el link de la carpeta creada.
3. **Implementar → Gestionar implementaciones → ✏️ → Versión: "Nueva versión" → Implementar.**

## Imprimir el QR para las mesas
Abre `qr-mesa.html` en el computador y usa **Imprimir** (tamaño A6, una por mesa).
