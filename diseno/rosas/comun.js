// Piezas comunes de las ilustraciones: degradados dorados, papel, orquídeas blancas con labio vino y flores secas
const NS = "http://www.w3.org/2000/svg";
const DEFS = `
  <filter id="paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .40  0 0 0 .07 0"/>
  </filter>
  <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="4" seed="9" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="9"/>
  </filter>
  <filter id="roughGold" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="4" seed="3" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="14"/>
  </filter>
  <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#cdb07a"/><stop offset=".22" stop-color="#efdfb6"/>
    <stop offset=".45" stop-color="#b8955a"/><stop offset=".68" stop-color="#ead6a3"/><stop offset="1" stop-color="#a98547"/>
  </linearGradient>
  <filter id="foilTex" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="2" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .85  0 0 0 .55 0" result="g"/>
    <feComposite in="g" in2="SourceGraphic" operator="in" result="gr"/>
    <feBlend in="gr" in2="SourceGraphic" mode="soft-light"/>
    <feDropShadow dx=".6" dy="1.1" stdDeviation=".8" flood-color="#6b5226" flood-opacity=".32"/>
  </filter>
  <radialGradient id="petal" cx=".5" cy=".8" r=".9">
    <stop offset="0" stop-color="#efe6d9"/><stop offset=".55" stop-color="#fbf8f2"/><stop offset="1" stop-color="#ffffff"/>
  </radialGradient>
  <radialGradient id="wine" cx=".4" cy=".35" r=".75">
    <stop offset="0" stop-color="#a24a63"/><stop offset=".55" stop-color="#7a2e45"/><stop offset="1" stop-color="#4f1a2b"/>
  </radialGradient>
  <radialGradient id="ivorySeal" cx=".4" cy=".35" r=".7">
    <stop offset="0" stop-color="#fffdf8"/><stop offset=".7" stop-color="#efe6d8"/><stop offset="1" stop-color="#d9ccb7"/>
  </radialGradient>
  <symbol id="sprig" viewBox="0 0 40 70">
    <path d="M20 68 C20 50 21 30 20 4" stroke="#b8965c" stroke-width=".9" fill="none"/>
    <g fill="#c4a46c">
      <ellipse cx="15" cy="16" rx="2.2" ry="4.6" transform="rotate(-38 15 16)"/><ellipse cx="25" cy="13" rx="2.2" ry="4.6" transform="rotate(38 25 13)"/>
      <ellipse cx="14" cy="27" rx="2.4" ry="5" transform="rotate(-45 14 27)"/><ellipse cx="26" cy="24" rx="2.4" ry="5" transform="rotate(45 26 24)"/>
      <ellipse cx="13.5" cy="39" rx="2.6" ry="5.4" transform="rotate(-50 13.5 39)"/><ellipse cx="26.5" cy="36" rx="2.6" ry="5.4" transform="rotate(50 26.5 36)"/>
      <ellipse cx="20" cy="5" rx="1.8" ry="3.8"/>
    </g>
  </symbol>`;

let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const el = (parent, tag, attrs) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

function addDefs(svg) {
  const d = document.createElementNS(NS, "defs");
  d.innerHTML = DEFS;
  svg.prepend(d);
}

// Orquídea blanca (phalaenopsis) con labio color vino
function orquidea(g, cx, cy, s, rot, labio = "#7a2e45") {
  const o = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot}) scale(${s})` });
  const p = (d, fill) => el(o, "path", { d, fill, stroke: "#d7c8ae", "stroke-width": .7, "stroke-linejoin": "round" });
  p("M0 -4 C-7 -14 -8 -30 0 -38 C8 -30 7 -14 0 -4 Z", "url(#petal)");
  p("M-2 2 C-10 10 -20 22 -18 32 C-10 32 -3 18 -1 4 Z", "url(#petal)");
  p("M2 2 C10 10 20 22 18 32 C10 32 3 18 1 4 Z", "url(#petal)");
  p("M-1 -3 C-10 -22 -38 -26 -40 -8 C-42 8 -22 14 -1 1 Z", "url(#petal)");
  p("M1 -3 C10 -22 38 -26 40 -8 C42 8 22 14 1 1 Z", "url(#petal)");
  el(o, "path", { d: "M-4 -4 C-14 -10 -24 -12 -32 -9 M4 -4 C14 -10 24 -12 32 -9", stroke: "#e6dac6", "stroke-width": .6, fill: "none" });
  el(o, "path", { d: "M0 1 C-5 2 -8 8 -5 12.5 C-3 15 3 15 5 12.5 C8 8 5 2 0 1 Z", fill: labio, stroke: "none" });
  el(o, "path", { d: "M-4 3 C-7 1 -8 4 -6 6 Z M4 3 C7 1 8 4 6 6 Z", fill: labio, opacity: .75 });
  el(o, "ellipse", { cx: 0, cy: -1, rx: 2.4, ry: 3.2, fill: "#e2c58a" });
  [[-6, -8], [6, -8], [-9, -4], [9, -4]].forEach(([x, y]) => el(o, "circle", { cx: x, cy: y, r: .8, fill: labio, opacity: .55 }));
}

// Pluma de pampa a lo largo de una curva
function pampa(g, x1, y1, x2, y2, largo = 120, color = "#d3c2a2") {
  el(g, "path", { d: `M${x1} ${y1} Q${(x1 + x2) / 2 + 10} ${(y1 + y2) / 2} ${x2} ${y2}`, stroke: "#cbb895", "stroke-width": 1, fill: "none" });
  const ang = Math.atan2(y1 - y2, x1 - x2);
  for (let i = 0; i < 70; i++) {
    const t = i / 70, px = x2 + Math.cos(ang) * largo * t + (rnd() - .5) * 5, py = y2 + Math.sin(ang) * largo * t + (rnd() - .5) * 5;
    const a = ang * 180 / Math.PI + 90 + (i % 2 ? 30 : -30) + (rnd() - .5) * 30;
    el(g, "ellipse", { cx: px, cy: py, rx: 1.4, ry: 6 + rnd() * 5, fill: color, opacity: .5 + rnd() * .35, transform: `rotate(${a} ${px} ${py})` });
  }
}

// Ramito de paniculata
function paniculata(g, x0, y0, cx, cy, n = 16, r0 = 16) {
  el(g, "path", { d: `M${x0} ${y0} Q${(x0 + cx) / 2} ${(y0 + cy) / 2 + 20} ${cx} ${cy}`, stroke: "#c8b99c", "stroke-width": .5, fill: "none" });
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2, r = rnd() * r0;
    el(g, "circle", { cx: cx + Math.cos(a) * r, cy: cy + Math.sin(a) * r, r: 1.4 + rnd() * 1.3, fill: "#fbf7f0", stroke: "#d4c5a8", "stroke-width": .45 });
  }
}

// Rama de eucalipto seco
function rama(g, x1, y1, x2, y2, n = 7) {
  el(g, "path", { d: `M${x1} ${y1} L${x2} ${y2}`, stroke: "#b5a88f", "stroke-width": .8, fill: "none" });
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
    const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    el(g, "ellipse", { cx: px, cy: py, rx: 3, ry: 6.5, fill: i % 2 ? "#c9bea8" : "#bdb199", opacity: .75, transform: `rotate(${a + (i % 2 ? 50 : -50)} ${px} ${py}) translate(0 -5)` });
  }
}

// Orquídea fina: pétalos con venas suaves y labio rubor con puntitos vino (más delicada)
function orquideaFina(g, cx, cy, s, rot) {
  const o = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot}) scale(${s})` });
  const p = (d, fill) => el(o, "path", { d, fill, stroke: "#dccfba", "stroke-width": .55, "stroke-linejoin": "round" });
  p("M0 -4 C-7 -14 -8 -30 0 -38 C8 -30 7 -14 0 -4 Z", "url(#petal)");
  p("M-2 2 C-10 10 -20 22 -18 32 C-10 32 -3 18 -1 4 Z", "url(#petal)");
  p("M2 2 C10 10 20 22 18 32 C10 32 3 18 1 4 Z", "url(#petal)");
  p("M-1 -3 C-10 -22 -38 -26 -40 -8 C-42 8 -22 14 -1 1 Z", "url(#petal)");
  p("M1 -3 C10 -22 38 -26 40 -8 C42 8 22 14 1 1 Z", "url(#petal)");
  el(o, "path", { d: "M-3 -4 C-12 -12 -24 -15 -34 -10 M-3 -2 C-14 -4 -26 -2 -34 2 M3 -4 C12 -12 24 -15 34 -10 M3 -2 C14 -4 26 -2 34 2 M0 -6 L0 -32", stroke: "#ebe1d1", "stroke-width": .5, fill: "none" });
  el(o, "path", { d: "M0 1 C-5 2 -8 8 -5 12.5 C-3 15 3 15 5 12.5 C8 8 5 2 0 1 Z", fill: "#efd6d6", stroke: "#dcbcbc", "stroke-width": .4 });
  [[-2, 6], [2, 7], [0, 9.5], [-3, 10], [3, 10.5], [-1, 4], [1.5, 4]].forEach(([x, y]) => el(o, "circle", { cx: x, cy: y, r: .55, fill: "#8a3550", opacity: .8 }));
  el(o, "ellipse", { cx: 0, cy: -1, rx: 2, ry: 2.8, fill: "#ead2a0" });
}
// Disco de lunaria (traslúcido)
function lunaria(g, cx, cy, r) {
  el(g, "ellipse", { cx, cy, rx: r, ry: r * 1.12, fill: "#ffffff", opacity: .6, stroke: "#d8cbb4", "stroke-width": .5 });
  el(g, "circle", { cx: cx - r * .3, cy: cy - r * .2, r: r * .18, fill: "#e9dfcf", opacity: .7 });
}

// Rosa de jardín vista desde arriba (pétalos en capas). tono: "marfil" | "vino" | "rubor"
const TONOS_ROSA = {
  marfil: ["#fffcf6", "#eadcc5", "#c9b38f", "#cdb995"],
  rubor:  ["#fdf3f1", "#ecccc6", "#cf9c94", "#d3a59d"],
  vino:   ["#a8496a", "#7a2e45", "#4f1a2b", "#8c3a55"],
};
let rosaN = 0;
function rosa(g, cx, cy, r, tono = "marfil", rot = 0) {
  const [claro, medio, oscuro, borde] = TONOS_ROSA[tono];
  const id = "rg" + (rosaN++);
  const defs = g.ownerSVGElement.querySelector("defs");
  defs.insertAdjacentHTML("beforeend", `<radialGradient id="${id}" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="${oscuro}"/><stop offset=".55" stop-color="${medio}"/><stop offset="1" stop-color="${claro}"/></radialGradient>
    <linearGradient id="${id}p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${medio}"/><stop offset="1" stop-color="${claro}"/></linearGradient>`);
  const o = el(g, "g", { transform: `translate(${cx} ${cy}) rotate(${rot})` });
  el(o, "circle", { r: r, fill: `url(#${id})` });
  // capas de pétalos: de afuera hacia adentro
  const capas = [[1, 6, 1.0], [.8, 5, .85], [.6, 5, .7], [.42, 4, .55], [.26, 3, .4]];
  capas.forEach(([esc, n, w], k) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 360 + k * 23;
      const R = r * esc, W = r * w * .75;
      el(o, "path", {
        d: `M0 ${-R * .15} C${-W} ${-R * .2} ${-W * .9} ${-R} 0 ${-R} C${W * .9} ${-R} ${W} ${-R * .2} 0 ${-R * .15} Z`,
        fill: `url(#${id}p)`, stroke: borde, "stroke-width": .7, transform: `rotate(${a})`, opacity: .97,
      });
      // sombra en la base del pétalo (da volumen)
      el(o, "path", { d: `M${-W * .45} ${-R * .3} C${-W * .2} ${-R * .48} ${W * .2} ${-R * .48} ${W * .45} ${-R * .3}`, stroke: oscuro, "stroke-width": 1.4, fill: "none", transform: `rotate(${a})`, opacity: .35 });
      // borde enrollado del pétalo (brillo)
      el(o, "path", { d: `M${-W * .55} ${-R * .82} C${-W * .2} ${-R * 1.02} ${W * .2} ${-R * 1.02} ${W * .55} ${-R * .82}`, stroke: claro, "stroke-width": .9, fill: "none", transform: `rotate(${a})`, opacity: .9 });
    }
  });
  // centro en espiral
  el(o, "path", { d: `M0 0 C${r * .12} ${-r * .05} ${r * .1} ${r * .14} 0 ${r * .12} C${-r * .16} ${r * .1} ${-r * .16} ${-r * .14} 0 ${-r * .16} C${r * .2} ${-r * .18} ${r * .24} ${r * .1} ${r * .06} ${r * .2}`, stroke: oscuro, "stroke-width": .8, fill: "none", opacity: .6 });
}
// Hoja de rosa (verde salvia apagado) y botón
function hojaRosa(g, x, y, s, rot) {
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  el(o, "path", { d: "M0 0 C8 -6 20 -6 30 0 C20 6 8 6 0 0 Z", fill: "#b9b49b", stroke: "#a19c82", "stroke-width": .5 });
  el(o, "path", { d: "M0 0 L28 0", stroke: "#a19c82", "stroke-width": .5 });
}
function boton(g, x, y, s, rot, tono = "marfil") {
  const [claro, medio, , borde] = TONOS_ROSA[tono];
  const o = el(g, "g", { transform: `translate(${x} ${y}) rotate(${rot}) scale(${s})` });
  el(o, "path", { d: "M0 0 C-7 -4 -7 -16 0 -22 C7 -16 7 -4 0 0 Z", fill: medio, stroke: borde, "stroke-width": .5 });
  el(o, "path", { d: "M0 -2 C-4 -6 -3 -16 1 -20", stroke: claro, "stroke-width": 1, fill: "none" });
  el(o, "path", { d: "M0 0 C-6 2 -9 -4 -8 -8 M0 0 C6 2 9 -4 8 -8", stroke: "#a19c82", "stroke-width": 1.2, fill: "none" });
}
