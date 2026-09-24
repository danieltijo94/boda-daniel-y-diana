/* =========================================================
   Páginas de los novios (enlaces.html y mesas.html)
   Leen la lista de invitados de Google Sheets y guardan el plano de mesas.
   ========================================================= */

// La misma URL que CONFIG.rsvpEndpoint en script.js
const ENDPOINT = "https://script.google.com/macros/s/AKfycbzUn2L-ukmTA2qxZPqtL_NP07KkcwTBhho45IDfBYrYjcCo_oL6x7sbNQ4qjci7HAtZnQ/exec";

const Panel = (() => {
  const CLAVE_KEY = "claveNovios";
  const leer = () => { try { return localStorage.getItem(CLAVE_KEY) || ""; } catch { return ""; } };
  const guardar = (c) => { try { c ? localStorage.setItem(CLAVE_KEY, c) : localStorage.removeItem(CLAVE_KEY); } catch { /* ignorar */ } };

  const css = document.createElement("style");
  css.textContent = `
    .pn-veil { position: fixed; inset: 0; z-index: 50; display: grid; place-items: center; padding: 16px;
      background: rgba(74, 51, 56, .45); backdrop-filter: blur(3px); }
    .pn-box { width: 100%; max-width: 360px; background: #fdf9f4; border-radius: 16px; padding: 26px 22px; text-align: center;
      border: 1px solid rgba(184,145,79,.6); box-shadow: 0 30px 60px -30px rgba(0,0,0,.5); font-family: "Cormorant Garamond", Georgia, serif; color: #4a3338; }
    .pn-box h2 { font-family: "Pinyon Script", cursive; font-weight: normal; font-size: 40px; color: #7a2e45; }
    .pn-box p { font-size: 17px; margin: 4px 0 14px; }
    .pn-box input { width: 100%; font: inherit; font-size: 18px; padding: 10px 14px; border-radius: 999px; border: 1px solid rgba(184,145,79,.6); background: #fff; color: #4a3338; }
    .pn-box button { margin-top: 12px; width: 100%; padding: 11px; border: 0; border-radius: 999px; background: #7a2e45; color: #fff;
      font-family: Cinzel, serif; font-size: 13px; letter-spacing: .2em; text-transform: uppercase; cursor: pointer; }
    .pn-err { color: #a3272f; font-size: 16px; min-height: 20px; margin-top: 8px; }`;
  document.head.appendChild(css);

  function pedirClave(error) {
    return new Promise((resolve) => {
      const veil = document.createElement("div");
      veil.className = "pn-veil";
      veil.innerHTML = `<form class="pn-box"><h2>Solo novios</h2>
        <p>Escribe la clave de los novios (la que pusiste en <b>CLAVE_NOVIOS</b> del script de Google).</p>
        <input type="password" autocomplete="current-password" placeholder="Clave" required>
        <button type="submit">Entrar</button><p class="pn-err"></p></form>`;
      veil.querySelector(".pn-err").textContent = error || "";
      veil.querySelector("form").addEventListener("submit", (e) => {
        e.preventDefault();
        const v = veil.querySelector("input").value.trim();
        if (!v) return;
        veil.remove();
        resolve(v);
      });
      document.body.appendChild(veil);
      veil.querySelector("input").focus();
    });
  }

  // Lista completa de invitados, mesas y confirmaciones
  async function cargarLista() {
    let clave = leer();
    let error = "";
    for (;;) {
      if (!clave) clave = await pedirClave(error);
      let r;
      try {
        r = await (await fetch(`${ENDPOINT}?accion=lista&clave=${encodeURIComponent(clave)}`)).json();
      } catch {
        throw new Error("No se pudo leer la lista de Google Sheets. Revisa tu conexión y que el script de Google esté actualizado (nueva versión publicada).");
      }
      if (r.ok) { guardar(clave); return r; }
      if (r.error !== "clave") throw new Error("El script de Google respondió: " + (r.error || "error"));
      guardar("");
      clave = "";
      error = "Clave incorrecta. Revisa CLAVE_NOVIOS en el script de Google.";
    }
  }

  // Guarda el plano de mesas en Google Sheets
  async function guardarMesas(datos) {
    const r = await (await fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify({ accion: "guardarMesas", clave: leer(), ...datos }),
    })).json();
    if (!r.ok) throw new Error(r.error === "clave" ? "La clave ya no es válida: recarga la página." : r.error || "error");
    return r;
  }

  return { cargarLista, guardarMesas };
})();
