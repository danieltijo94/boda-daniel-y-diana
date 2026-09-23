/* =========================================================
   CONFIGURACIÓN — cambia aquí los datos principales
   ========================================================= */
const CONFIG = {
  // Fecha y hora de la boda (hora de Colombia, UTC-5)
  fecha: "2027-06-19T16:00:00-05:00",
  // Fecha límite para confirmar
  fechaLimiteConfirmacion: "30 de abril de 2027",
  // URL de tu Google Apps Script (ver CONFIGURAR-CORREO.md). Vacío = modo de prueba.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbzUn2L-ukmTA2qxZPqtL_NP07KkcwTBhho45IDfBYrYjcCo_oL6x7sbNQ4qjci7HAtZnQ/exec",
  // Lugar para el evento de calendario
  lugarCalendario: "Hacienda Chic, Bogotá",
  // Duración aproximada del evento (horas) para el calendario
  duracionHoras: 8,
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

/* ---------- Invitado personalizado (?i=CODIGO → invitados.csv) ---------- */
function parseCSV(text) {
  const rows = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  const split = (line) => {
    const out = []; let cur = ""; let q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if ((ch === "," || ch === ";") && !q) { out.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    out.push(cur.trim());
    return out;
  };
  const head = split(rows.shift()).map((h) => h.toLowerCase());
  return rows.map((r) => {
    const cols = split(r);
    return Object.fromEntries(head.map((h, i) => [h, cols[i] || ""]));
  });
}

// Nombres de cada invitado de la tarjeta (columna "invitados", separados por |)
function guestNames(g) {
  const names = (g.invitados || "").split("|").map((n) => n.trim()).filter(Boolean);
  if (names.length) return names;
  const n = Math.max(1, parseInt(g.pases, 10) || 1);
  return Array.from({ length: n }, (_, i) => `Invitado ${i + 1}`);
}

let guest = null;

async function fillGuest() {
  const code = (params.get("i") || "").trim().toUpperCase();
  if (!code) return;

  try {
    const res = await fetch("invitados.csv", { cache: "no-store" });
    guest = parseCSV(await res.text()).find((g) => g.codigo.toUpperCase() === code) || null;
  } catch { return; }
  if (!guest) return;

  guest.nombres = guestNames(guest);
  const pases = guest.nombres.length;
  $("#guestName").textContent = guest.familia;
  const intro = $("#introGuest");
  intro.textContent = guest.familia;
  intro.hidden = false;
  $("#passesNum").textContent = pases;
  $("#passesText").textContent = pases === 1 ? "pase reservado" : "pases reservados";
  $("#passesBox").hidden = false;
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

function setupRSVP() {
  const form = $("#rsvpForm");
  const done = $("#rsvpDone");
  const yesOnly = $("#yesOnly");
  const error = $("#rsvpError");
  const list = $("#peopleList");
  const names = guest ? guest.nombres : [];
  const storeKey = "rsvp:" + (guest ? guest.codigo : "general");

  if (guest) {
    // Con código: el nombre ya lo sabemos; se eligen los asistentes de la tarjeta
    $("#nameField").hidden = true;
    $("#formFamily").textContent = guest.familia;
    $("#formFamily").hidden = false;
    names.forEach((n) => {
      const label = document.createElement("label");
      label.className = "person";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "asistentes";
      input.value = n;
      const box = document.createElement("span");
      box.className = "person-box";
      box.textContent = n;
      label.append(input, box);
      list.appendChild(label);
    });
    if (names.length === 1) list.querySelector("input").checked = true;
    $("#peopleHint").textContent = names.length === 1
      ? "Tu invitación es para 1 persona."
      : `Tu invitación es válida para ${names.length} personas. Marca quiénes asistirán.`;
  } else {
    // Sin código: solo pedimos el nombre de quien confirma
    $("#peopleField").hidden = true;
  }

  form.addEventListener("change", (e) => {
    if (e.target.name === "asistencia") yesOnly.hidden = e.target.value !== "Sí";
    error.hidden = true;
  });

  const showDone = (asiste) => {
    form.hidden = true;
    done.hidden = false;
    $("#rsvpDoneTitle").textContent = asiste ? "¡Gracias por confirmar!" : "¡Gracias por avisarnos!";
    $("#rsvpDoneText").textContent = asiste
      ? "Te esperamos con mucha ilusión para celebrar juntos."
      : "Te vamos a extrañar. Gracias por acompañarnos con tu cariño.";
  };

  try {
    const prev = JSON.parse(localStorage.getItem(storeKey) || "null");
    if (prev) showDone(prev.asistencia === "Sí");
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
    const data = new FormData(form);
    const asistencia = data.get("asistencia");
    const nombre = guest ? guest.familia : (data.get("nombre") || "").trim();
    const asiste = asistencia === "Sí";
    const asistentes = asiste ? (guest ? data.getAll("asistentes") : [nombre]) : [];
    const restricciones = asiste ? (data.get("restricciones") || "").trim() : "";
    const cancion = asiste ? (data.get("cancion") || "").trim() : "";

    if (!guest && !nombre) return fail("Por favor escribe tu nombre.");
    if (!asistencia) return fail("Cuéntanos si podrás acompañarnos.");
    if (asiste && guest && asistentes.length === 0) return fail("Marca quiénes asistirán.");
    if (cancion && !isYouTube(cancion)) return fail("Pega el link de una canción de YouTube (por ejemplo: https://youtu.be/…).");

    const pases = guest ? names.length : 1;
    const payload = new URLSearchParams({
      codigo: guest ? guest.codigo : "",
      nombre,
      pases: String(pases),
      asistencia,
      personas: String(asistentes.length),
      asistentes: asistentes.join(", "),
      restricciones,
      cancion,
      // Resumen para versiones anteriores del script de Google
      mensaje: [
        asistentes.length ? "Asisten: " + asistentes.join(", ") : "",
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
      try { localStorage.setItem(storeKey, JSON.stringify({ asistencia, asistentes })); } catch { /* ignorar */ }
      showDone(asiste);
      if (asiste) sparkleBurst($("#rsvpSubmit"));
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

/* ---------- Inicio ---------- */
setupChromeGate();
fillDates();
fillGuest().then(setupRSVP);
setupIntro();
setupReveal();
setupCountdown();
setupCalendar();
