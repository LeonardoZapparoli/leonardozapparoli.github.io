// Hover previews for cross-references. Self-contained: to remove the
// feature, delete the public/xref-preview/ folder and the two marked
// lines in src/pages/notes/[slug].astro.
(function () {
  // hover-capable devices only; on touch screens links behave as before
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var OPEN_DELAY = 220;
  var CLOSE_DELAY = 180;
  var GAP = 8;
  var MARGIN = 12;

  var links = document.querySelectorAll('.entry-body a.xref');
  if (links.length === 0) return;

  var card = document.createElement('div');
  card.className = 'xref-card';
  card.setAttribute('role', 'tooltip');
  document.body.appendChild(card);

  var openTimer = null;
  var closeTimer = null;
  var current = null;
  var pages = {};

  function stripIds(root) {
    root.removeAttribute('id');
    var withId = root.querySelectorAll('[id]');
    for (var i = 0; i < withId.length; i++) withId[i].removeAttribute('id');
  }

  function line(className, text) {
    var p = document.createElement('p');
    p.className = className;
    p.textContent = text;
    return p;
  }

  // builds the card content for a target inside `doc`; null if nothing to show
  function build(doc, hash, external) {
    var frag = document.createDocumentFragment();
    var h1 = doc.querySelector('.entry-header h1');
    if (external && h1) frag.appendChild(line('xref-card-source', h1.textContent));

    if (!hash) {
      var desc = doc.querySelector('.entry-abstract');
      if (!h1) return null;
      frag.textContent = '';
      frag.appendChild(line('xref-card-title', h1.textContent));
      if (desc) frag.appendChild(line('xref-card-desc', desc.textContent));
      return frag;
    }

    var target = doc.getElementById(hash);
    if (!target) return null;
    if (!target.matches('.env, .equation')) return null;
    var clone = target.cloneNode(true);
    stripIds(clone);
    frag.appendChild(clone);
    return frag;
  }

  function fetchPage(path) {
    if (!pages[path]) {
      pages[path] = fetch(path)
        .then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          return r.text();
        })
        .then(function (html) {
          return new DOMParser().parseFromString(html, 'text/html');
        })
        .catch(function () {
          delete pages[path];
          return null;
        });
    }
    return pages[path];
  }

  function contentFor(link) {
    var url = new URL(link.href, location.href);
    var hash = decodeURIComponent(url.hash.slice(1));
    if (url.origin !== location.origin) return Promise.resolve(null);
    if (url.pathname === location.pathname) {
      return Promise.resolve(hash ? build(document, hash, false) : null);
    }
    return fetchPage(url.pathname).then(function (doc) {
      return doc ? build(doc, hash, true) : null;
    });
  }

  function place(link, mouseY) {
    // a wrapped link has one rect per line; anchor to the hovered line
    var rects = link.getClientRects();
    var rect = rects[0];
    for (var i = 0; i < rects.length; i++) {
      if (mouseY >= rects[i].top - 1 && mouseY <= rects[i].bottom + 1) rect = rects[i];
    }
    if (!rect) return;

    var vw = document.documentElement.clientWidth;
    var vh = window.innerHeight;
    var w = card.offsetWidth;
    var h = card.offsetHeight;

    var left = Math.min(Math.max(rect.left, MARGIN), vw - w - MARGIN);
    var below = vh - rect.bottom - GAP - MARGIN;
    var above = rect.top - GAP - MARGIN;
    var top;
    if (h <= below || below >= above) {
      top = rect.bottom + GAP;
      if (h > below) card.style.maxHeight = Math.max(below, 120) + 'px';
    } else {
      if (h > above) {
        card.style.maxHeight = Math.max(above, 120) + 'px';
        h = card.offsetHeight;
      }
      top = rect.top - GAP - h;
    }
    card.style.left = left + window.scrollX + 'px';
    card.style.top = top + window.scrollY + 'px';
  }

  function show(link, mouseY) {
    contentFor(link).then(function (content) {
      if (current !== link || !content) return;
      card.classList.remove('open');
      card.style.maxHeight = '';
      card.textContent = '';
      card.appendChild(content);
      // a lone equation gets a card sized to the equation
      card.classList.toggle('xref-card-eq', !!card.querySelector(':scope > .equation'));
      card.scrollTop = 0;
      place(link, mouseY);
      card.classList.add('open');
    });
  }

  function hide() {
    current = null;
    card.classList.remove('open');
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  function scheduleClose() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(hide, CLOSE_DELAY);
  }

  for (var i = 0; i < links.length; i++) {
    (function (link) {
      link.addEventListener('mouseenter', function (e) {
        cancelClose();
        clearTimeout(openTimer);
        if (current === link) return;
        var y = e.clientY;
        openTimer = setTimeout(function () {
          current = link;
          show(link, y);
        }, OPEN_DELAY);
      });
      link.addEventListener('mouseleave', scheduleClose);
      link.addEventListener('click', function () {
        clearTimeout(openTimer);
        hide();
      });
    })(links[i]);
  }

  card.addEventListener('mouseenter', cancelClose);
  card.addEventListener('mouseleave', scheduleClose);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('resize', hide);
})();
