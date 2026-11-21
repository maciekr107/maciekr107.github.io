// Motyw, wejście nagłówka, rysowanie strzałek i podświetlenie ról. Ładowany w <head> z /assets/site.js,
// żeby motyw był ustawiony przed pierwszym malowaniem (bez migotania). Bez tego skryptu treść jest widoczna w całości.
(function () {
  var root = document.documentElement;
  var KEY = 'theme';
  var dark = window.matchMedia('(prefers-color-scheme: dark)');

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) {
      return null;
    }
  }
  function save(v) {
    try {
      localStorage.setItem(KEY, v);
    } catch (e) { /* zapis zablokowany: motyw działa do końca wizyty */ }
  }
  function effective() {
    return root.dataset.theme || (dark.matches ? 'dark' : 'light');
  }

  var s = stored();
  if (s) root.dataset.theme = s;
  root.classList.add('js');

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-testid="theme-toggle"]');
    if (btn) {
      var sync = function () { btn.setAttribute('aria-pressed', String(effective() === 'dark')); };
      btn.hidden = false;
      sync();
      btn.addEventListener('click', function () {
        var next = effective() === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        save(next);
        sync();
      });
      var onSystem = function () { if (!stored()) sync(); };
      if (dark.addEventListener) dark.addEventListener('change', onSystem);
    }

    var hands = document.querySelectorAll('.hand');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      hands.forEach(function (h) { io.observe(h); });
    } else {
      hands.forEach(function (h) { h.classList.add('in'); });
    }

    var stairs = document.querySelector('.stairs');
    if (stairs) {
      document.querySelectorAll('.step').forEach(function (el, i) {
        ['mouseenter', 'focusin'].forEach(function (ev) { el.addEventListener(ev, function () { stairs.dataset.hl = i + 1; }); });
        ['mouseleave', 'focusout'].forEach(function (ev) { el.addEventListener(ev, function () { delete stairs.dataset.hl; }); });
      });
    }
  });
})();
