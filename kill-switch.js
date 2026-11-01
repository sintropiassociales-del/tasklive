/**
 * ============================================================
 *  KILL-SWITCH — Cortafuegos de aplicación (lado del sitio)
 *  Sintropía Social
 * ------------------------------------------------------------
 *  Pega este archivo en cada sitio de GitHub Pages y enlázalo
 *  en el <head> de tu index.html:
 *
 *      <script src="kill-switch.js" defer></script>
 *
 *  Al cargar, el sitio pregunta al Panel de Control si debe
 *  estar encendido. Si está OFF, muestra una pantalla de
 *  mantenimiento y bloquea la interacción.
 *
 *  Si el Panel no responde, el sitio se queda ENCENDIDO
 *  (fail-open) para que un glitch no tumbe todo. Si prefieres
 *  lo contrario, cambia FAIL_OPEN a false abajo.
 * ============================================================
 */
(function () {
  // ====== CONFIGURA ESTAS 2 LÍNEAS POR SITIO ======
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbyt8u9X0th8ExO-O-1STwgKzhf7KdvStRlsG4yKPJn-65W09vc9RD5WuwLL0fAHZ33y/exec"; // termina en /exec
  var SITE_ID  = "Task-live"; // debe coincidir con la columna "Nombre" de la Sheet
  // =================================================

  var FAIL_OPEN = true; // true = si no hay respuesta, el sitio sigue ON

  try {
    fetch(ENDPOINT + "?site=" + encodeURIComponent(SITE_ID), { method: "GET" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && String(d.estado).toUpperCase() === "OFF") {
          mostrarMantenimiento(d.mensaje);
        }
      })
      .catch(function () {
        if (!FAIL_OPEN) mostrarMantenimiento();
      });
  } catch (e) {
    if (!FAIL_OPEN) mostrarMantenimiento();
  }

  function mostrarMantenimiento(mensaje) {
    var texto = mensaje || "Estamos en mantenimiento. Volvemos muy pronto.";
    var overlay = document.createElement("div");
    overlay.setAttribute("role", "alert");
    overlay.style.cssText = [
      "position:fixed", "inset:0", "z-index:2147483647",
      "display:flex", "flex-direction:column",
      "align-items:center", "justify-content:center",
      "background:#0f2235", "color:#ffffff",
      "font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif",
      "text-align:center", "padding:24px", "box-sizing:border-box"
    ].join(";");

    overlay.innerHTML =
      '<div style="max-width:480px">' +
        '<div style="font-size:48px;margin-bottom:16px">🔧</div>' +
        '<h1 style="font-size:24px;margin:0 0 12px;font-weight:700">En mantenimiento</h1>' +
        '<p style="font-size:16px;line-height:1.5;opacity:.85;margin:0">' + escapar(texto) + '</p>' +
      '</div>';

    // Bloquea scroll e interacción del resto de la página
    document.documentElement.style.overflow = "hidden";
    if (document.body) document.body.appendChild(overlay);
    else document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(overlay); });
  }

  function escapar(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
