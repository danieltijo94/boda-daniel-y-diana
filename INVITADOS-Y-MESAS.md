# 👥 Lista de invitados y plano de mesas (Google Sheets)

La lista oficial de invitados vive en la hoja de Google
**[Confirmaciones Boda Daniel y Diana](https://docs.google.com/spreadsheets/d/1dJpGfw0tYUVGXEwcRdgg4oP-WTlBkTo9WSq6OkTh2No/edit)**,
en tres pestañas:

| Pestaña | Qué tiene |
|---|---|
| **Invitados** | Una fila por persona: `Código` · `Familia` · `Invitado` · `Mesa` |
| **Mesas** | Una fila por mesa: `Mesa` (número o nombre, ej. `Novios`) · `Sillas` |
| **Confirmaciones** | Las respuestas de la invitación (se llena sola) |

- La invitación (`?i=CÓDIGO`) busca la familia en la pestaña **Invitados**: el nombre de la familia y cada persona.
  Los **pases** = cuántas filas tiene esa familia.
- **Código**: si lo dejas vacío, el script lo inventa (5 letras/números) y todas las filas de la misma familia
  reciben el mismo. Menú de la hoja **💍 Boda → Generar códigos que falten**, o se generan solos al abrir `enlaces.html`.
- La columna **Mesa** la llena el plano de mesas (también puedes escribirla a mano).

## Primera vez (unos 5 minutos)
1. Abre la hoja → **Extensiones → Apps Script**, borra todo y pega el nuevo
   [`google-apps-script/Code.gs`](google-apps-script/Code.gs).
2. Arriba, en `CLAVE_NOVIOS`, escribe una **clave solo para ustedes**, por ejemplo `const CLAVE_NOVIOS = "MiClave2027";`
   (no la compartas: sirve para ver la lista completa y guardar el plano).
3. Guarda (💾). Selecciona la función **`prepararHojas`** y pulsa **▶ Ejecutar** (acepta los permisos si los pide).
   Se crean las pestañas **Invitados** y **Mesas** con datos de ejemplo.
4. **Implementar → Gestionar implementaciones → ✏️ → Versión: "Nueva versión" → Implementar.**
5. Cambia los datos de ejemplo por la lista real (una fila por persona) y borra los que no sirvan.

## Páginas de los novios (piden la clave la primera vez)
- **Plano de mesas:** https://danieltijo94.github.io/boda-daniel-y-diana/mesas.html
  - **+ Agregar mesa**, cambiar su nombre (toca el nombre), sillas con **−** y **+**, 🗑 para eliminarla.
  - Arrastra a una persona, o el nombre de su familia para mover a todos, desde **Sin mesa** hasta una mesa.
    También puedes tocar personas para seleccionarlas y luego tocar la mesa. La **×** devuelve a alguien a "Sin mesa".
  - Marcas: ✓ confirmó · ✗ no asiste (tachado) · sin marca = aún no responde.
  - **Guardar cambios** escribe la pestaña **Mesas** y la columna **Mesa** de cada invitado.
  - **Imprimir** saca el plano limpio (tres mesas por fila).
- **Enlaces para WhatsApp:** https://danieltijo94.github.io/boda-daniel-y-diana/enlaces.html
  (con los pases, la mesa y si ya confirmó).
