/* ============================================================
   Q-Guard Static Site — Main JavaScript
   ============================================================ */

/* ── Preloader ─────────────────────────────────────────────── */
(function () {
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    setTimeout(function () {
      var lw = document.getElementById('loader-wrapper');
      if (lw) lw.style.display = 'none';
    }, 1100);
  });
})();

/* ── Sticky Header ─────────────────────────────────────────── */
(function () {
  var banner = document.querySelector('.banner');
  if (!banner) return;

  function onScroll() {
    if (window.scrollY > 60) {
      banner.classList.add('scrolled');
    } else {
      banner.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile Menu Toggle ────────────────────────────────────── */
(function () {
  var toggle = document.querySelector('.navbar-toggle');
  var collapse = document.querySelector('.navbar-collapse');
  if (!toggle || !collapse) return;

  function closeMenu() {
    collapse.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var isOpen = collapse.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !collapse.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on nav link click
  collapse.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && collapse.classList.contains('open')) {
      closeMenu();
    }
  });
})();

/* ── Scroll Animations (IntersectionObserver) ──────────────── */
(function () {
  // Find all elements that should animate on scroll
  var animatables = document.querySelectorAll('.animate-on-scroll');

  if (!animatables.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var animation = el.dataset.animation || 'fadeIn';
        var delay = el.dataset.delay || 0;

        setTimeout(function () {
          el.classList.remove('elementor-invisible');
          el.classList.add('animated', animation);
        }, parseInt(delay, 10));

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatables.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ── Accordion / FAQ ───────────────────────────────────────── */
(function () {
  var items = document.querySelectorAll('.accordion-item');

  function toggleAccordion(item) {
    var isOpen = item.classList.contains('open');

    // Close all others
    items.forEach(function (other) {
      other.classList.remove('open');
      var otherHeader = other.querySelector('.accordion-header');
      if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      var header = item.querySelector('.accordion-header');
      if (header) header.setAttribute('aria-expanded', 'true');
    }
  }

  items.forEach(function (item) {
    var header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', function () {
      toggleAccordion(item);
    });

    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggleAccordion(item);
      }
    });
  });
})();

/* ── Swiper Carousel ───────────────────────────────────────── */
(function () {
  // Easy to use screenshots - homepage
  var easySwiper = document.querySelector('.easy-swiper');
  if (easySwiper && typeof Swiper !== 'undefined') {
    new Swiper(easySwiper, {
      slidesPerView: 2,
      spaceBetween: 30,
      navigation: {
        nextEl: easySwiper.querySelector('.swiper-button-next'),
        prevEl: easySwiper.querySelector('.swiper-button-prev'),
      },
      breakpoints: {
        0:   { slidesPerView: 1 },
        768: { slidesPerView: 2 }
      }
    });
  }

  // Trusted by - about page (white arrows)
  var trustedAbout = document.querySelector('.trusted-carousel-about');
  if (trustedAbout && typeof Swiper !== 'undefined') {
    new Swiper(trustedAbout, {
      slidesPerView: 4,
      spaceBetween: 30,
      navigation: {
        nextEl: trustedAbout.querySelector('.swiper-button-next'),
        prevEl: trustedAbout.querySelector('.swiper-button-prev'),
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      loop: true,
      speed: 500,
      breakpoints: {
        0:   { slidesPerView: 1 },
        480: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024:{ slidesPerView: 4 },
      }
    });
  }
})();

/* ── Form honeypot (accessibility spam protection) ─────────── */
(function () {
  var honeypots = document.querySelectorAll('.frm-verify');
  honeypots.forEach(function (hp) {
    var wrapper = hp.closest('.frm-verify-wrap');
    if (wrapper) wrapper.style.display = 'none';
    hp.style.display = 'none';
    hp.setAttribute('tabindex', '-1');
    hp.setAttribute('aria-hidden', 'true');
  });
})();

/* ── Simple Contact Form (no backend) ─────────────────────── */
(function () {
  var forms = document.querySelectorAll('.contact-form, .demo-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.value = 'Sending…';
        submitBtn.disabled = true;
      }

      // Simulate success after 1.5s
      setTimeout(function () {
        var msg = form.querySelector('.form-success-msg');
        if (msg) {
          msg.style.display = 'block';
        } else {
          var div = document.createElement('div');
          div.className = 'form-success-msg';
          div.style.cssText = 'color:#48A9A6;font-weight:700;margin-top:12px;';
          div.textContent = 'Thank you! We\'ll be in touch soon.';
          form.appendChild(div);
        }
        if (submitBtn) {
          submitBtn.value = 'Send';
          submitBtn.disabled = false;
        }
        form.reset();
      }, 1500);
    });
  });
})();

/* ── Active nav item highlight ─────────────────────────────── */
(function () {
  var path = window.location.pathname.replace(/\/$/, '') || '/';
  var navLinks = document.querySelectorAll('.navbar-nav .menu-item');

  navLinks.forEach(function (item) {
    var a = item.querySelector('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    // Strip trailing slash for comparison
    var cleanHref = href.replace(/\/$/, '');
    if (cleanHref && path.endsWith(cleanHref)) {
      item.classList.add('current-menu-item');
    }
  });
})();
