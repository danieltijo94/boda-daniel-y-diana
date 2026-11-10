// Flores blancas de acuarela con hojas verde salvia y ramitas doradas (para combinar con el fondo de la portada)
function defsBlanco(svg) {
  const d = svg.querySelector("defs");
  if (svg.querySelector("#bpPet")) return;
  d.insertAdjacentHTML("beforeend", `
    <radialGradient id="bpPet" cx=".5" cy="1" r="1.05">
      <stop offset="0" stop-color="#d9dccf"/><stop offset=".35" stop-color="#f1f2ec"/><stop offset=".8" stop-color="#fdfdfb"/><stop offset="1" stop-color="#ffffff"/>
    </radialGradient>
    <radialGradient id="bpPet2" cx=".5" cy="1" r="1.05">
      <stop offset="0" stop-color="#cfd3c4"/><stop offset=".4" stop-color="#e9ebe3"/><stop offset="1" stop-color="#f8f8f4"/>
    </radialGradient>
    <linearGradient id="bpHoja" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6c7d69"/><stop offset=".55" stop-color="#8d9c87"/><stop offset="1" stop-color="#b6c1b0"/>
    </linearGradient>
    <linearGradient id="bpHoja2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#859581"/><stop offset="1" stop-color="#c4ccbd"/>
    </linearGradient>
    <linearGradient id="bpOro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#c9a961"/><stop offset=".5" stop-color="#ead39a"/><stop offset="1" stop-color="#b08d4a"/>
    </linearGradient>
    <filter id="bpAcuarela" x="-15%" y="-15%" width="130%" height="130%">
      <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="8" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="3" result="d"/>
      <feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="4" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -.45 1" result="m"/>
      <feComposite in="d" in2="m" operator="in"/>
    </filter>
    <filter id="bpSuave" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".1" numOctaves="2" seed="13" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="2"/>
    </filter>`);
}
let bpN = 0;
// pétalo redondeado y un poco ondulado (sin muesca), base en (0,0) hacia arriba
function petaloBlanco(L, W, rn) {
  const o = () => (rn() - .5) * W * .12;
  return `M0 0 C${-W * .5} ${-L * .15} ${-W * .72} ${-L * .62} ${-W * .5 + o()} ${-L * .88}
    C${-W * .32} ${-L * 1.04} ${-W * .1} ${-L * 1.02 + o()} 0 ${-L * .97} C${W * .12} ${-L * 1.03 + o()} ${W * .34} ${-L * 1.02} ${W * .5 + o()} ${-L * .86}
    C${W * .72} ${-L * .6} ${W * .5} ${-L * .15} 0 0 Z`;
}
function florBlanca(g, cx, cy, r, rot = 0, inclina = .85, grad = "bpPet") {
  defsBlanco(g.ownerSVGElement);
  let s = 23 + (bpN++) * 19; const rn = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const o0 = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot})` });
  const o = el(o0, "g", { filter: "url(#bpSuave)" });
  const a0 = rn() * Math.PI * 2;
  for (let i = 0; i < 5; i++) {
    const th = a0 + i * Math.PI * 2 / 5 + (rn() - .5) * .25, L = r * (.92 + rn() * .14), W = r * (1.05 + rn() * .15);
    const sy = Math.min(1, (inclina + (1 - inclina) * Math.abs(Math.cos(th))) / inclina);
    const g2 = el(o, "g", { transform: `scale(1 ${inclina}) rotate(${th * 180 / Math.PI + 90}) scale(1 ${sy})` });
    el(g2, "path", { d: petaloBlanco(L, W, rn), fill: `url(#${grad})`, stroke: "#d2d6c9", "stroke-width": .4 });
    for (let k = -2; k <= 2; k++) el(g2, "path", { d: `M${k * .5} ${-L * .05} Q${k * W * .06} ${-L * .35} ${k * W * .12} ${-L * (.55 + rn() * .2)}`, stroke: "#c9cebf", "stroke-width": .4, fill: "none", opacity: .5 });
    el(g2, "path", { d: `M${-W * .45} ${-L * .8} C${-W * .3} ${-L * .98} ${-W * .1} ${-L * 1} 0 ${-L * .96}`, stroke: "#fff", "stroke-width": 1.2, fill: "none", opacity: .9 });
  }
  const c = el(o0, "g", { transform: `scale(1 ${inclina})` });
  el(c, "circle", { r: r * .15, fill: "#c9b16f", opacity: .5 });
  for (let i = 0; i < 26; i++) {
    const a = i / 26 * Math.PI * 2 + rn() * .3, l = r * (.18 + rn() * .2), x = Math.cos(a) * l, y = Math.sin(a) * l;
    el(c, "path", { d: `M0 0 Q${x * .5} ${y * .5 + (rn() - .5)} ${x} ${y}`, stroke: "#b89a4e", "stroke-width": .45, fill: "none", opacity: .75 });
    el(c, "circle", { cx: x, cy: y, r: r * .028 + .35, fill: i % 3 ? "#d9b65a" : "#b8913c" });
  }
}
// hoja de acuarela verde salvia (lanceolada), nace en (x,y) y apunta según rot
function hojaSalvia(g, x, y, len, rot, ancho = .32, grad = "bpHoja", op = .88) {
  defsBlanco(g.ownerSVGElement);
  const w = len * ancho, o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot})`, filter: "url(#bpAcuarela)", opacity: op });
  el(o, "path", { d: `M0 0 C${len * .2} ${-w} ${len * .65} ${-w * 1.05} ${len} 0 C${len * .65} ${w * .9} ${len * .2} ${w * .85} 0 0 Z`, fill: `url(#${grad})` });
  el(o, "path", { d: `M0 0 C${len * .2} ${-w} ${len * .65} ${-w * 1.05} ${len} 0`, stroke: "#6f7e6b", "stroke-width": .5, fill: "none", opacity: .35 });
  el(o, "path", { d: `M${len * .04} 0 Q${len * .5} ${-w * .12} ${len * .95} 0`, stroke: "#e4e9df", "stroke-width": .7, fill: "none", opacity: .8 });
}
// ramita dorada de líneas finas con hojitas solo de contorno (como las del fondo)
function ramitaOro(g, x, y, len, rot, n = 5) {
  defsBlanco(g.ownerSVGElement);
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot})` });
  el(o, "path", { d: `M0 0 Q${len * .5} ${-len * .06} ${len} ${-len * .02}`, stroke: "url(#bpOro)", "stroke-width": .8, fill: "none" });
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), px = len * t, py = -len * .05 * Math.sin(t * Math.PI), lado = i % 2 ? -1 : 1, l = len * .16 * (1.1 - t * .4);
    const g2 = el(o, "g", { transform: `translate(${px} ${py}) rotate(${lado * 48 - 10})` });
    el(g2, "path", { d: `M0 0 C${l * .25} ${-l * .3} ${l * .75} ${-l * .3} ${l} 0 C${l * .75} ${l * .3} ${l * .25} ${l * .3} 0 0 Z`, stroke: "url(#bpOro)", "stroke-width": .55, fill: "none" });
  }
  const g3 = el(o, "g", { transform: `translate(${len} ${-len * .02})` });
  el(g3, "path", { d: `M0 0 C${len * .05} ${-len * .05} ${len * .13} ${-len * .05} ${len * .17} 0 C${len * .13} ${len * .05} ${len * .05} ${len * .05} 0 0 Z`, stroke: "url(#bpOro)", "stroke-width": .55, fill: "none" });
}
// botón cerrado blanco
function botonBlanco(g, x, y, s, rot) {
  defsBlanco(g.ownerSVGElement);
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  el(o, "path", { d: "M0 10 L0 22", stroke: "#6f7e6b", "stroke-width": .9, fill: "none" });
  el(o, "path", { d: "M0 -12 C7 -10 8 2 4 7 C2 10 -2 10 -4 7 C-8 2 -7 -10 0 -12 Z", fill: "url(#bpPet2)", stroke: "#cfd3c4", "stroke-width": .4 });
  el(o, "path", { d: "M-5 6 Q-6 11 0 12 Q6 11 5 6 Q2 9 0 8 Q-2 9 -5 6 Z", fill: "#8d9c87" });
}
// tallo fino gris verdoso
function tallo(g, pts, w = 1) {
  el(g, "path", { d: "M" + pts.map((p) => p.join(" ")).join(" L"), stroke: "#6f7e6b", "stroke-width": w, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", opacity: .85 });
}
// Sello de cera con el logo nuevo: corona de hojitas en relieve dorado y la "DD" caligráfica
const CERAS = {
  salvia: ["#b6c2b0", "#8a9b84", "#56664f", "#76876f", "#cfd8ca"],
  marfil: ["#fffaf0", "#ece2cc", "#c7b591", "#e3d7bc", "#ffffff"],
  oro:    ["#f6e2a6", "#cfa856", "#8a6a2c", "#b9914a", "#fff1c4"],
  vino:   ["#a9506a", "#7d2f47", "#4a1727", "#6f2840", "#d98ca2"],
};
function selloLogo(g, tono = "salvia") {
  const svg = g.ownerSVGElement, d = svg.querySelector("defs"), [c0, c1, c2, cin, luz] = CERAS[tono], id = "cera" + tono;
  defsBlanco(svg);
  if (!svg.querySelector("#" + id)) d.insertAdjacentHTML("beforeend", `
    <radialGradient id="${id}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="${c0}"/><stop offset=".5" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></radialGradient>
    <radialGradient id="${id}i" cx=".5" cy=".5" r=".5"><stop offset=".8" stop-color="${cin}"/><stop offset=".95" stop-color="${c2}"/><stop offset="1" stop-color="${c0}"/></radialGradient>`);
  if (!svg.querySelector("#ddRelieve")) d.insertAdjacentHTML("beforeend", `
    <filter id="ddRelieve" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx=".5" dy=".9" stdDeviation=".5" flood-color="#2a1d0c" flood-opacity=".45"/></filter>`);
  el(g, "path", { d: "M0 -96 C30 -100 62 -84 80 -58 C98 -32 100 4 90 32 C78 66 50 94 8 96 C-30 100 -66 84 -86 50 C-100 20 -98 -22 -82 -52 C-64 -82 -34 -94 0 -96 Z", fill: `url(#${id})`, filter: "url(#waxEdge)" });
  el(g, "circle", { r: 72, fill: `url(#${id}i)` });
  el(g, "circle", { r: 72, fill: "none", stroke: luz, "stroke-width": 1.2, opacity: .5 });
  const oro = tono === "oro" ? "#7a5a22" : "url(#bpOroD)";
  // aro fino y corona de hojitas en relieve (con un espacio abajo, como el logo)
  el(g, "ellipse", { rx: 60, ry: 64, fill: "none", stroke: oro, "stroke-width": 1, filter: "url(#ddRelieve)" });
  const hojita = (a, lado) => {
    const x = 60 * Math.cos(a), y = 64 * Math.sin(a), rot = Math.atan2(64 * Math.cos(a), -60 * Math.sin(a)) * 180 / Math.PI + lado * 40;
    el(g, "path", { d: "M0 0 C3 -4 10 -4 14 0 C10 4 3 4 0 0 Z", transform: `translate(${x} ${y}) rotate(${rot})`, fill: tono === "oro" ? "#9c7a36" : "none", stroke: oro, "stroke-width": .9, filter: "url(#ddRelieve)" });
  };
  for (let i = 0; i < 9; i++) { const a = (200 + i * 15) * Math.PI / 180; hojita(a, i % 2 ? 1 : -1); hojita(Math.PI - a, i % 2 ? -1 : 1); }
  [[-1, 1], [1, 1]].forEach(([sx]) => el(g, "circle", { cx: sx * 42, cy: 46, r: 3, fill: oro, opacity: .9 })); // florecitas abajo
  el(g, "path", { d: "M-6 -64 L-6 -56 M6 -64 L6 -50", stroke: oro, "stroke-width": .7 });
  el(g, "rect", { x: -9, y: -57, width: 6, height: 9, rx: 1, fill: "none", stroke: oro, "stroke-width": .8 });   // dos faroles diminutos
  el(g, "rect", { x: 3, y: -51, width: 6, height: 9, rx: 1, fill: "none", stroke: oro, "stroke-width": .8 });
  // "DD" caligráfica
  const dd = el(g, "g", { filter: "url(#ddRelieve)" });
  el(dd, "path", { d: "M-50 -2 C-30 -8 -8 -9 14 -5", stroke: oro, "stroke-width": 1.1, fill: "none", "stroke-linecap": "round" });
  el(dd, "path", { d: "M-22 30 C0 26 22 22 40 12", stroke: oro, "stroke-width": 1.1, fill: "none", "stroke-linecap": "round" });
  el(dd, "text", { x: -46, y: 10, "font-family": "PS", "font-size": 60, fill: oro }).textContent = "D";
  el(dd, "text", { x: -24, y: 36, "font-family": "PS", "font-size": 60, fill: oro }).textContent = "D";
  el(g, "path", { d: "M-58 -68 C-30 -86 14 -88 44 -74", stroke: luz, "stroke-width": 5, "stroke-linecap": "round", opacity: .3, fill: "none" });
}
