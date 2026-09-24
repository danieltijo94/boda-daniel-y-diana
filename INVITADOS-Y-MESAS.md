# 👥 Lista de invitados y plano de mesas (Google Sheets)

La lista oficial de invitados vive en la hoja de Google
**[Confirmaciones Boda Daniel y Diana](https://docs.google.com/spreadsheets/d/1dJpGfw0tYUVGXEwcRdgg4oP-WTlBkTo9WSq6OkTh2No/edit)**:

| Pestaña | Qué tiene |
|---|---|
| **Lista de Invitados** | Una fila por persona: `Nombre` · `Pases` · `Numero de Mesa` · `Familia` · `Código` |
| **Mesas** | Una fila por mesa: `Mesa` (número o nombre, ej. `Novios`) · `Sillas` |
| **Confirmaciones** | Las respuestas de la invitación (se llena sola) |

Columnas de la **Lista de Invitados** (el script las reconoce por su título, sin importar el orden):
- **Nombre**: como aparecerá en la invitación.
- **Pases**: vacío o `1` = solo esa persona. `2` o más = esa persona trae acompañantes
  (en la invitación aparecen como "Acompañante de …" y en el plano ocupan sillas extra).
- **Numero de Mesa**: la llena el plano de mesas (también se puede escribir a mano).
- **Familia**: quienes tengan **exactamente el mismo texto** aquí reciben **una sola invitación** juntos
  (ej. "Tío Maximiliano y esposa" en las dos filas). Vacío = esa persona recibe su propia invitación.
- **Código**: se llena solo (5 letras/números). Toda la familia comparte el mismo. No hace falta tocarlo.

> ⚠️ Agrupen las familias **antes de enviar los enlaces**: si después se agrupa a alguien, pasa a usar el
> código de la primera persona de su familia y su enlace anterior deja de funcionar.

## Primera vez (unos 5 minutos)
1. Abre la hoja → **Extensiones → Apps Script**, borra todo y pega el nuevo
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Vuelve a llenar `PLAYLIST_WEBAPP_URL` y `PLAYLIST_CLAVE`.
2. En `CLAVE_NOVIOS` escribe una **clave solo para ustedes**, por ejemplo `const CLAVE_NOVIOS = "MiClave2027";`
   (sirve para ver la lista completa y guardar el plano; no la compartas).
3. Guarda (💾). Selecciona la función **`prepararHojas`** y pulsa **▶ Ejecutar**: agrega las columnas
   **Familia** y **Código** al final de tu Lista de Invitados y crea la pestaña **Mesas**.
4. **Implementar → Gestionar implementaciones → ✏️ → Versión: "Nueva versión" → Implementar.**
5. Llena la columna **Familia** para agrupar a quienes van en la misma invitación.

## Páginas de los novios (piden la clave la primera vez)
- **Plano de mesas:** https://danieltijo94.github.io/boda-daniel-y-diana/mesas.html
  - **+ Agregar mesa**, cambiar su nombre (toca el nombre), sillas con **−** y **+**, 🗑 para eliminarla.
  - Arrastra a una persona, o el nombre de su familia para mover a todos, desde **Sin mesa** hasta una mesa.
    También puedes tocar personas para seleccionarlas y luego tocar la mesa. La **×** devuelve a alguien a "Sin mesa".
  - Marcas: ✓ confirmó · ✗ no asiste (tachado) · sin marca = aún no responde · **+2** = trae 2 acompañantes.
  - **Guardar cambios** escribe la pestaña **Mesas** y la columna **Numero de Mesa**.
  - **Imprimir** saca el plano limpio (tres mesas por fila).
- **Enlaces para WhatsApp:** https://danieltijo94.github.io/boda-daniel-y-diana/enlaces.html
  (crea los códigos que falten; muestra pases, mesa y si ya confirmó).
