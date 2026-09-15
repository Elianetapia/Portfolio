/* Horizontal section panels on the homepage at mobile widths. */
(function () {
  if (!document.body.classList.contains('home') || window.innerWidth > 760) return;
  document.addEventListener('DOMContentLoaded', function () {
    var main = document.querySelector('main');
    var header = document.querySelector('.topbar');
    var heroCopy = document.querySelector('.hero-copy');
    heroCopy.insertBefore(document.querySelector('.hero-profile'), heroCopy.querySelector('.hero-links'));
    var deck = document.createElement('div');
    deck.className = 'mobile-deck';
    deck.setAttribute('aria-label', 'Sections');
    var ids = ['intro', 'about', 'work', 'approach', 'contact'];
    var panels = ids.map(function (id) {
      var panel = document.createElement('div');
      panel.className = 'mobile-panel';
      panel.setAttribute('data-panel', id);
      deck.appendChild(panel);
      return panel;
    });

    panels[0].appendChild(document.querySelector('.hero'));
    panels[0].appendChild(document.querySelector('.skills-marquee'));
    var aboutWork = document.querySelector('.about-work');
    panels[1].appendChild(aboutWork.querySelector('.about'));
    panels[2].appendChild(aboutWork.querySelector('.work'));
    aboutWork.remove();
    panels[3].appendChild(document.querySelector('.approach'));
    panels[4].appendChild(document.querySelector('.contact-footer'));
    main.appendChild(deck);

    var tabs = Array.prototype.slice.call(header.querySelectorAll('.nav > a'));
    var current = 0;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function headerHeight() {
      document.documentElement.style.setProperty('--mobile-header-height', header.getBoundingClientRect().height + 'px');
    }
    headerHeight();
    if ('ResizeObserver' in window) new ResizeObserver(headerHeight).observe(header);

    function mark(index) {
      current = index;
      tabs.forEach(function (tab, i) {
        if (i === index) tab.setAttribute('aria-current', 'location');
        else tab.removeAttribute('aria-current');
      });
      tabs[index].scrollIntoView({ block: 'nearest', inline: 'center' });
    }
    function go(index, smooth) {
      mark(index);
      deck.scrollTo({ left: index * deck.clientWidth, behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant' });
      panels[index].scrollTop = 0;
      history.replaceState(null, '', '#' + ids[index]);
    }
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href^="#"]');
      if (!link) return;
      var index = ids.indexOf(link.hash.slice(1));
      if (index < 0) return;
      event.preventDefault();
      go(index, true);
    });
    var pending = false;
    deck.addEventListener('scroll', function () {
      if (pending) return;
      pending = true;
      requestAnimationFrame(function () {
        pending = false;
        var index = Math.max(0, Math.min(ids.length - 1, Math.round(deck.scrollLeft / deck.clientWidth)));
        if (index !== current) mark(index);
      });
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) { location.reload(); return; }
      headerHeight();
      deck.scrollTo({ left: current * deck.clientWidth, behavior: 'instant' });
    });
    var initial = ids.indexOf(location.hash.slice(1));
    go(initial < 0 ? 0 : initial, false);
  });
})();
