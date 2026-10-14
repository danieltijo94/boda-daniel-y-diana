// Reemplaza en ../../index.html el bloque generado (entre el comentario "Rosas de jardín" y "Papel de la portada")
import fs from 'fs';
const f = '../../index.html'; let h = fs.readFileSync(f, 'utf8');
let s = fs.readFileSync('sprite-rosas.svg.txt', 'utf8')
  .replace(/font-family="BS"/g, 'font-family="Berkshire Swash"')
  .replace(/font-family="CGI"/g, 'font-family="Cormorant Garamond" font-style="italic"')
  .replace(/^<defs>/, '').replace('</defs>', ''); // el contenido va dentro del <defs> del sprite
const a = h.indexOf('-->', h.indexOf('<!-- Rosas de jardín')) + 3, b = h.indexOf('<!-- Papel de la portada -->');
h = h.slice(0, a) + '\n      ' + s + '\n\n      ' + h.slice(b);
fs.writeFileSync(f, h); console.log('ok', s.length);
