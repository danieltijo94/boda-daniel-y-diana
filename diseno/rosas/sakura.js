// Flores de cerezo japonés (sakura) con volumen: pétalos con muesca, degradado del centro rosado al borde
// casi blanco, venas, borde con luz, estambres con anteras amarillas y sombra suave debajo de cada flor.
const SAK = {
  claro:  { base: "#e8a9ba", medio: "#f7dbe2", borde: "#fef6f7", vena: "#d98ea4", centro: "#c0587b", trazo: "#ecc2cd" },
  rosa:   { base: "#df92a8", medio: "#f2c7d3", borde: "#fdeef2", vena: "#cf7d96", centro: "#ad4268", trazo: "#e3adbc" },
  intenso:{ base: "#d27c96", medio: "#eab2c2", borde: "#fbe3ea", vena: "#c06d88", centro: "#9b3459", trazo: "#d899ab" },
};
let skN = 0;
function defsSakura(svg, tono) {
  const p = SAK[tono], id = "sk" + tono, d = svg.querySelector("defs");
  if (!svg.querySelector("#" + id)) d.insertAdjacentHTML("beforeend", `
    <linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${p.base}"/><stop offset=".22" stop-color="${p.medio}"/><stop offset=".7" stop-color="${p.borde}"/><stop offset="1" stop-color="#fffafb"/>
    </linearGradient>
    <linearGradient id="${id}r" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${p.base}"/><stop offset=".5" stop-color="${p.medio}"/><stop offset="1" stop-color="${p.medio}"/>
    </linearGradient>`);
  if (!svg.querySelector("#skSombra")) d.insertAdjacentHTML("beforeend", `
    <filter id="skSombra" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.2"/></filter>
    <filter id="skSuave" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".12" numOctaves="2" seed="31" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6"/>
    </filter>
    <linearGradient id="skRama" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#7a5747"/><stop offset=".45" stop-color="#4d3429"/><stop offset="1" stop-color="#2f1f19"/>
    </linearGradient>
    <radialGradient id="skBoton" cx=".4" cy=".35" r=".7">
      <stop offset="0" stop-color="#fbd2df"/><stop offset=".6" stop-color="#e57fa2"/><stop offset="1" stop-color="#b8456d"/>
    </radialGradient>
    <linearGradient id="skHoja" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#a8b46f"/><stop offset=".6" stop-color="#7f8e4c"/><stop offset="1" stop-color="#8b6a3f"/>
    </linearGradient>`);
  return id;
}
// pétalo de cerezo: base en (0,0), apunta hacia arriba, con muesca en la punta
function petaloSakura(L, W) {
  return `M0 0 C${-W * .55} ${-L * .22} ${-W * .78} ${-L * .78} ${-W * .32} ${-L * .99}
    Q${-W * .1} ${-L * 1.06} 0 ${-L * .86} Q${W * .1} ${-L * 1.06} ${W * .32} ${-L * .99}
    C${W * .78} ${-L * .78} ${W * .55} ${-L * .22} 0 0 Z`;
}
// Flor abierta vista de frente o inclinada. inclina=1 de frente, menor = más de lado
function sakura(g, cx, cy, r, tono = "claro", rot = 0, inclina = .8) {
  const svg = g.ownerSVGElement, id = defsSakura(svg, tono), p = SAK[tono];
  let s = 11 + (skN++) * 17;
  const rn = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const o0 = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot})` });
  const o = el(o0, "g", { filter: "url(#skSuave)" });
  const a0 = rn() * Math.PI * 2, ps = [];
  for (let i = 0; i < 5; i++) {
    const th = a0 + i * Math.PI * 2 / 5 + (rn() - .5) * .22;
    ps.push({ th, i, y: Math.sin(th) * inclina, L: r * (.94 + rn() * .12), W: r * (1.02 + rn() * .14) });
  }
  // se superponen en espiral (cada pétalo tapa un poco al siguiente), como en la flor real
  ps.forEach((q) => {
    const deg = q.th * 180 / Math.PI + 90;
    const sy = Math.min(1, (inclina + (1 - inclina) * Math.abs(Math.cos(q.th))) / inclina);
    const g2 = el(o, "g", { transform: `scale(1 ${inclina}) rotate(${deg}) scale(1 ${sy})` });
    const d = petaloSakura(q.L, q.W);
    el(g2, "path", { d, fill: `url(#${id})`, stroke: p.trazo, "stroke-width": .35, "fill-opacity": .97 });
    // vetas rosadas que salen del centro
    for (let k = -3; k <= 3; k++) {
      const ex = k * q.W * .085, ey = -q.L * (.42 + rn() * .2);
      el(g2, "path", { d: `M${k * .4} ${-q.L * .04} Q${ex * .6} ${ey * .55} ${ex} ${ey}`, stroke: p.vena, "stroke-width": .4, fill: "none", opacity: .45 - Math.abs(k) * .05 });
    }
    // sombra del pétalo de al lado (volumen) y brillo del borde
    el(g2, "path", { d: `M0 0 C${-q.W * .5} ${-q.L * .2} ${-q.W * .62} ${-q.L * .6} ${-q.W * .5} ${-q.L * .78} C${-q.W * .3} ${-q.L * .5} ${-q.W * .16} ${-q.L * .2} 0 0 Z`, fill: p.base, opacity: .06 });
    el(g2, "path", { d: `M${q.W * .3} ${-q.L * .98} C${q.W * .6} ${-q.L * .82} ${q.W * .66} ${-q.L * .5} ${q.W * .52} ${-q.L * .28}`, stroke: "#fff", "stroke-width": 1.1, fill: "none", opacity: .65 });
  });
  // centro: estambres finos y largos con anteras pequeñas
  const c = el(o0, "g", { transform: `scale(1 ${inclina})` });
  el(c, "circle", { r: r * .16, fill: p.base, opacity: .55 });
  el(c, "circle", { r: r * .08, fill: "#b8c27a", opacity: .8 });
  for (let i = 0; i < 24; i++) {
    const a = i / 24 * Math.PI * 2 + rn() * .25, l = r * (.3 + rn() * .2), x = Math.cos(a) * l, y = Math.sin(a) * l;
    el(c, "path", { d: `M${Math.cos(a) * r * .07} ${Math.sin(a) * r * .07} Q${x * .5 + (rn() - .5) * 1.5} ${y * .5 + (rn() - .5) * 1.5} ${x} ${y}`, stroke: p.centro, "stroke-width": .4, fill: "none", opacity: .6 });
    el(c, "circle", { cx: x, cy: y, r: r * .022 + .35, fill: i % 3 ? "#d9a646" : "#b9793a", opacity: .9 });
  }
}
// Flor medio abierta, de perfil (copa)
function sakuraPerfil(g, cx, cy, r, tono = "rosa", rot = 0) {
  const svg = g.ownerSVGElement, id = defsSakura(svg, tono), p = SAK[tono];
  const o = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot})` });
  el(o, "path", { d: `M0 ${r * .5} L0 ${r * 1.2}`, stroke: "#6d4a3a", "stroke-width": 1, fill: "none" });
  el(o, "path", { d: `M${-r * .25} ${r * .45} Q0 ${r * .75} ${r * .25} ${r * .45} Q0 ${r * .55} ${-r * .25} ${r * .45} Z`, fill: "#7d2f45" });
  [[-34, .85], [34, .85], [-12, 1], [14, 1], [0, .95]].forEach(([a, k], i) => {
    const g2 = el(o, "g", { transform: `translate(0 ${r * .45}) rotate(${a}) scale(${.75} 1)` });
    el(g2, "path", { d: petaloSakura(r * k, r * .95), fill: `url(#${i < 2 ? id + "r" : id})`, stroke: p.trazo, "stroke-width": .5, opacity: i < 2 ? .9 : 1 });
  });
  for (let i = 0; i < 6; i++) { const x = (i - 2.5) * r * .1; el(o, "circle", { cx: x, cy: -r * .25 - Math.abs(x) * .2, r: r * .04 + .3, fill: "#f3c24f" }); }
}
// Botón cerrado con cáliz
function botonSakura(g, x, y, s, rot) {
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  el(o, "path", { d: "M0 10 L0 22", stroke: "#6d4a3a", "stroke-width": 1, fill: "none" });
  el(o, "path", { d: "M0 -12 C7 -10 8 2 4 7 C2 10 -2 10 -4 7 C-8 2 -7 -10 0 -12 Z", fill: "url(#skBoton)", stroke: "#c86d8e", "stroke-width": .4 });
  el(o, "path", { d: "M-1 -10 C-4 -6 -4 2 -2 6", stroke: "#fff", "stroke-width": .8, fill: "none", opacity: .6 });
  el(o, "path", { d: "M-5 6 Q-3 11 0 11 Q3 11 5 6 Q2 9 0 8 Q-2 9 -5 6 Z", fill: "#7d2f45" });
}
// Hoja nueva de cerezo (verde con tono cobrizo)
function hojaSakura(g, x, y, s, rot) {
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  el(o, "path", { d: "M0 0 C8 -9 26 -10 40 0 C26 10 8 9 0 0 Z", fill: "url(#skHoja)", stroke: "#6f7a3c", "stroke-width": .4 });
  el(o, "path", { d: "M0 0 L38 0", stroke: "#c8cf98", "stroke-width": .5 });
  for (let i = 1; i < 6; i++) el(o, "path", { d: `M${i * 6} 0 L${i * 6 + 5} -5 M${i * 6} 0 L${i * 6 + 5} 5`, stroke: "#b9c182", "stroke-width": .35 });
}
// Rama con volumen: trazo grueso que se afina, luz arriba y marcas horizontales de la corteza
function rama3d(g, pts, w0, w1) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], t = i / (pts.length - 1), w = w0 + (w1 - w0) * t;
    const mx = (x0 + x1) / 2 + (i % 2 ? 3 : -3), my = (y0 + y1) / 2 + (i % 2 ? -2 : 2);
    el(g, "path", { d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`, stroke: "#2f1f19", "stroke-width": w + 1, "stroke-linecap": "round", fill: "none" });
    el(g, "path", { d: `M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`, stroke: "#5a3d30", "stroke-width": w, "stroke-linecap": "round", fill: "none" });
    el(g, "path", { d: `M${x0} ${y0 - w * .25} Q${mx} ${my - w * .25} ${x1} ${y1 - w * .25}`, stroke: "#8a6553", "stroke-width": Math.max(.6, w * .3), "stroke-linecap": "round", fill: "none", opacity: .8 });
    for (let k = 1; k < 3; k++) { const px = x0 + (x1 - x0) * k / 3, py = y0 + (y1 - y0) * k / 3;
      el(g, "path", { d: `M${px - w * .3} ${py} L${px + w * .3} ${py + .4}`, stroke: "#c4a28f", "stroke-width": .6, opacity: .55 }); }
  }
}
