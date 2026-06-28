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
