/* =========================================================
   CONFIGURACIÓN — cambia aquí los datos principales
   ========================================================= */
const CONFIG = {
  // Fecha y hora de la ceremonia (formato: AAAA-MM-DDTHH:MM:SS, hora local)
  fecha: "2026-12-12T16:00:00",
  // Fecha límite para confirmar
  fechaLimiteConfirmacion: "15 de noviembre de 2026",
  // Enlace de tu Google Form
  googleForm: "https://forms.gle/TU-FORMULARIO",
  // Lugar para el evento de calendario
  lugarCalendario: "Parroquia Nuestra Señora, Ciudad",
  // Duración aproximada del evento (horas) para el calendario
  duracionHoras: 8,
};

/* ========================================================= */

const $ = (s) => document.querySelector(s);
const params = new URLSearchParams(location.search);
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const weddingDate = new Date(CONFIG.fecha);

/* ---------- Fechas en la página ---------- */
function fillDates() {
  const d = weddingDate;
  const pad = (n) => String(n).padStart(2, "0");
  const values = {
    weekday: DIAS[d.getDay()],
    day: d.getDate(),
    monthYear: `${MESES[d.getMonth()]} ${d.getFullYear()}`,
    shortDate: `${pad(d.getDate())} · ${pad(d.getMonth() + 1)} · ${d.getFullYear()}`,
    rsvpDeadline: CONFIG.fechaLimiteConfirmacion,
  };
  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const v = values[el.dataset.cfg];
    if (v !== undefined) el.textContent = v;
  });
}

/* ---------- Invitado personalizado (?familia=...&pases=...) ---------- */
function fillGuest() {
  const familia = (params.get("familia") || "").trim().slice(0, 80);
  const pases = parseInt(params.get("pases"), 10);

  if (familia) {
    $("#guestName").textContent = familia;
    const intro = $("#introGuest");
    intro.textContent = familia;
    intro.hidden = false;
  }
  if (pases > 0 && pases < 100) {
    $("#passesNum").textContent = pases;
    $("#passesText").textContent = pases === 1 ? "pase reservado" : "pases reservados";
    $("#passesBox").hidden = false;
  }

  // Google Form: si tu formulario tiene campos pre-rellenables, puedes añadirlos aquí
  $("#rsvpBtn").href = CONFIG.googleForm;
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

/* ---------- Pétalos ---------- */
function makePetal(container, { fromTop = true } = {}) {
  const p = document.createElement("span");
  p.className = "petal" + (Math.random() < 0.25 ? " leafy" : "");
  const size = 10 + Math.random() * 12;
  p.style.left = Math.random() * 100 + "vw";
  p.style.width = size + "px";
  p.style.height = size * 1.25 + "px";
  p.style.setProperty("--sway", (20 + Math.random() * 60) + "px");
  p.style.animationDuration = (7 + Math.random() * 7) + "s";
  p.style.opacity = 0.5 + Math.random() * 0.4;
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
    if (document.hidden || container.childElementCount > 25) return;
    makePetal(container);
  }, 900);
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
  url.searchParams.set("text", "Boda de Daniel & Diana 💍");
  url.searchParams.set("dates", `${fmt(weddingDate)}/${fmt(end)}`);
  url.searchParams.set("location", CONFIG.lugarCalendario);
  url.searchParams.set("details", "¡Te esperamos para celebrar nuestro amor!");
  $("#calendarBtn").href = url.toString();
}

/* ---------- Regalos ---------- */
function setupGifts() {
  const toggle = $("#bankToggle");
  const bank = $("#bank");
  toggle.addEventListener("click", () => {
    bank.hidden = !bank.hidden;
    toggle.setAttribute("aria-expanded", String(!bank.hidden));
    toggle.textContent = bank.hidden ? "Ver datos bancarios" : "Ocultar datos bancarios";
  });
  $("#copyBtn").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($("#accNum").textContent.trim());
      toast("¡Número copiado!");
    } catch {
      toast("No se pudo copiar");
    }
  });
}

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove("show"), 2000);
}

/* ---------- Inicio ---------- */
fillDates();
fillGuest();
setupIntro();
setupReveal();
setupCountdown();
setupCalendar();
setupGifts();
