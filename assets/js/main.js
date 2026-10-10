/* ZOEYA Beauty Lounge — interactions */
(function () {
  'use strict';

  var WHATSAPP = '201150520558';
  var WHATSAPP_MAADI = '201155018818';

  /* Header background on scroll */
  var header = document.querySelector('.site-header');
  var toTop = document.getElementById('toTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-solid', y > 40);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Service tabs (WAI-ARIA tabs pattern) */
  var tabArr = Array.prototype.slice.call(document.querySelectorAll('.tabs [role="tab"]'));
  function activateTab(tab, focus) {
    tabArr.forEach(function (t) {
      var sel = t === tab;
      t.setAttribute('aria-selected', sel ? 'true' : 'false');
      t.tabIndex = sel ? 0 : -1;
      var p = document.getElementById('panel-' + t.dataset.tab);
      if (p) {
        p.classList.toggle('is-active', sel);
        if (sel) { p.removeAttribute('hidden'); } else { p.setAttribute('hidden', ''); }
      }
    });
    if (focus) tab.focus();
  }
  tabArr.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var idx = i;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') idx = (i + 1) % tabArr.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') idx = (i - 1 + tabArr.length) % tabArr.length;
      else if (e.key === 'Home') idx = 0;
      else if (e.key === 'End') idx = tabArr.length - 1;
      else return;
      e.preventDefault();
      activateTab(tabArr[idx], true);
    });
  });

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Booking form -> WhatsApp */
  var form = document.getElementById('bookForm');
  if (form) {
    var isAr = (document.documentElement.lang || 'ar').slice(0, 2) === 'ar';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var get = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = get('bName');
      if (!name) {
        var n = document.getElementById('bName');
        if (n) { n.focus(); n.style.borderColor = '#c4637f'; }
        return;
      }
      var branch = get('bBranch');
      var service = get('bService');
      var date = get('bDate');
      var time = get('bTime');
      var notes = get('bNotes');

      var lines = isAr
        ? ['مرحباً ZOEYA، أرغب في حجز موعد 💅',
           'الاسم: ' + name,
           'الفرع: ' + branch,
           'الخدمة: ' + service,
           'التاريخ: ' + date,
           'الوقت: ' + time]
        : ['Hello ZOEYA, I would like to book an appointment 💅',
           'Name: ' + name,
           'Branch: ' + branch,
           'Service: ' + service,
           'Date: ' + date,
           'Time: ' + time];
      if (notes) lines.push((isAr ? 'ملاحظات: ' : 'Notes: ') + notes);

      var isMaadi = /المعادي|maadi/i.test(branch);
      var number = isMaadi ? WHATSAPP_MAADI : WHATSAPP;
      var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  /* Year */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
