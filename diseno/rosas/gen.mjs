import { chromium } from 'playwright';
import fs from 'fs';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await b.newPage(); const errs=[]; p.on('pageerror', e=>errs.push(e.message));
await p.goto('http://localhost:8771/gen.html'); await p.waitForFunction(() => window.listo);
let html = await p.$eval('#s', s => s.innerHTML);
html = html.replace(/(\d+\.\d{2})\d+/g, '$1');   // redondear decimales (archivo más liviano)
fs.writeFileSync('sprite-rosas.svg.txt', html);
console.log('bytes', html.length, 'errores', errs);
await b.close();
