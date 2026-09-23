# 📧 Recibir las confirmaciones por correo

Cuando un invitado confirma en la invitación:
1. Su respuesta se guarda en una **hoja de Google Sheets** tuya.
2. Te llega un **correo** con quién confirmó, cuántas personas van y el total acumulado.

Si una familia vuelve a confirmar (por ejemplo, para cambiar su respuesta), se **actualiza su fila** en lugar de duplicarla.

## Pasos (una sola vez, unos 5 minutos)

1. Abre la hoja **[Confirmaciones Boda Daniel y Diana](https://docs.google.com/spreadsheets/d/1dJpGfw0tYUVGXEwcRdgg4oP-WTlBkTo9WSq6OkTh2No/edit)** (ya está creada en tu Drive).
2. En el menú: **Extensiones → Apps Script**.
3. Borra lo que aparece y pega todo el contenido de [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
   - Si quieres que a Diana también le llegue el correo, pon su correo en `CORREOS_EXTRA`, por ejemplo `["diana@gmail.com"]`.
4. Guarda (💾). Arriba selecciona la función **`probar`** y pulsa **▶ Ejecutar**.
   - Google te pedirá permisos: **Revisar permisos → tu cuenta → Configuración avanzada → Ir a (no seguro) → Permitir**.
     Esto es normal: el script es tuyo y solo escribe en tu hoja y te envía correos a ti.
   - Te debería llegar un correo de prueba y aparecer una fila "Prueba" en la hoja. Puedes borrar esa fila.
5. Pulsa **Implementar → Nueva implementación**.
   - Tipo (⚙️): **Aplicación web**.
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario**.
   - Pulsa **Implementar** y **copia la URL** (termina en `/exec`).
6. Pásame esa URL (o pégala en `script.js`, en `CONFIG.rsvpEndpoint`):

   ```js
   rsvpEndpoint: "https://script.google.com/macros/s/XXXXXXXX/exec",
   ```

¡Listo! A partir de ahí cada confirmación llega a tu correo y a la hoja.

> Si más adelante cambias el código del script, usa **Implementar → Gestionar implementaciones → ✏️ → Versión: nueva** para que la URL siga siendo la misma.

## Actualizar el script (cuando cambie `Code.gs`)

1. Abre la hoja → **Extensiones → Apps Script**, borra todo y pega el nuevo contenido de `google-apps-script/Code.gs`. Guarda.
2. **Implementar → Gestionar implementaciones → ✏️ (editar) → Versión: "Nueva versión" → Implementar.**

La URL sigue siendo la misma, así que no hay que cambiar nada en la invitación.
