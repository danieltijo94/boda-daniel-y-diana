/* =========================================================
   CONFIGURACIÓN — cambia aquí los datos principales
   ========================================================= */
const CONFIG = {
  // Fecha y hora de la boda (hora de Colombia, UTC-5)
  fecha: "2027-06-19T16:00:00-05:00",
  // Fecha límite para confirmar
  fechaLimiteConfirmacion: "30 de abril de 2027",
  // URL de tu Google Apps Script (ver CONFIGURAR-CORREO.md): confirmaciones y lista de invitados.
  // Es la misma que ENDPOINT en panel.js. Vacío = modo de prueba.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzUn2L-ukmTA2qxZPqtL_NP07KkcwTBhho45IDfBYrYjcCo_oL6x7sbNQ4qjci7HAtZnQ/exec",
  // Lugar para el evento de calendario
  lugarCalendario: "Hacienda Chic, Bogotá",
  // Duración aproximada del evento (horas) para el calendario
  duracionHoras: 8,
  // Punto para el clima: Hacienda Chic (Cra. 7 #247-15, norte de Bogotá, límite con Chía)
  clima: { lat: 4.8270, lon: -74.0314, lugar: "Hacienda Chic" },
};

/* ========================================================= */

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const weddingDate = new Date(CONFIG.fecha);

/* ---------- Fechas en la página (siempre en hora de Colombia) ---------- */
function fillDates() {
  // Día, mes y año de la boda en Colombia, sin importar el país del invitado
  const [y, m, d] = CONFIG.fecha.slice(0, 10).split("-").map(Number);
  const weekday = DIAS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  const pad = (n) => String(n).padStart(2, "0");
  const values = {
    weekday,
    day: d,
    monthYear: `${MESES[m - 1]} ${y}`,
    longDate: `${weekday} ${d} de ${MESES[m - 1].toLowerCase()} de ${y}`,
    shortDate: `${pad(d)} · ${pad(m)} · ${y}`,
    rsvpDeadline: CONFIG.fechaLimiteConfirmacion,
  };
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = values[el.dataset.cfg];
    if (v !== undefined) el.textContent = v;
  });
}

/* ---------- Invitado personalizado (?i=CODIGO → pestaña "Invitados" de Google Sheets) ---------- */
let guest = null;

function showGuest() {
  const pases = guest.nombres.length;
  $("#guestName").textContent = guest.familia;
  const intro = $("#introGuest");
  intro.textContent = guest.familia;
  intro.hidden = false;
  $("#passesNum").textContent = pases;
  $("#passesText").textContent = pases === 1 ? "pase reservado" : "pases reservados";
  $("#passesBox").hidden = false;
}

async function fillGuest() {
  const code = (params.get("i") || "").trim().toUpperCase();
  if (!code || !CONFIG.rsvpEndpoint) return;
  const key = "invitado:" + code;

  // Lo guardado en este celular se muestra al instante mientras llega la versión actual
  try {
    const saved = JSON.parse(localStorage.getItem(key) || "null");
    if (saved) { guest = saved; showGuest(); }
  } catch { /* sin almacenamiento */ }

  try {
    const res = await fetch(`${CONFIG.rsvpEndpoint}?accion=invitado&codigo=${encodeURIComponent(code)}`);
    const r = await res.json();
    if (r.ok) {
      // respuesta: lo último que confirmó la familia (desde la hoja), o null si aún no responde
      guest = { codigo: r.codigo, familia: r.familia, nombres: r.invitados, respuesta: r.respuesta === undefined ? undefined : r.respuesta };
      try { localStorage.setItem(key, JSON.stringify(guest)); } catch { /* ignorar */ }
      showGuest();
    } else if (r.error === "no existe") {
      guest = null;
      try { localStorage.removeItem(key); } catch { /* ignorar */ }
    }
  } catch { /* sin conexión: se queda con lo guardado, o la invitación general */ }
}

/* ---------- Sobre + música ---------- */
function setupIntro() {
  const intro = $("#intro");
  const env = $("#envelope");
  const music = $("#music");
  const btn = $("#musicBtn");
  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;
    intro.classList.add("opening");
    burst(intro.querySelector(".intro-petals"), 40);

    music.volume = 0.6;
    music.play().then(() => { btn.hidden = false; }).catch(() => { /* sin archivo de música */ });

    setTimeout(() => {
      intro.classList.add("hide");
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      revealHero();
      startPetals();
    }, 2300);
    setTimeout(() => intro.remove(), 3600);
  };
  env.addEventListener("click", open);

  btn.addEventListener("click", () => {
    if (music.paused) { music.play(); btn.classList.remove("paused"); }
    else { music.pause(); btn.classList.add("paused"); }
  });
}

/* ---------- Pétalos de orquídea y destellos dorados ---------- */
function makePetal(container, { fromTop = true } = {}) {
  const p = document.createElement("span");
  p.className = "petal" + (Math.random() < 0.3 ? " spark" : "");
  const size = 10 + Math.random() * 12;
  p.style.left = Math.random() * 100 + "vw";
  p.style.width = size + "px";
  p.style.height = size * 1.3 + "px";
  p.style.setProperty("--sway", (20 + Math.random() * 60) + "px");
  p.style.animationDuration = (8 + Math.random() * 7) + "s";
  p.style.opacity = 0.55 + Math.random() * 0.4;
  if (!fromTop) p.style.animationDelay = -(Math.random() * 6) + "s";
  container.appendChild(p);
  p.addEventListener("animationend", () => p.remove());
}

function burst(container, n) {
  for (let i = 0; i < n; i++) setTimeout(() => makePetal(container), i * 40);
}

function startPetals() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const container = $("#petals");
  for (let i = 0; i < 8; i++) makePetal(container, { fromTop: false });
  setInterval(() => {
    if (document.hidden || container.childElementCount > 22) return;
    makePetal(container);
  }, 1000);
}

/* ---------- Animaciones al hacer scroll ---------- */
let observer;
function setupReveal() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el) => {
    if (!el.closest(".hero")) observer.observe(el);
  });
}
function revealHero() {
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("in"));
}

/* ---------- Cuenta regresiva ---------- */
function setupCountdown() {
  const els = { d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs") };
  const set = (el, v) => {
    const t = String(v).padStart(2, "0");
    if (el.textContent !== t) {
      el.textContent = t;
      el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
    }
  };
  const tick = () => {
    const diff = weddingDate - new Date();
    if (diff <= 0) {
      $("#countdown").hidden = true;
      $("#cdDone").hidden = false;
      return clearInterval(timer);
    }
    set(els.d, Math.floor(diff / 864e5));
    set(els.h, Math.floor(diff / 36e5) % 24);
    set(els.m, Math.floor(diff / 6e4) % 60);
    set(els.s, Math.floor(diff / 1e3) % 60);
  };
  const timer = setInterval(tick, 1000);
  tick();
}

/* ---------- Agendar en Google Calendar ---------- */
function setupCalendar() {
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = new Date(weddingDate.getTime() + CONFIG.duracionHoras * 36e5);
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", "Boda de Daniel Alejandro & Diana Carolina 💍");
  url.searchParams.set("dates", `${fmt(weddingDate)}/${fmt(end)}`);
  url.searchParams.set("location", CONFIG.lugarCalendario);
  url.searchParams.set("details", "¡Te esperamos para celebrar nuestro amor! Ubicación: https://maps.app.goo.gl/DuaCmXVdwyJRUusX6");
  $("#calendarBtn").href = url.toString();
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2000);
}

/* ---------- Confirmación de asistencia ---------- */
// Acepta links de YouTube con un video (youtu.be, watch?v=, shorts, music.youtube.com…)
function isYouTube(url) {
  try {
    const u = new URL(url);
    if (!/(^|\.)youtube\.com$|(^|\.)youtu\.be$/i.test(u.hostname)) return false;
  } catch { return false; }
  return /(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)[\w-]{11}/.test(url);
}

/* ---------- Confirmación por persona ---------- */
const DIETAS = ["Vegetariano", "Vegano", "Sin gluten", "Sin lactosa", "Alergia"];
const esAcompanante = (n) => /^Acompañante\b/i.test(n);
const juntar = (lista) => lista.length < 2 ? lista.join("") : `${lista.slice(0, -1).join(", ")} y ${lista[lista.length - 1]}`;

// Bloque de restricción alimenticia: opciones rápidas + detalle escrito
function dietBlock(id) {
  const box = document.createElement("div");
  box.className = "diet";
  box.innerHTML = `<span class="mini-label">Restricción alimenticia <small>(opcional)</small></span>
    <div class="diet-chips">${DIETAS.map((d) =>
      `<label class="diet-chip"><input type="checkbox" value="${d}"><span>${d}</span></label>`).join("")}</div>
    <input type="text" class="diet-detail" maxlength="120" aria-label="Detalle de la restricción"
      placeholder="Detalle (ej: alergia al maní)" id="${id}">`;
  return box;
}
function readDiet(box) {
  const chips = [...box.querySelectorAll(".diet-chips input:checked")].map((i) => i.value);
  const detalle = box.querySelector(".diet-detail").value.trim();
  const partes = chips.filter((c) => c !== "Alergia");
  if (chips.includes("Alergia")) partes.push("Alergia" + (detalle ? `: ${detalle}` : ""));
  else if (detalle) partes.push(detalle);
  return { chips, detalle, texto: partes.join(", "), alergiaSinDetalle: chips.includes("Alergia") && !detalle };
}
// Convierte el texto guardado en la hoja ("Vegetariano, Alergia: maní") en las opciones marcadas
function parseDiet(texto) {
  const chips = [];
  const resto = [];
  String(texto || "").split(/,\s*/).filter(Boolean).forEach((parte) => {
    const alergia = parte.match(/^Alergia(?::\s*(.*))?$/i);
    if (alergia) { chips.push("Alergia"); if (alergia[1]) resto.push(alergia[1]); }
    else if (DIETAS.includes(parte)) chips.push(parte);
    else resto.push(parte);
  });
  return { chips, detalle: resto.join(", ") };
}
function fillDiet(box, prev) {
  if (!prev) return;
  box.querySelectorAll(".diet-chips input").forEach((i) => { i.checked = (prev.chips || []).includes(i.value); });
  box.querySelector(".diet-detail").value = prev.detalle || "";
}

function setupRSVP() {
  const form = $("#rsvpForm");
  const done = $("#rsvpDone");
  const yesOnly = $("#yesOnly");
  const error = $("#rsvpError");
  const list = $("#peopleList");
  const summary = $("#rsvpSummary");
  const names = guest ? guest.nombres : [];
  const storeKey = "rsvp:" + (guest ? guest.codigo : "general");
  let soloDiet = null;

  if (guest) {
    // Con código: una tarjeta por persona con "Asistirá / No podrá" y su restricción
    $("#nameField").hidden = true;
    $("#globalField").hidden = true;
    $("#formFamily").textContent = guest.familia;
    $("#formFamily").hidden = false;
    $("#peopleField").hidden = false;
    $("#quickAll").hidden = names.length < 2;
    list.replaceChildren(...names.map((n, i) => {
      const card = document.createElement("div");
      card.className = "rsvp-person";
      card.dataset.nombre = n;
      card.innerHTML = `<div class="gc-head"><span class="gc-name"></span>
        <div class="gc-toggle" role="radiogroup">
          <label><input type="radio" name="p${i}" value="si"><span>Asistirá</span></label>
          <label><input type="radio" name="p${i}" value="no"><span>No podrá</span></label>
        </div></div><div class="gc-extra" hidden></div>`;
      card.querySelector(".gc-name").textContent = n;
      const extra = card.querySelector(".gc-extra");
      if (esAcompanante(n)) {
        const rename = document.createElement("input");
        rename.type = "text";
        rename.className = "gc-rename";
        rename.maxLength = 60;
        rename.placeholder = "Nombre de tu acompañante (opcional)";
        rename.setAttribute("aria-label", "Nombre del acompañante");
        extra.appendChild(rename);
      }
      extra.appendChild(dietBlock(`diet${i}`));
      return card;
    }));
  } else {
    // Sin código: nombre + sí/no + restricción
    $("#peopleField").hidden = true;
    soloDiet = dietBlock("dietSolo");
    $("#soloDiet").appendChild(soloDiet);
  }

  // Lo que se ha marcado hasta ahora
  const leer = () => {
    if (!guest) {
      const r = form.querySelector('input[name="asistencia"]:checked');
      const nombre = ($("#rsvpName").value || "").trim();
      const dieta = readDiet(soloDiet);
      return [{ nombre, visible: nombre || "Tú", asiste: r ? r.value === "Sí" : null, dieta: r && r.value === "Sí" ? dieta : null }];
    }
    return [...list.querySelectorAll(".rsvp-person")].map((card) => {
      const r = card.querySelector(".gc-toggle input:checked");
      const asiste = r ? r.value === "si" : null;
      const rename = card.querySelector(".gc-rename");
      const dado = rename ? rename.value.trim() : "";
      return {
        nombre: card.dataset.nombre, dado,
        visible: dado ? `${dado} (${card.dataset.nombre.toLowerCase()})` : card.dataset.nombre,
        asiste, dieta: asiste ? readDiet(card.querySelector(".diet")) : null,
      };
    });
  };

  const actualizar = () => {
    const ps = leer();
    list.querySelectorAll(".rsvp-person").forEach((card, i) => {
      card.classList.toggle("yes", ps[i].asiste === true);
      card.classList.toggle("no", ps[i].asiste === false);
      card.querySelector(".gc-extra").hidden = ps[i].asiste !== true;
    });
    if (!guest) $("#soloDiet").hidden = ps[0].asiste !== true;
    const van = ps.filter((p) => p.asiste === true);
    yesOnly.hidden = van.length === 0;
    // Resumen (solo cuando la invitación es de varias personas)
    if (!guest || names.length < 2 || ps.every((p) => p.asiste === null)) { summary.hidden = true; return; }
    const noVan = ps.filter((p) => p.asiste === false);
    const faltan = ps.filter((p) => p.asiste === null);
    const conDieta = (p) => p.visible + (p.dieta && p.dieta.texto ? ` <em>(${p.dieta.texto})</em>` : "");
    const esc = (t) => t.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    summary.innerHTML = [
      van.length ? `<p><b>Asistirán ${van.length} de ${ps.length}:</b> ${van.map((p) => conDieta({ ...p, visible: esc(p.visible), dieta: p.dieta && { texto: esc(p.dieta.texto) } })).join(", ")}</p>` : "",
      noVan.length ? `<p><b>No ${noVan.length === 1 ? "asistirá" : "asistirán"}:</b> ${noVan.map((p) => esc(p.visible)).join(", ")}</p>` : "",
      faltan.length ? `<p class="missing">Falta marcar a: ${faltan.map((p) => esc(p.visible)).join(", ")}</p>` : "",
    ].join("");
    summary.hidden = false;
  };

  form.addEventListener("change", () => { error.hidden = true; actualizar(); });
  form.addEventListener("input", (e) => { if (e.target.matches(".diet-detail, .gc-rename")) actualizar(); });
  $("#quickAll").addEventListener("click", (e) => {
    const b = e.target.closest("[data-all]");
    if (!b) return;
    list.querySelectorAll(`.gc-toggle input[value="${b.dataset.all}"]`).forEach((i) => { i.checked = true; });
    error.hidden = true;
    actualizar();
  });

  const showDone = (ps) => {
    const van = ps.filter((p) => p.asiste).map((p) => p.dado || p.nombre);
    const noVan = ps.filter((p) => !p.asiste).map((p) => p.dado || p.nombre);
    form.hidden = true;
    done.hidden = false;
    $("#rsvpDoneTitle").textContent = van.length ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!";
    $("#rsvpDoneText").textContent = !van.length
      ? "Te vamos a extrañar. Gracias por acompañarnos con tu cariño."
      : !guest ? "Te esperamos con mucha ilusión para celebrar juntos."
      : `Te esperamos con mucha ilusión a ${juntar(van)}.` + (noVan.length ? ` Extrañaremos a ${juntar(noVan)}.` : "");
  };

  const doneWhen = $("#rsvpDoneWhen");
  const cuando = (iso) => {
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const f = d.toLocaleDateString("es-CO", { day: "numeric", month: "long", timeZone: "America/Bogota" });
    return `Respuesta registrada el ${f}.`;
  };

  // Respuesta anterior: la de la hoja (la misma para toda la familia en cualquier celular);
  // si el script no la envía (versión vieja o sin conexión), la guardada en este celular
  try {
    let prev = null;
    if (guest && guest.respuesta !== undefined) {
      prev = guest.respuesta && {
        cancion: guest.respuesta.cancion,
        fecha: guest.respuesta.fecha,
        personas: guest.respuesta.personas.map((x) => ({ nombre: x.nombre, dado: x.dado, asiste: x.asiste, dieta: parseDiet(x.restriccion) })),
      };
    } else {
      prev = JSON.parse(localStorage.getItem(storeKey) || "null");
    }
    if (prev && prev.personas) {
      if (guest) {
        prev.personas.forEach((pp) => {
          const card = [...list.querySelectorAll(".rsvp-person")].find((c) => c.dataset.nombre === pp.nombre);
          if (!card || pp.asiste == null) return;
          card.querySelector(`.gc-toggle input[value="${pp.asiste ? "si" : "no"}"]`).checked = true;
          if (card.querySelector(".gc-rename")) card.querySelector(".gc-rename").value = pp.dado || "";
          fillDiet(card.querySelector(".diet"), pp.dieta);
        });
      } else {
        const pp = prev.personas[0];
        $("#rsvpName").value = pp.nombre || "";
        const r = form.querySelector(`input[name="asistencia"][value="${pp.asiste ? "Sí" : "No"}"]`);
        if (r) r.checked = true;
        fillDiet(soloDiet, pp.dieta);
      }
      $("#songInput").value = prev.cancion || "";
      actualizar();
      showDone(prev.personas);
      if (guest && names.length > 1) {
        doneWhen.textContent = [cuando(prev.fecha), "Cualquiera de la familia puede cambiarla desde su link."].filter(Boolean).join(" ");
        doneWhen.hidden = false;
      }
    } else if (prev) {
      // Respuesta de la versión anterior del formulario
      showDone([{ nombre: "", asiste: prev.asistencia === "Sí" }]);
    }
  } catch { /* sin almacenamiento */ }

  $("#rsvpAgain").addEventListener("click", () => {
    done.hidden = true;
    form.hidden = false;
  });

  const fail = (msg) => {
    error.textContent = msg;
    error.hidden = false;
    form.classList.remove("shake"); void form.offsetWidth; form.classList.add("shake");
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const ps = leer();
    const nombre = guest ? guest.familia : ps[0].nombre;
    const cancion = ($("#songInput").value || "").trim();
    const van = ps.filter((p) => p.asiste);

    if (!guest && !nombre) return fail("Por favor escribe tu nombre.");
    if (!guest && ps[0].asiste === null) return fail("Cuéntanos si podrás acompañarnos.");
    const faltan = ps.filter((p) => p.asiste === null);
    if (faltan.length) return fail(`Marca si ${juntar(faltan.map((p) => p.visible))} ${faltan.length === 1 ? "asistirá" : "asistirán"} o no.`);
    const alergia = van.find((p) => p.dieta && p.dieta.alergiaSinDetalle);
    if (alergia) return fail(`Cuéntanos a qué es alérgico(a) ${alergia.dado || alergia.nombre} (en "Detalle").`);
    if (van.length && cancion && !isYouTube(cancion)) return fail("Pega el link de una canción de YouTube (por ejemplo: https://youtu.be/…).");

    const nombreVisible = (p) => (p.dado ? `${p.dado} (${p.nombre})` : p.nombre);
    const restricciones = van.filter((p) => p.dieta.texto)
      .map((p) => (guest ? `${nombreVisible(p)}: ${p.dieta.texto}` : p.dieta.texto)).join(" · ");
    const detalle = ps.map((p) => ({ nombre: p.nombre, dado: p.dado || "", asiste: p.asiste, restriccion: p.asiste ? p.dieta.texto : "" }));
    const payload = new URLSearchParams({
      codigo: guest ? guest.codigo : "",
      nombre,
      pases: String(guest ? names.length : 1),
      asistencia: van.length ? "Sí" : "No",
      personas: String(van.length),
      asistentes: van.map(nombreVisible).join(", "),
      noAsisten: guest ? ps.filter((p) => !p.asiste).map(nombreVisible).join(", ") : "",
      restricciones,
      cancion: van.length ? cancion : "",
      detalle: JSON.stringify(detalle),
      // Resumen para versiones anteriores del script de Google
      mensaje: [
        van.length ? "Asisten: " + van.map(nombreVisible).join(", ") : "",
        restricciones ? "Restricciones: " + restricciones : "",
        cancion ? "Canción: " + cancion : "",
      ].filter(Boolean).join(" | "),
    });

    form.classList.add("sending");
    try {
      if (CONFIG.rsvpEndpoint) {
        // Apps Script no devuelve cabeceras CORS: enviamos sin leer la respuesta
        await fetch(CONFIG.rsvpEndpoint, { method: "POST", mode: "no-cors", body: payload });
      } else {
        console.warn("Modo de prueba: configura CONFIG.rsvpEndpoint para recibir las confirmaciones.", Object.fromEntries(payload));
        await new Promise((r) => setTimeout(r, 800));
      }
      const guardado = ps.map((p) => ({ nombre: p.nombre, dado: p.dado || "", asiste: p.asiste, dieta: p.dieta && { chips: p.dieta.chips, detalle: p.dieta.detalle } }));
      try { localStorage.setItem(storeKey, JSON.stringify({ personas: guardado, cancion })); } catch { /* ignorar */ }
      if (guest) {
        guest.respuesta = { fecha: new Date().toISOString(), cancion: van.length ? cancion : "", personas: detalle };
        try { localStorage.setItem("invitado:" + guest.codigo, JSON.stringify(guest)); } catch { /* ignorar */ }
      }
      doneWhen.hidden = true;
      showDone(ps);
      if (van.length) sparkleBurst($("#rsvpSubmit"));
    } catch {
      fail("No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      form.classList.remove("sending");
    }
  });
}

function sparkleBurst(origin) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = origin.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const icons = ["✦", "❤", "✧", "❀", "✦"];
  for (let i = 0; i < 26; i++) {
    const h = document.createElement("span");
    h.className = "heart-burst";
    h.textContent = icons[i % icons.length];
    h.style.left = x + "px";
    h.style.top = y + "px";
    if (i % 5 === 1) h.style.color = "#b24a6c";
    const a = Math.random() * Math.PI * 2;
    const d = 80 + Math.random() * 160;
    h.style.setProperty("--dx", Math.cos(a) * d + "px");
    h.style.setProperty("--dy", Math.sin(a) * d - 80 + "px");
    h.style.setProperty("--rot", (Math.random() * 90 - 45) + "deg");
    document.body.appendChild(h);
    h.addEventListener("animationend", () => h.remove());
  }
}

/* ---------- Aviso para Samsung Internet ---------- */
function setupChromeGate() {
  if (!document.documentElement.classList.contains("samsung")) return;
  // Enlace de Android que abre esta misma página en Chrome (si no está instalado, sigue aquí)
  const here = location.href;
  const intent = "intent://" + location.host + location.pathname + location.search +
    "#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=" +
    encodeURIComponent(here) + ";end";
  $("#openChrome").href = intent;
  $("#stayHere").addEventListener("click", () => {
    try { sessionStorage.setItem("seguirEnSamsung", "1"); } catch { /* ignorar */ }
    document.documentElement.classList.remove("samsung");
  });
}

/* ---------- Clima en vivo (Open-Meteo, sin clave) ---------- */
// Horas que se muestran: [hora del día, nombre, ¿de noche?, ¿es del día siguiente?]
const CLIMA_HORAS = [[16, "4 p.m.", false, 0], [18, "6 p.m.", false, 0], [21, "9 p.m.", true, 0], [0, "12 a.m.", true, 1]];
const ICONOS_CLIMA = {
  sol: '<circle cx="16" cy="16" r="5.5"/><path d="M16 3v4M16 25v4M3 16h4M25 16h4M6.8 6.8l2.8 2.8M22.4 22.4l2.8 2.8M6.8 25.2l2.8-2.8M22.4 9.6l2.8-2.8"/>',
  luna: '<path d="M19 5A11 11 0 1 0 27 19 8.5 8.5 0 0 1 19 5z"/>',
  nube: '<path d="M9 24h14a5 5 0 0 0 .6-10A7.5 7.5 0 0 0 9.3 15.4 4.3 4.3 0 0 0 9 24z"/>',
  lluvia: '<path d="M9 19h14a5 5 0 0 0 .6-10A7.5 7.5 0 0 0 9.3 10.4 4.3 4.3 0 0 0 9 19zM11 23l-1.5 4M16.5 23L15 27M22 23l-1.5 4"/>',
  tormenta: '<path d="M9 19h14a5 5 0 0 0 .6-10A7.5 7.5 0 0 0 9.3 10.4 4.3 4.3 0 0 0 9 19zM17 20l-3 5h4l-2.5 5"/>',
};

const fechaBogota = (ms) => new Date(ms - 5 * 3600e3).toISOString().slice(0, 10);
const masUnDia = (f) => fechaBogota(Date.parse(f + "T12:00:00-05:00") + 86400e3);
const hora = (f, h) => `${f}T${String(h).padStart(2, "0")}:00`;

function iconoClima({ codigo, lluvia, noche }) {
  if (codigo >= 95) return "tormenta";
  if ((codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 82) || lluvia >= 60) return "lluvia";
  if (codigo === 3 || codigo === 45 || codigo === 48 || lluvia >= 30) return "nube";
  return noche ? "luna" : "sol";
}

function pintarClima({ titulo, franjas, nota }) {
  $("#wKicker").textContent = titulo;
  $("#wSlots").innerHTML = franjas.map((f) => `
    <div class="w-slot">
      <span class="w-hour">${f.nombre}</span>
      <svg viewBox="0 0 32 32" aria-hidden="true">${ICONOS_CLIMA[iconoClima(f)]}</svg>
      <span class="w-temp">${Math.round(f.temp)}°</span>
      <span class="w-rain">☂ ${Math.round(f.lluvia)}%</span>
    </div>`).join("");
  const minima = Math.min(...franjas.map((f) => f.temp));
  const lluvia = Math.max(...franjas.map((f) => f.lluvia));
  const consejos = [];
  if (minima <= 13) consejos.push(`La noche será fría (${Math.round(minima)} °C): lleva un abrigo o chal elegante.`);
  if (lluvia >= 40) consejos.push("Podría llover: ten a mano un paraguas.");
  if (!consejos.length) consejos.push("¡Pinta para una noche perfecta!");
  $("#wTip").textContent = consejos.join(" ");
  $("#wNote").textContent = nota;
  $("#weatherCard").classList.add("ready");
}

// Pronóstico real (disponible unos 15 días antes)
async function pronostico(dia) {
  const { lat, lon } = CONFIG.clima;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    "&hourly=temperature_2m,precipitation_probability,weather_code&timezone=America%2FBogota&forecast_days=16";
  const h = (await (await fetch(url)).json()).hourly;
  const franjas = CLIMA_HORAS.map(([hh, nombre, noche, sig]) => {
    const i = h.time.indexOf(hora(sig ? masUnDia(dia) : dia, hh));
    return i < 0 ? null : { nombre, noche, temp: h.temperature_2m[i], lluvia: h.precipitation_probability[i] ?? 0, codigo: h.weather_code[i] };
  }).filter(Boolean);
  if (!franjas.length) throw new Error("sin datos");
  return franjas;
}

// Clima típico: lo que pasó alrededor del 19 de junio en los últimos 5 años
async function climaTipico() {
  const { lat, lon } = CONFIG.clima;
  const hoy = new Date().getFullYear();
  const anios = [1, 2, 3, 4, 5].map((n) => hoy - n);
  const datos = await Promise.all(anios.map(async (y) => {
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}` +
      `&start_date=${y}-06-12&end_date=${y}-06-27&hourly=temperature_2m,precipitation&timezone=America%2FBogota`;
    return (await (await fetch(url)).json()).hourly;
  }));
  return CLIMA_HORAS.map(([hh, nombre, noche, sig]) => {
    let temp = 0, n = 0, conLluvia = 0;
    datos.forEach((h, k) => {
      for (let d = 12; d <= 26; d++) {
        const f = `${anios[k]}-06-${d}`;
        const i = h.time.indexOf(hora(sig ? masUnDia(f) : f, hh));
        if (i < 0 || h.temperature_2m[i] == null) continue;
        temp += h.temperature_2m[i]; n++;
        // ¿Llovió en esa hora o la anterior?
        if ((h.precipitation[i] || 0) + (h.precipitation[i - 1] || 0) >= 0.2) conLluvia++;
      }
    });
    if (!n) throw new Error("sin datos");
    return { nombre, noche, temp: temp / n, lluvia: (conLluvia / n) * 100, codigo: 0 };
  });
}

async function setupWeather() {
  if (!$("#weatherCard")) return;
  const modo = params.get("clima"); // pruebas: ?clima=hoy o ?clima=tipico
  const diaBoda = CONFIG.fecha.slice(0, 10);
  const hoy = fechaBogota(Date.now());
  const dias = Math.round((Date.parse(diaBoda) - Date.parse(hoy)) / 86400e3);
  const desde = new Date(Date.parse(diaBoda) - 15 * 86400e3);
  const desdeTexto = `${desde.getUTCDate()} de ${MESES[desde.getUTCMonth()].toLowerCase()} de ${desde.getUTCFullYear()}`;
  const lugar = CONFIG.clima.lugar;

  if (modo === "hoy" || (modo !== "tipico" && dias >= 0 && dias <= 15)) {
    const dia = modo === "hoy" ? hoy : diaBoda;
    try {
      const franjas = await pronostico(dia);
      const ahora = new Date().toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" });
      return pintarClima({
        titulo: modo === "hoy" ? `Pronóstico de hoy en ${lugar}` : `Pronóstico para el día de la boda en ${lugar}`,
        franjas,
        nota: `Actualizado hoy a las ${ahora} · Fuente: Open-Meteo`,
      });
    } catch { /* si falla, se muestra el clima típico */ }
  }
  try {
    const franjas = await climaTipico();
    pintarClima({
      titulo: `Así suele estar el clima en ${lugar} a mediados de junio`,
      franjas,
      nota: `Promedio de los últimos 5 años (☂ = qué tan seguido llovió a esa hora). ` +
        `El pronóstico real para la boda aparecerá aquí desde el ${desdeTexto}.`,
    });
  } catch {
    $("#wKicker").textContent = `El clima en ${lugar} en junio`;
    $("#wTip").textContent = "Las tardes suelen ser frescas y las noches frías: te recomendamos llevar un abrigo o chal elegante.";
    $("#weatherCard").classList.add("ready");
  }
}

/* ---------- Inicio ---------- */
setupChromeGate();
fillDates();
fillGuest().then(setupRSVP);
setupIntro();
setupReveal();
setupCountdown();
setupCalendar();
setupWeather();
