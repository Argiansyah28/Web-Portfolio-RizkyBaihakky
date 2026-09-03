/* =========================================================
   Portfolio — Rizky Baihakky
   Interaksi: navbar, reveal on scroll, typing, tabs,
   progress bar, counter, skill bar, form, back to top.
   ========================================================= */

(function () {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------------
     1. NAVBAR: sticky, mobile menu, active link
     ------------------------------------------------------- */
  const navbar    = $('#navbar');
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');
  const navLinks  = $$('.nav-link');

  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (!navMenu.classList.contains('open')) return;
    if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  /* -------------------------------------------------------
     2. SCROLL: navbar style, progress bar, tombol ke atas,
        highlight menu aktif
     ------------------------------------------------------- */
  const progress = $('#scrollProgress');
  const toTop    = $('#toTop');
  const sections = $$('main section[id]');

  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    navbar.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 500);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';

    // Menu aktif berdasarkan posisi section
    let current = sections.length ? sections[0].id : '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  /* -------------------------------------------------------
     3. REVEAL ON SCROLL — muncul dari kiri ke kanan.
        Animasi diputar ulang saat scroll naik maupun turun.
     ------------------------------------------------------- */
  const revealEls = $$('.reveal-left, .reveal-right');

  revealEls.forEach(el => {
    const delay = el.dataset.delay;
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          runEffects(entry.target);
        } else {
          // Reset supaya transisi terulang saat elemen kembali terlihat
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* -------------------------------------------------------
     4. EFEK DI DALAM ELEMEN YANG MUNCUL (angka statistik)
     ------------------------------------------------------- */
  function runEffects(root) {
    $$('.stat-num[data-count]', root).forEach(el => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (el.dataset.running === '1') return;
      el.dataset.running = '1';

      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
          el.dataset.running = '0';
        }
      }
      requestAnimationFrame(step);
    });
  }

  // Jalankan sekali untuk elemen yang sudah terlihat saat halaman dibuka
  if (prefersReduced) runEffects(document);

  /* -------------------------------------------------------
     5. TYPING EFFECT DI HERO
     ------------------------------------------------------- */
  const typedEl = $('#typed');
  const roles = [
    'Enterprise Architecture Enthusiast',
    'Business Analyst',
    'IT Governance & Risk',
    'Business Process Analyst'
  ];

  if (typedEl) {
    if (prefersReduced) {
      typedEl.textContent = roles[0];
    } else {
      let rIndex = 0, cIndex = 0, deleting = false;

      (function type() {
        const word = roles[rIndex];
        cIndex += deleting ? -1 : 1;
        typedEl.textContent = word.slice(0, cIndex);

        let speed = deleting ? 40 : 85;

        if (!deleting && cIndex === word.length) {
          speed = 1800;
          deleting = true;
        } else if (deleting && cIndex === 0) {
          deleting = false;
          rIndex = (rIndex + 1) % roles.length;
          speed = 350;
        }
        setTimeout(type, speed);
      })();
    }
  }

  /* -------------------------------------------------------
     6. TAB EXPERIENCE
     ------------------------------------------------------- */
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.tab;

      $$('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      $$('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + id));

      // Ulangi animasi masuk pada panel yang baru aktif
      const panel = $('#tab-' + id);
      if (!panel) return;
      $$('.reveal-left, .reveal-right', panel).forEach(el => {
        el.classList.remove('visible');
        void el.offsetWidth; // paksa reflow
        el.classList.add('visible');
      });
    });
  });

  /* -------------------------------------------------------
     7. FOTO PROFIL — tampilkan placeholder jika belum ada
     ------------------------------------------------------- */
  const photo       = $('#profilePhoto');
  const placeholder = $('#photoPlaceholder');

  if (photo && placeholder) {
    const showPlaceholder = () => {
      photo.classList.add('hidden');
      placeholder.classList.add('show');
    };
    const hidePlaceholder = () => {
      photo.classList.remove('hidden');
      placeholder.classList.remove('show');
    };

    photo.addEventListener('error', showPlaceholder);
    photo.addEventListener('load', hidePlaceholder);

    if (photo.complete) {
      photo.naturalWidth === 0 ? showPlaceholder() : hidePlaceholder();
    }
  }

  /* -------------------------------------------------------
     8. ANIMASI PEMBUKA FOTO PROFIL
        Foto muncul besar di tengah layar (terasa dekat),
        lalu menjauh dan mengecil ke posisi seharusnya.
        Ukuran & jarak dihitung dari layar, jadi tetap pas
        di desktop maupun HP.
     ------------------------------------------------------- */
  const frame = $('#photoFrame');
  const badge = $('#photoBadge');

  if (frame && !prefersReduced) {
    frame.classList.add('intro-start');
    if (badge) badge.classList.add('intro-start');

    let played = false;

    function playIntro() {
      if (played) return;
      played = true;

      const rect = frame.getBoundingClientRect();

      // Lewati animasi kalau halaman dibuka tidak dari atas
      if (!rect.height || window.scrollY > 120) {
        frame.classList.remove('intro-start');
        if (badge) badge.classList.remove('intro-start');
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Posisi awal: tepat di tengah layar
      const dx = (vw / 2) - (rect.left + rect.width / 2);
      const dy = (vh / 2) - (rect.top  + rect.height / 2);

      // Perbesaran awal: muat di layar, tidak melebihi 2.2x
      const maxH  = Math.min(vh * 0.72, (vw * 0.8) * (rect.height / rect.width));
      const scale = Math.max(1.15, Math.min(2.2, maxH / rect.height));

      frame.style.transition = 'none';
      frame.style.transform  = `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`;
      frame.classList.add('intro-run');

      // Paksa reflow supaya posisi awal terpakai sebelum transisi
      void frame.offsetWidth;

      requestAnimationFrame(() => {
        frame.style.transition =
          'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease';
        frame.style.transform = 'translate3d(0, 0, 0) scale(1)';
        frame.classList.remove('intro-start');
        if (badge) {
          badge.classList.remove('intro-start');
          badge.classList.add('intro-run');
        }
      });

      frame.addEventListener('transitionend', function done(e) {
        if (e.propertyName !== 'transform') return;
        frame.removeEventListener('transitionend', done);
        frame.classList.remove('intro-run');
        frame.style.transition = '';
        frame.style.transform  = '';
        frame.style.willChange = 'auto';
      });
    }

    // Tunggu foto selesai dimuat agar tidak berkedip, dengan batas waktu
    if (photo && !photo.complete) {
      photo.addEventListener('load',  playIntro, { once: true });
      photo.addEventListener('error', playIntro, { once: true });
    }
    window.addEventListener('load', playIntro, { once: true });
    setTimeout(playIntro, 1500);
  }

})();
