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
    // Translate individual text leaves so styled wrappers remain intact.
    nodes = Array.prototype.slice.call(document.querySelectorAll("[data-es]")).filter(function (el) { return el.children.length === 0; });
    document.querySelectorAll("[data-es-aria-label]").forEach(function (el) {
      el.setAttribute("data-en-aria-label", el.getAttribute("aria-label"));
    });
    nodes.forEach(function (el) {
      if (el.getAttribute("data-en") === null) {
        el.setAttribute("data-en", el.textContent);
      }
    });
  }

  function apply(lang) {
    lang = lang === "es" ? "es" : "en";
    document.querySelectorAll("[data-es-aria-label]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-aria-label"));
    });
    nodes.forEach(function (el) {
      el.textContent = el.getAttribute(lang === "es" ? "data-es" : "data-en");
    });
    document.querySelectorAll("[data-cv-en][data-cv-es]").forEach(function (link) {
      var path = link.getAttribute("data-cv-" + lang);
      link.setAttribute("href", path);
      link.setAttribute("download", path.split("/").pop());
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
    // Explicit section links take priority over the saved project position.
    if (window.location.hash) {
      try { sessionStorage.removeItem(KEY); } catch (e) {}
      return;
    }
    if (y === null) return;
    var top = parseInt(y, 10) || 0;
    requestAnimationFrame(function () {
      window.scrollTo(0, top);
      try { sessionStorage.removeItem(KEY); } catch (e) {}
    });
  });
})();

/* Measure the header and skills band so the opening composition fits. */
(function () {
  if (!document.documentElement.classList.contains("home-page")) return;
  var header = document.querySelector(".topbar");
  var skills = document.querySelector(".skills-marquee");
  function updateHeaderHeight() {
    document.documentElement.style.setProperty("--header-height", header.getBoundingClientRect().height + "px");
    document.documentElement.style.setProperty("--skills-height", skills.getBoundingClientRect().height + "px");
  }
  updateHeaderHeight();
  if ("ResizeObserver" in window) {
    var observer = new ResizeObserver(updateHeaderHeight);
    observer.observe(header);
    observer.observe(skills);
  } else {
    window.addEventListener("resize", updateHeaderHeight);
  }
})();

/* Highlight the current section without changing the URL while scrolling. */
(function () {
  var header = document.querySelector('.topbar');
  var links = Array.from(document.querySelectorAll('.topbar .nav > a'));
  var isHome = document.body.classList.contains('home');
  var pending = false;
  function mark(id) {
    links.forEach(function (link) {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if (!isHome) { mark('work'); return; }
  var sections = ['intro', 'work', 'approach', 'contact'].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);
  function update() {
    pending = false;
    var line = Math.max(0, header.getBoundingClientRect().bottom) + 48;
    var active = 'intro';
    var shared = document.querySelector('.about-work').getBoundingClientRect();
    sections.forEach(function (section) {
      if (section.id === 'work') return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= line && rect.bottom > line) active = section.id;
    });
    if (shared.top <= line && shared.bottom > line) active = 'work';
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) active = 'contact';
    mark(active);
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  window.addEventListener('hashchange', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  schedule();
})();
