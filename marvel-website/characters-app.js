// ===== MARVEL MULTIVERSE - CHARACTER ARCHIVE APP =====

(function () {
  var D = window.MARVEL_DATA;
  if (!D) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;
  var isTablet = window.innerWidth < 1024;
  var touchFlip = (window.ontouchstart !== undefined) && !(window.matchMedia && window.matchMedia('(hover: hover)').matches);
  var identityFlips = [];

  var TEAM_META = {
    avengers: { label: 'Avengers', cls: 'avengers', icon: 'fa-shield-halved' },
    guardians: { label: 'Guardians', cls: 'guardians', icon: 'fa-rocket' },
    xmen: { label: 'X-Men', cls: 'xmen', icon: 'fa-users' },
    defenders: { label: 'Defenders', cls: 'defenders', icon: 'fa-fist-raised' },
    stark: { label: 'Stark Ind.', cls: 'stark', icon: 'fa-gear' },
    shield: { label: 'S.H.I.E.L.D.', cls: 'shield', icon: 'fa-eye' },
    magic: { label: 'Magic', cls: 'magic', icon: 'fa-hat-wizard' },
    street: { label: 'Street Level', cls: 'street', icon: 'fa-city' }
  };

  var STAT_LABELS = { strength: 'STR', speed: 'SPD', intelligence: 'INT', durability: 'DUR', power: 'PWR', combat: 'CMB' };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function teamTags(teams) {
    return teams.map(function (t) {
      var m = TEAM_META[t];
      if (!m) return '';
      return '<span class="team-tag ' + m.cls + '">' + m.label + '</span>';
    }).join('');
  }

  function statBars(stats) {
    var order = ['strength', 'speed', 'intelligence', 'durability', 'power', 'combat'];
    return order.map(function (k) {
      return '<div class="stat-bar-row"><span class="stat-bar-label">' + k + '</span><div class="stat-bar-track"><div class="stat-bar-fill ' + k + '" data-width="' + stats[k] + '"></div></div></div>';
    }).join('');
  }

  function radarSVG(stats) {
    var cx = 100, cy = 100, R = 78;
    var keys = ['strength', 'speed', 'intelligence', 'durability', 'power', 'combat'];
    function pt(i, r) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / keys.length);
      return (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1);
    }
    var grid = '';
    [0.33, 0.66, 1].forEach(function (f) {
      grid += '<polygon points="' + keys.map(function (_, i) { return pt(i, R * f); }).join(' ') + '" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/>';
    });
    var data = keys.map(function (k, i) { return pt(i, R * (stats[k] / 10)); }).join(' ');
    var labels = keys.map(function (k, i) {
      var a = -Math.PI / 2 + i * (Math.PI * 2 / keys.length);
      var x = cx + Math.cos(a) * 92, y = cy + Math.sin(a) * 92;
      var anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : (Math.cos(a) > 0 ? 'start' : 'end');
      return '<text x="' + x + '" y="' + (y + 2) + '" text-anchor="' + anchor + '" fill="rgba(255,255,255,.4)" font-size="7" font-family="Orbitron">' + STAT_LABELS[k] + ':' + stats[k] + '</text>';
    }).join('');
    return '<svg class="radar-svg" viewBox="0 0 200 200">' + grid + '<polygon points="' + data + '" fill="rgba(226,54,54,.12)" stroke="rgba(226,54,54,.6)" stroke-width="1.5"/>' + labels + '</svg>';
  }

  function renderCards() {
    var grid = document.getElementById('profileGrid');
    if (!grid) return;
    grid.innerHTML = '';
    D.characters.forEach(function (c, i) {
      var card = el('div', 'char-card');
      card.setAttribute('data-category', c.categories || '');
      card.setAttribute('data-id', c.id);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open ' + c.name + ' archive');
      card.style.setProperty('--acc', c.accent);
      var imgMarkup = '<img src="' + c.heroImage + '" alt="' + c.name + '" loading="lazy" decoding="async">';
      if (c.identityImage) {
        imgMarkup = '<div class="flip3d' + (reduced ? ' reduced' : '') + '" role="img" aria-label="' + c.name + ' — identity: ' + (c.identityName || c.realName) + '">' +
          '<div class="flip3d-inner">' +
          '<div class="flip3d-face flip3d-front"><img src="' + c.heroImage + '" alt="' + c.name + '" loading="lazy" decoding="async"></div>' +
          '<div class="flip3d-face flip3d-back"><img src="' + c.identityImage + '" alt="' + (c.identityName || c.realName) + '" loading="lazy" decoding="async"></div>' +
          '</div>' +
          '<span class="flip3d-glow" aria-hidden="true"></span>' +
          '<span class="flip3d-scan" aria-hidden="true"></span>' +
          '</div>';
      }
      card.innerHTML =
        '<div class="card-hud">SUBJECT: ' + c.name + ' // FILE: ' + c.num + '</div>' +
        '<div class="char-card-inner">' +
        '<div class="char-card-front">' +
        '<div class="card-content">' +
        '<div class="card-image-wrap">' + imgMarkup +
        '<span class="card-number">' + c.num + '</span>' +
        '<span class="card-status-badge status-' + c.status + '">' + c.statusLabel + '</span>' +
        '</div>' +
        '<div class="card-identity">' +
        '<div class="card-alias">' + c.name + '</div>' +
        '<div class="card-realname">' + c.realName + '</div>' +
        '<div class="card-team-tags">' + teamTags(c.teams) + '</div>' +
        '</div>' +
        '<div class="card-origin"><p>' + c.description + '</p></div>' +
        '<div class="card-stats-mini">' + statBars(c.stats) + '</div>' +
        '<div class="card-appearance">' +
        '<span class="appearance-label">FIRST APPEARANCE</span>' +
        '<span class="appearance-value">' + c.firstAppearance + '</span>' +
        '</div>' +
        '<span class="card-hint"><i class="fas fa-database"></i> OPEN ARCHIVE</span>' +
        '</div>' +
        '</div>' +
        '<div class="char-card-back">' +
        '<div class="back-content">' +
        '<div class="back-header">' +
        '<div class="back-name">' + c.realName.toUpperCase() + '</div>' +
        '<div class="back-id">ID: ' + c.num + '</div>' +
        '</div>' +
        '<div class="back-section">' +
        '<div class="back-section-title">POWERS &amp; ABILITIES</div>' +
        '<div class="back-powers-list">' + c.abilities.map(function (a) { return '<div class="back-power-item"><i class="fas fa-circle"></i> ' + a + '</div>'; }).join('') + '</div>' +
        '</div>' +
        '<div class="back-section">' +
        '<div class="back-section-title">STAT RADAR</div>' +
        '<div class="back-radar">' + radarSVG(c.stats) + '</div>' +
        '</div>' +
        '<div class="back-section">' +
        '<div class="back-section-title">CLASSIFIED BRIEF</div>' +
        '<p class="back-bio">' + c.brief + '</p>' +
        '</div>' +
        '<div class="back-footer">' +
        '<span class="back-flip-hint"><i class="fas fa-undo"></i> HOVER TO FLIP BACK</span>' +
        '<span class="card-status-badge status-' + c.status + '" style="position:static;font-size:8px">' + c.statusLabel + '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
      card.addEventListener('click', function () { openArchive(c.id, card); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openArchive(c.id, card); }
      });
      grid.appendChild(card);
      var flipEl = card.querySelector('.flip3d');
      if (flipEl) bindIdentityFlip(flipEl, card);
    });
    bindTilt();
    animateStatBarsSoon();
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.from('.char-card', { scrollTrigger: { trigger: '.profile-grid', start: 'top 88%' }, y: 60, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', once: true });
    }
  }

  function bindTilt() {
    if (reduced || isMobile) return;
    document.querySelectorAll('.char-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(1200px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) scale(1.02)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale(1)';
      });
    });
  }

  function bindIdentityFlip(flip, card) {
    var flipped = false;
    var flipTimer = null;
    function setFlip(on) {
      if (flipped === on) return;
      flipped = on;
      flip.classList.toggle('flipped', on);
      if (reduced) return;
      flip.classList.add('flipping');
      clearTimeout(flipTimer);
      flipTimer = setTimeout(function () { flip.classList.remove('flipping'); }, 900);
    }
    flip._reset = function () { setFlip(false); };
    flip._flipped = function () { return flipped; };
    if (touchFlip) {
      flip.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        setFlip(!flipped);
      });
    } else {
      flip.addEventListener('mouseenter', function () { setFlip(true); });
      flip.addEventListener('mouseleave', function () { setFlip(false); });
      card.addEventListener('focus', function () { setFlip(true); });
      card.addEventListener('blur', function () { setFlip(false); });
    }
    flip.addEventListener('mousemove', function (e) {
      var r = flip.getBoundingClientRect();
      if (!r.width) return;
      flip.style.setProperty('--gx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      flip.style.setProperty('--gy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    });
    identityFlips.push(flip);
  }

  function resetFlips() {
    identityFlips.forEach(function (f) { if (f._reset) f._reset(); });
  }

  function animateStatBarsSoon() {
    setTimeout(function () {
      document.querySelectorAll('.stat-bar-fill[data-width]').forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-width') + '%';
      });
    }, 250);
  }

  function filterCards(type, self) {
    document.querySelectorAll('.filter-tab').forEach(function (t) { t.classList.remove('active'); });
    if (self) self.classList.add('active');
    document.querySelectorAll('.char-card').forEach(function (card) {
      if (type === 'all') { card.style.display = ''; }
      else if (type === 'villains') { card.style.display = 'none'; }
      else {
        var cats = card.getAttribute('data-category') || '';
        card.style.display = cats.split(' ').indexOf(type) !== -1 ? '' : 'none';
      }
    });
  }

  var currentIndex = 0;
  var lastFocusedCard = null;
  var controlsBound = false;
  var overlay, visual, bodyEl, particlesCanvas, particleRaf = null, particleCtx = null;

  function openArchive(id, fromCard) {
    var idx = D.characters.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return;
    currentIndex = idx;
    lastFocusedCard = fromCard || document.activeElement;
    overlay = document.getElementById('archiveOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetFlips();
    renderArchive();
    if (!reduced) {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity .35s ease';
      requestAnimationFrame(function () { overlay.style.opacity = '1'; });
    }
    var closeBtn = overlay.querySelector('.archive-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeArchive() {
    if (!overlay) return;
    var done = function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      stopParticles();
      if (lastFocusedCard && lastFocusedCard.focus) lastFocusedCard.focus();
    };
    if (reduced) { done(); return; }
    overlay.style.opacity = '0';
    setTimeout(done, 320);
  }

  function renderArchive() {
    var c = D.characters[currentIndex];
    visual = overlay.querySelector('.archive-visual');
    bodyEl = overlay.querySelector('.archive-body');
    particlesCanvas = overlay.querySelector('.archive-particles');

    overlay.querySelector('.archive-subject-id').textContent = 'FILE: ' + c.num + ' // CLEARANCE: OMEGA';
    overlay.style.setProperty('--acc', c.accent);

    var info = overlay.querySelector('.archive-info');
    info.innerHTML =
      '<div class="ai-tag"><i class="fas fa-fingerprint"></i> CLASSIFIED SUBJECT DOSSIER</div>' +
      '<h2 class="ai-name">' + c.name + '</h2>' +
      '<div class="ai-realname">' + c.realName + ' — ' + c.title + '</div>' +
      '<div class="ai-aliases">' + c.aliases.map(function (a) { return '<span>' + a + '</span>'; }).join('') + '</div>' +
      '<p class="ai-desc">' + c.description + '</p>' +
      '<div class="ai-block">' +
      '<div class="ai-block-title">ABILITIES</div>' +
      '<div class="ai-abilities">' + c.abilities.map(function (a) { return '<span><i class="fas fa-circle"></i>' + a + '</span>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="ai-meta-grid">' +
      '<div class="ai-meta"><span class="am-label">TEAM</span><div class="am-value">' + teamTags(c.teams) + '</div></div>' +
      '<div class="ai-meta"><span class="am-label">UNIVERSE</span><span class="am-value">' + c.universe + '</span></div>' +
      '<div class="ai-meta"><span class="am-label">STATUS</span><span class="am-value am-status status-' + c.status + '">' + c.statusLabel + '</span></div>' +
      '<div class="ai-meta"><span class="am-label">FIRST APPEARANCE</span><span class="am-value">' + c.firstAppearance + '</span></div>' +
      '</div>' +
      '<div class="ai-radar-label">POWER MATRIX</div>' +
      '<div class="ai-radar">' + radarSVG(c.stats) + '</div>';

    var visualInner = overlay.querySelector('.archive-visual-inner');
    visualInner.innerHTML =
      '<div class="av-grid"></div>' +
      '<div class="av-rings"><span class="av-ring r1"></span><span class="av-ring r2"></span></div>' +
      '<div class="av-corner tl"></div><div class="av-corner tr"></div><div class="av-corner bl"></div><div class="av-corner br"></div>' +
      '<div class="av-scanlines"></div>' +
      '<div class="av-sweep"></div>' +
      '<div class="av-hud-top">SCAN: ' + c.id.toUpperCase() + ' // ' + c.universe.toUpperCase() + '</div>' +
      '<div class="av-hud-bottom" id="avCoords">LAT: 0.0000 // LON: 0.0000</div>' +
      '<img class="av-img" src="' + c.heroImage + '" alt="' + c.name + '" loading="lazy" decoding="async">' +
      '<canvas class="archive-particles" aria-hidden="true"></canvas>';

    particlesCanvas = visualInner.querySelector('.archive-particles');
    particlesCanvas.width = visualInner.clientWidth;
    particlesCanvas.height = visualInner.clientHeight;
    startParticles();
    bindVisualParallax();

    var lower = overlay.querySelector('.archive-lower');
    var movies = c.movieAppearances.map(function (id) { return D.movieById(id); }).filter(Boolean);
    var unis = c.relatedUniverses.map(function (id) { return D.universeById(id); }).filter(Boolean);
    var related = c.relatedCharacters.map(function (id) { return D.characters.find(function (ch) { return ch.id === id; }); }).filter(Boolean);

    lower.innerHTML =
      '<div class="al-section al-movies">' +
      '<div class="al-title"><i class="fas fa-film"></i> MOVIE APPEARANCES</div>' +
      '<div class="al-movie-row">' +
      movies.map(function (m) {
        return '<button class="al-movie" data-movie="' + m.id + '" type="button"><span class="am-year">' + m.year + '</span><span class="am-tag">' + m.tag + '</span><span class="am-name">' + m.title + '</span><i class="fas fa-arrow-right"></i></button>';
      }).join('') +
      '</div></div>' +
      '<div class="al-section">' +
      '<div class="al-title"><i class="fas fa-shield-halved"></i> RELATED CHARACTERS</div>' +
      '<div class="al-related-row">' +
      related.map(function (rc) {
        return '<button class="al-related" data-related="' + rc.id + '" type="button"><img src="' + rc.heroImage + '" alt="' + rc.name + '" loading="lazy"><span>' + rc.name + '</span></button>';
      }).join('') +
      '</div></div>' +
      '<div class="al-section">' +
      '<div class="al-title"><i class="fas fa-bahai"></i> RELATED UNIVERSES</div>' +
      '<div class="al-universe-row">' +
      unis.map(function (u) {
        return '<button class="al-universe" data-universe="' + u.id + '" style="--uac:' + u.color + '" type="button"><i class="fas ' + u.icon + '"></i><span><b>' + u.name + '</b><small>' + u.tag + '</small></span></button>';
      }).join('') +
      '</div></div>' +
      (c.quotes && c.quotes.length ? '<div class="al-section al-quotes">' +
        '<div class="al-title"><i class="fas fa-quote-left"></i> RECORDED QUOTES</div>' +
        '<div class="al-quote-row">' + c.quotes.map(function (q) { return '<blockquote>' + q + '</blockquote>'; }).join('') + '</div></div>' : '');

    overlay.querySelectorAll('.al-movie').forEach(function (b) {
      b.addEventListener('click', function () { window.location.href = 'index.html#movies'; });
    });
    overlay.querySelectorAll('.al-related').forEach(function (b) {
      b.addEventListener('click', function () { switchArchive(b.getAttribute('data-related')); });
    });
    overlay.querySelectorAll('.al-universe').forEach(function (b) {
      b.addEventListener('click', function () { window.location.href = 'multiverse.html'; });
    });

    overlay.querySelector('.archive-prev').setAttribute('aria-label', 'Previous character: ' + D.characters[(currentIndex - 1 + D.characters.length) % D.characters.length].name);
    overlay.querySelector('.archive-next').setAttribute('aria-label', 'Next character: ' + D.characters[(currentIndex + 1) % D.characters.length].name);
  }

  var switchTimer = null;
  function switchArchive(id) {
    var idx = D.characters.findIndex(function (c) { return c.id === id; });
    if (idx === -1) return;
    currentIndex = idx;
    bodyEl = overlay.querySelector('.archive-body');
    var lower = overlay.querySelector('.archive-lower');
    if (reduced) { renderArchive(); return; }
    bodyEl.classList.add('switching');
    lower.classList.add('switching');
    clearTimeout(switchTimer);
    switchTimer = setTimeout(function () {
      renderArchive();
      bodyEl.classList.remove('switching');
      lower.classList.remove('switching');
    }, 260);
  }

  function bindVisualParallax() {
    var inner = overlay.querySelector('.archive-visual-inner');
    var img = overlay.querySelector('.av-img');
    var coords = document.getElementById('avCoords');
    if (!inner || !img) return;
    inner.onmousemove = null;
    img.style.transform = 'scale(1) translate3d(0,0,0)';
    if (reduced || isMobile) return;
    inner.addEventListener('mousemove', function (e) {
      var r = inner.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = 'scale(1.06) translate3d(' + (x * -18) + 'px,' + (y * -14) + 'px,0)';
      if (coords) coords.textContent = 'LAT: ' + (y * 10).toFixed(4) + ' // LON: ' + (x * 10).toFixed(4);
    });
    inner.addEventListener('mouseleave', function () {
      img.style.transform = 'scale(1.04) translate3d(0,0,0)';
      if (coords) coords.textContent = 'LAT: 0.0000 // LON: 0.0000';
    });
  }

  var particles = [], pSize = 0;
  function startParticles() {
    stopParticles();
    var canvas = particlesCanvas;
    if (!canvas) return;
    if (reduced) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    particleCtx = ctx;
    var count = isMobile ? 12 : (isTablet ? 30 : 60);
    var w = canvas.width = canvas.clientWidth;
    var h = canvas.height = canvas.clientHeight;
    particles = [];
    var accent = overlay.style.getPropertyValue('--acc') || '#e23636';
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: Math.random() * 0.5 + 0.15
      });
    }
    var rgb = hexToRgb(accent);
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + p.a + ')';
        ctx.fill();
      }
      particleRaf = requestAnimationFrame(frame);
    }
    particleRaf = requestAnimationFrame(frame);
  }

  function stopParticles() {
    if (particleRaf) { cancelAnimationFrame(particleRaf); particleRaf = null; }
    particleCtx = null;
    if (particlesCanvas) {
      var ctx = particlesCanvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
    }
  }

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r: 226, g: 54, b: 54 };
  }

  function initSearch() {
    var input = document.getElementById('archiveSearch');
    var panel = document.getElementById('searchResults');
    if (!input || !panel) return;
    var activeIdx = -1, activeItems = [];

    function render() {
      var res = D.search(input.value);
      var groups = [
        { label: 'CHARACTERS', items: res.characters.map(function (c) { return { kind: 'character', id: c.id, img: c.heroImage, name: c.name, sub: c.realName, cat: 'CHARACTER' }; }) },
        { label: 'MOVIES', items: res.movies.map(function (m) { return { kind: 'movie', id: m.id, img: '', name: m.title, sub: m.year + ' // ' + m.phase, cat: m.tag }; }) },
        { label: 'UNIVERSES', items: res.universes.map(function (u) { return { kind: 'universe', id: u.id, img: '', name: u.name, sub: u.tag, cat: 'UNIVERSE', color: u.color, icon: u.icon }; }) }
      ].filter(function (g) { return g.items.length > 0; });

      if (!groups.length) {
        panel.innerHTML = '<div class="search-empty"><i class="fas fa-search"></i> NO RECORDS FOUND IN THE MULTIVERSE</div>';
        panel.classList.add('open');
        activeItems = [];
        return;
      }
      panel.innerHTML = groups.map(function (g) {
        return '<div class="search-group">' + g.label + '</div>' +
          g.items.map(function (it, i) {
            var img = it.img
              ? '<img src="' + it.img + '" alt="' + it.name + '" loading="lazy">'
              : '<div class="si-icon" style="--iacc:' + (it.color || '#e23636') + '"><i class="fas ' + (it.icon || 'fa-film') + '"></i></div>';
            return '<div class="search-item" data-kind="' + it.kind + '" data-id="' + it.id + '">' + img +
              '<span class="si-text"><span class="si-name">' + it.name + '</span><span class="si-sub">' + it.sub + '</span></span>' +
              '<span class="si-cat">' + it.cat + '</span></div>';
          }).join('');
      }).join('');
      panel.classList.add('open');
      activeItems = panel.querySelectorAll('.search-item');
      activeIdx = -1;
    }

    function choose(item) {
      var kind = item.getAttribute('data-kind');
      var id = item.getAttribute('data-id');
      panel.classList.remove('open');
      input.value = '';
      if (kind === 'character') openArchive(id);
      else if (kind === 'movie') window.location.href = 'index.html#movies';
      else if (kind === 'universe') window.location.href = 'multiverse.html';
    }

    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value) render(); });
    panel.addEventListener('click', function (e) {
      var item = e.target.closest('.search-item');
      if (item) choose(item);
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!activeItems.length) { render(); return; }
        activeIdx = (activeIdx + 1) % activeItems.length;
        setActive();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!activeItems.length) return;
        activeIdx = (activeIdx - 1 + activeItems.length) % activeItems.length;
        setActive();
      } else if (e.key === 'Enter') {
        if (activeIdx >= 0 && activeItems[activeIdx]) choose(activeItems[activeIdx]);
      } else if (e.key === 'Escape') {
        panel.classList.remove('open');
        input.blur();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.archive-search')) panel.classList.remove('open');
    });

    function setActive() {
      activeItems.forEach(function (it, i) { it.classList.toggle('active', i === activeIdx); });
      if (activeItems[activeIdx]) activeItems[activeIdx].scrollIntoView({ block: 'nearest' });
    }
  }

  function initArchiveControls() {
    if (controlsBound) return;
    controlsBound = true;
    overlay = document.getElementById('archiveOverlay');
    if (!overlay) return;
    overlay.querySelector('.archive-close').addEventListener('click', closeArchive);
    overlay.querySelector('.archive-prev').addEventListener('click', function () { switchArchive(D.characters[(currentIndex - 1 + D.characters.length) % D.characters.length].id); });
    overlay.querySelector('.archive-next').addEventListener('click', function () { switchArchive(D.characters[(currentIndex + 1) % D.characters.length].id); });
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeArchive(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); switchArchive(D.characters[(currentIndex - 1 + D.characters.length) % D.characters.length].id); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); switchArchive(D.characters[(currentIndex + 1) % D.characters.length].id); }
      else if (e.key === 'Tab') {
        var focusables = overlay.querySelectorAll('button, [tabindex], a, input');
        var list = Array.prototype.filter.call(focusables, function (f) { return f.offsetParent !== null; });
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCards();
    initSearch();
    initArchiveControls();
    window.filterCards = filterCards;
  });
})();
