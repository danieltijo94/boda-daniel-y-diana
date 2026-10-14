// Sello de cera vino burdeos con monograma D&D ornamentado (estilo de la referencia del usuario)
const SELLO_DEFS = `
  <filter id="waxEdge" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="12" result="t"/>
    <feDisplacementMap in="SourceGraphic" in2="t" scale="16"/>
  </filter>
  <radialGradient id="wax" cx=".38" cy=".32" r=".8">
    <stop offset="0" stop-color="#a9506a"/><stop offset=".45" stop-color="#7d2f47"/><stop offset="1" stop-color="#4a1727"/>
  </radialGradient>
  <radialGradient id="waxIn" cx=".5" cy=".5" r=".5">
    <stop offset=".82" stop-color="#6f2840"/><stop offset=".95" stop-color="#561d30"/><stop offset="1" stop-color="#8f3d56"/>
  </radialGradient>
  <linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#d9b76a"/><stop offset=".3" stop-color="#f3dc9c"/><stop offset=".55" stop-color="#c79a4b"/>
    <stop offset=".8" stop-color="#ecd08c"/><stop offset="1" stop-color="#b8893f"/>
  </linearGradient>
  <!-- oro en hoja: textura, línea grabada interior y leve relieve -->
  <filter id="goldLeaf" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="5" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 .92  0 0 0 0 .7  0 0 0 .7 -.1" result="g"/>
    <feComposite in="g" in2="SourceGraphic" operator="in" result="tex"/>
    <feBlend in="tex" in2="SourceGraphic" mode="multiply" result="base"/>
    <feMorphology in="SourceAlpha" operator="erode" radius="1.6" result="e1"/>
    <feMorphology in="SourceAlpha" operator="erode" radius="2.4" result="e2"/>
    <feComposite in="e1" in2="e2" operator="out" result="ring"/>
    <feFlood flood-color="#5a2333" flood-opacity=".9"/>
    <feComposite in2="ring" operator="in" result="inline"/>
    <feMerge result="m"><feMergeNode in="base"/><feMergeNode in="inline"/></feMerge>
    <feDropShadow in="m" dx=".7" dy="1" stdDeviation=".6" flood-color="#2a0b15" flood-opacity=".6"/>
  </filter>`;

// Monograma D&D: dos D grandes y la & entrelazada, con rulos en espiral; centrado en (0,0), ancho ~150
function monograma(g, opts = {}) {
  const hueco = opts.hueco || "#62233a";
  const m = el(g, "g", { transform: `scale(${opts.escala || 1})` });
  const txt = (t, a) => {
    el(m, "text", Object.assign({ fill: hueco, stroke: hueco, "stroke-width": 5, "stroke-linejoin": "round" }, a)).textContent = t;
    el(m, "text", Object.assign({ fill: "url(#leaf)", filter: "url(#goldLeaf)" }, a)).textContent = t;
  };
  const F = { "font-family": "BS" };
  txt("D", Object.assign({ x: -84, y: 30, "font-size": 92 }, F));
  txt("D", Object.assign({ x: 6, y: 30, "font-size": 92 }, F));
  // la & encima de las dos D (entrelazada); un trozo de la D derecha vuelve a quedar encima
  // "&" clásica itálica (opción 3 elegida por los novios)
  const amp = opts.amp || { attrs: { "font-family": "CGI", "font-size": 96, x: -26, y: 38 } };
  txt(amp.texto || "&", Object.assign({ x: -24, y: 36, "font-size": 74 }, F, amp.attrs || {}));
  const d = g.ownerSVGElement.querySelector("defs");
  const id = "cl" + Math.random().toString(36).slice(2, 7);
  const cp = el(d, "clipPath", { id }); el(cp, "rect", { x: 6, y: 6, width: 12, height: 18 });
  const top = el(m, "g", { "clip-path": `url(#${id})` });
  el(top, "text", Object.assign({ x: 6, y: 30, "font-size": 92, fill: "url(#leaf)", filter: "url(#goldLeaf)" }, F)).textContent = "D";
  // rulos en espiral (trazos dorados finos)
  const rulo = (dpath) => {
    el(m, "path", { d: dpath, fill: "none", stroke: hueco, "stroke-width": 4, "stroke-linecap": "round" });
    el(m, "path", { d: dpath, fill: "none", stroke: "url(#leaf)", "stroke-width": 1.6, "stroke-linecap": "round" });
  };
  rulo("M-80 26 C-94 30 -100 18 -94 11 C-89 6 -82 10 -85 15");   // abajo a la izquierda
  rulo("M-76 -34 C-88 -42 -100 -36 -97 -26 C-95 -20 -88 -22 -90 -27");               // arriba a la izquierda
  rulo("M78 -36 C90 -44 101 -35 96 -25 C93 -19 86 -22 88 -27");                     // arriba a la derecha
  rulo("M72 30 C86 38 98 30 94 21 C91 15 84 18 86 23");                            // abajo a la derecha
  return m;
}

function selloCera(g, r = 96, opts = {}) {
  const k = r / 96;
  const s = el(g, "g", { transform: `scale(${k})` });
  el(s, "path", { d: "M0 -96 C30 -100 62 -84 80 -58 C98 -32 100 4 90 32 C78 66 50 94 8 96 C-30 100 -66 84 -86 50 C-100 20 -98 -22 -82 -52 C-64 -82 -34 -94 0 -96 Z", fill: "url(#wax)", filter: "url(#waxEdge)" });
  el(s, "circle", { r: 72, fill: "url(#waxIn)" });
  el(s, "circle", { r: 72, fill: "none", stroke: "#a54d68", "stroke-width": 1.2, opacity: .6 });
  el(s, "circle", { r: 66, fill: "none", stroke: "url(#leaf)", "stroke-width": .9, opacity: .9 });
  el(s, "path", { d: "M-58 -68 C-30 -86 14 -88 44 -74", stroke: "#d98ca2", "stroke-width": 5, "stroke-linecap": "round", opacity: .28, fill: "none" });
  monograma(s, { escala: opts.escala || .6, amp: opts.amp });
  return s;
}

function addSelloDefs(svg) {
  const d = svg.querySelector("defs") || el(svg, "defs", {});
  d.insertAdjacentHTML("beforeend", SELLO_DEFS);
}
