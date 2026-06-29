/* ============================================================
   Language toggle (EN default).
   Any element with a data-es attribute will swap its text when ES
   is active, and restore its original English when EN is active.
   The chosen language is remembered across pages via localStorage.
   ============================================================ */
(function () {
  var KEY = "et-lang";
  var nodes = [];

  function collect() {
    nodes = Array.prototype.slice.call(document.querySelectorAll("[data-es]"));
    nodes.forEach(function (el) {
      if (el.getAttribute("data-en") === null) {
        el.setAttribute("data-en", el.textContent);
      }
    });
  }

  function apply(lang) {
    nodes.forEach(function (el) {
      el.textContent = el.getAttribute(lang === "es" ? "data-es" : "data-en");
    });
    document.documentElement.lang = lang === "es" ? "es" : "en";
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", function () {
    collect();
    var saved = "en";
    try { saved = localStorage.getItem(KEY) || "en"; } catch (e) {}
    apply(saved);

    document.querySelectorAll(".lang button").forEach(function (b) {
      b.addEventListener("click", function () {
        apply(b.getAttribute("data-lang"));
      });
    });
  });
})();

/* ============================================================
   Preserve the home scroll position across a project visit.
   On the home page we save the scroll offset when a project card
   is opened, and restore it when the home page loads again (e.g.
   after "← back to home"). Cleared after restoring so a manual
   reload still starts at the top.
   ============================================================ */
(function () {
  var KEY = "et-home-scroll";
  var isHome = !!document.querySelector(".cards");
  if (!isHome) return;

  if ("scrollRestoration" in history) {
    try { history.scrollRestoration = "manual"; } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var link = e.target.closest ? e.target.closest("a.card") : null;
    if (!link) return;
    try { sessionStorage.setItem(KEY, String(window.scrollY || window.pageYOffset || 0)); } catch (err) {}
  });

  document.addEventListener("DOMContentLoaded", function () {
    var y = null;
    try { y = sessionStorage.getItem(KEY); } catch (e) {}
    if (y === null) return;
    var top = parseInt(y, 10) || 0;
    requestAnimationFrame(function () {
      window.scrollTo(0, top);
      try { sessionStorage.removeItem(KEY); } catch (e) {}
    });
  });
})();
