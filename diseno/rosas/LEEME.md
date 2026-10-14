# Generador de las rosas, ramos y sello de cera

Estos archivos **no se usan en la invitación publicada**: sirven para volver a generar los dibujos que están
dentro del `<svg>` del principio de `index.html` (rosas, ramos, guirnalda, hoja, botón y el sello `sealMono`).

- `comun.js`: degradados dorados, papel, flores secas (pampa, paniculata, eucalipto, lunaria).
- `rosas.js`: rosa de jardín realista (`rosaReal`), hoja dentada (`hojaReal`).
- `sello2.js`: sello de cera vino con el monograma D&D (D en Berkshire Swash con línea grabada y rulos; "&" en Cormorant itálica).
- `insertar.mjs`: mete el resultado en `index.html` (`node insertar.mjs` después de `node gen.mjs`).
- `gen.html`: arma los símbolos con los mismos ids que usa la invitación (`orchid` = rosa marfil, `orchidBlush` = rosa rubor, `cluster` = ramito de 3 rosas para tarjetas,
  `roseWine` = rosa vino, `obud`, `oleaf`, `spray`, `garland`, `bouquet`, `posy`, `sealMono`).

Para regenerar: servir esta carpeta (`python3 -m http.server 8771`) y correr `node gen.mjs` (Playwright).
Sale `sprite-rosas.svg.txt`; su contenido reemplaza el bloque entre el comentario de "Rosas de jardín…" y
"Papel de la portada" en `index.html` (cambiando `font-family="BS"` por `Berkshire Swash` y `"CGI"` por
`Cormorant Garamond` con `font-style="italic"`).
