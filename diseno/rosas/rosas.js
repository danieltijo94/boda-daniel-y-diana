// Rosas de jardín "realistas" (estilo ilustración botánica): pétalos en perspectiva que forman una copa
const PALETA = {
  marfil: { base: "#cdb894", medio: "#ece0cb", borde: "#fffaf1", sombra: "#9f8a68", trazo: "#c8b28c" },
  rubor:  { base: "#c99088", medio: "#efcfc8", borde: "#fff4f1", sombra: "#9d655e", trazo: "#d1a299" },
  vino:   { base: "#3d0f1f", medio: "#7a2a44", borde: "#b8607a", sombra: "#2a0915", trazo: "#5c1d31" },
};
let rrN = 0;
function defsRosa(svg, tono) {
  const p = PALETA[tono], id = "pt" + tono;
  if (svg.querySelector("#" + id)) return id;
  const d = svg.querySelector("defs");
  d.insertAdjacentHTML("beforeend", `
    <linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0" stop-color="${p.base}"/><stop offset=".45" stop-color="${p.medio}"/><stop offset="1" stop-color="${p.borde}"/>
    </linearGradient>
    <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.borde}"/><stop offset=".6" stop-color="${p.medio}"/><stop offset="1" stop-color="${p.base}"/>
    </linearGradient>
    <radialGradient id="${id}c" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${p.sombra}"/><stop offset=".7" stop-color="${p.base}"/><stop offset="1" stop-color="${p.medio}"/>
    </radialGradient>`);
  if (!svg.querySelector("#petaloSuave")) d.insertAdjacentHTML("beforeend", `
    <filter id="petaloSuave" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="21" result="t"/>
      <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" result="d"/>
      <feGaussianBlur in="d" stdDeviation=".25"/>
    </filter>
    <filter id="sombraRosa" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.5"/></filter>`);
  return id;
}
// pétalo apuntando hacia arriba con base en (0,0); con muesca suave en la punta
function petaloPath(L, W) {
  return `M0 0 C${-W * .55} ${-L * .08} ${-W * .78} ${-L * .7} ${-W * .38} ${-L * .98}
    C${-W * .18} ${-L * 1.06} ${-W * .05} ${-L * .96} 0 ${-L * .99}
    C${W * .05} ${-L * .96} ${W * .18} ${-L * 1.06} ${W * .38} ${-L * .98}
    C${W * .78} ${-L * .7} ${W * .55} ${-L * .08} 0 0 Z`;
}
function rosaReal(g, cx, cy, r, tono = "marfil", rot = 0, inclina = .62) {
  const svg = g.ownerSVGElement, id = defsRosa(svg, tono), p = PALETA[tono];
  let s = 7 + (rrN++) * 13;
  const rn = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const o0 = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot})` });
  el(o0, "ellipse", { cx: r * .04, cy: r * .3, rx: r * .82, ry: r * .48, fill: "#5b4632", opacity: .16, filter: "url(#sombraRosa)" });
  const o = el(o0, "g", { filter: "url(#petaloSuave)" });
  const capa = (n, dist, L, W, ang0, abre, grad = id, op = 1) => {
    const ps = [];
    for (let i = 0; i < n; i++) {
      const th = ang0 + (i / n) * Math.PI * 2 + (rn() - .5) * .3;
      ps.push({ th, x: Math.cos(th) * dist, y: Math.sin(th) * dist * inclina, L: L * (.9 + rn() * .2), W: W * (.9 + rn() * .2) });
    }
    ps.sort((a, b) => a.y - b.y); // de atrás hacia adelante
    ps.forEach((q) => {
      const deg = q.th * 180 / Math.PI + 90;            // apunta hacia afuera
      const sy = inclina + (1 - inclina) * Math.abs(Math.cos(q.th)) * abre; // escorzo
      const t = `translate(${q.x} ${q.y}) rotate(${deg}) scale(1 ${sy})`;
      el(o, "path", { d: petaloPath(q.L, q.W), fill: `url(#${grad})`, stroke: p.trazo, "stroke-width": .6, transform: t, opacity: op });
      // borde enrollado con luz y pliegue central
      el(o, "path", { d: `M${-q.W * .5} ${-q.L * .9} C${-q.W * .2} ${-q.L * 1.02} ${q.W * .2} ${-q.L * 1.02} ${q.W * .5} ${-q.L * .9}`, stroke: p.borde, "stroke-width": 1.6, fill: "none", opacity: .8, transform: t });
      el(o, "path", { d: `M0 ${-q.L * .15} C${q.W * .06} ${-q.L * .45} ${-q.W * .04} ${-q.L * .7} 0 ${-q.L * .9}`, stroke: p.sombra, "stroke-width": .6, fill: "none", opacity: .25, transform: t });
    });
  };
  // pétalos exteriores abiertos
  capa(8, r * .3, r * .78, r * .8, 0, 1);
  capa(7, r * .2, r * .64, r * .7, .4, .9);
  // copa central: un fondo oscuro y pétalos que se cierran
  el(o, "ellipse", { cx: 0, cy: -r * .06, rx: r * .56, ry: r * .56 * inclina * 1.05, fill: `url(#${id}c)` });
  // espiral de pétalos enrollados (centro típico de la rosa): medialunas que giran hacia adentro
  const P = (ang, rad, dx = 0, dy = 0) => [Math.cos(ang) * rad + dx, Math.sin(ang) * rad * inclina + dy - r * .06];
  for (let k = 0; k < 8; k++) {
    const rk = r * .56 * (1 - k * .105), a0 = k * 1.3 + .3, span = 3.2 - k * .1, a1 = a0 + span;
    const c = [Math.cos(a0 + span / 2) * rk * .2, Math.sin(a0 + span / 2) * rk * .2 * inclina];
    const [x0, y0] = P(a0, rk), [x1, y1] = P(a1, rk);
    const [u1, v1] = P(a1, rk * .66, c[0], c[1]), [u0, v0] = P(a0, rk * .66, c[0], c[1]);
    const d = `M${x0} ${y0} A${rk} ${rk * inclina} 0 1 1 ${x1} ${y1} L${u1} ${v1} A${rk * .66} ${rk * .66 * inclina} 0 1 0 ${u0} ${v0} Z`;
    el(o, "path", { d, fill: `url(#${k % 2 ? id + "i" : id})`, stroke: p.trazo, "stroke-width": .55 });
    el(o, "path", { d: `M${x0} ${y0} A${rk} ${rk * inclina} 0 1 1 ${x1} ${y1}`, stroke: p.borde, "stroke-width": 1.3, fill: "none", opacity: .75 });
    el(o, "path", { d: `M${u1} ${v1} A${rk * .66} ${rk * .66 * inclina} 0 1 0 ${u0} ${v0}`, stroke: p.sombra, "stroke-width": 1, fill: "none", opacity: .35 });
  }
  el(o, "ellipse", { cx: r * .02, cy: -r * .07, rx: r * .05, ry: r * .035, fill: p.sombra, opacity: .7 });
}
// Hoja de rosa dentada con nervaduras
function hojaReal(g, x, y, s, rot) {
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  let dEdge = "M0 0";
  for (let i = 1; i <= 9; i++) { const t = i / 9, xx = 36 * t, w = Math.sin(Math.PI * t) * 11; dEdge += ` L${xx - 2} ${-w - 1.5} L${xx} ${-w}`; }
  for (let i = 9; i >= 0; i--) { const t = i / 9, xx = 36 * t, w = Math.sin(Math.PI * t) * 11; dEdge += ` L${xx + 1} ${w + 1.5} L${xx - 1} ${w}`; }
  el(o, "path", { d: dEdge + " Z", fill: "#b3b29b", stroke: "#97967d", "stroke-width": .5 });
  el(o, "path", { d: "M0 0 L36 0", stroke: "#cfd0b8", "stroke-width": .7 });
  for (let i = 1; i < 6; i++) { const xx = i * 6; el(o, "path", { d: `M${xx} 0 L${xx + 5} -6 M${xx} 0 L${xx + 5} 6`, stroke: "#c3c4aa", "stroke-width": .45 }); }
}
