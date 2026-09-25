/*
 * Q-Guard — vanilla replacement for the WordPress runtime (StratusX theme,
 * Elementor frontend, Bootstrap collapse, Formidable). The markup is the
 * original Elementor output, so every behaviour below reads the same
 * classes and data-settings the WordPress scripts used.
 */
(() => {
  'use strict';

  const STICKY_HEADER_OFFSET = 125; // theme option "offset" of Headhesive
  const COLLAPSE_DURATION = 350; // Bootstrap .collapsing transition
  const TOGGLE_DURATION = 400; // jQuery slideToggle default used by Elementor
  const ANCHOR_SCROLL_DURATION = 500;
  const SCROLL_UP_DISTANCE = 300;
  const SCROLL_UP_FADE_DURATION = 200;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Same rule as the theme's themo_is_touch_device(): a mobile user agent OR a
  // phone-sized screen, evaluated once at load. Touch-capable tablets with a
  // desktop user agent (e.g. iPadOS) keep the transparent header.
  const isTouchDevice = /iphone|ipod|ipad|android|blackberry/i.test(navigator.userAgent)
    || window.matchMedia('(max-width: 767px)').matches;

  const readSettings = element => {
    try {
      return JSON.parse(element.dataset.settings || '{}');
    } catch {
      return {};
    }
  };

  /* Elementor breakpoints (kit defaults): mobile ≤ 767, tablet ≤ 1024 */
  const currentDevice = () => {
    if (window.innerWidth <= 767) return 'mobile';
    if (window.innerWidth <= 1024) return 'tablet';
    return 'desktop';
  };

  const responsiveSetting = (settings, key) => {
    const device = currentDevice();
    if (device === 'mobile' && settings[`${key}_mobile`] !== undefined && settings[`${key}_mobile`] !== '') {
      return settings[`${key}_mobile`];
    }
    if (device !== 'desktop' && settings[`${key}_tablet`] !== undefined && settings[`${key}_tablet`] !== '') {
      return settings[`${key}_tablet`];
    }
    return settings[key];
  };

  /* ---------- Preloader + body state ---------- */
  function initBodyState() {
    if (isTouchDevice) {
      document.body.classList.add('th-touch');
      document.querySelectorAll('.navbar[data-transparent-header]').forEach(navbar => {
        navbar.setAttribute('data-transparent-header', 'false');
      });
    }
    document.body.classList.add('loaded');
  }

  /* ---------- Sticky header (Headhesive clone) ---------- */
  function initStickyHeader() {
    if (!document.body.classList.contains('th-sticky-header')) return;
    const header = document.querySelector('header.banner');
    if (!header) return;

    document.body.classList.add('headhesive');
    const clone = header.cloneNode(true);
    clone.classList.add('headhesive--clone', 'headhesive--unstick');
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button').forEach(control => control.setAttribute('tabindex', '-1'));
    document.body.insertBefore(clone, document.body.firstChild);

    let isStuck = false;
    const update = () => {
      const shouldStick = window.scrollY > STICKY_HEADER_OFFSET;
      if (shouldStick === isStuck) return;
      isStuck = shouldStick;
      clone.classList.toggle('headhesive--stick', shouldStick);
      clone.classList.toggle('headhesive--unstick', !shouldStick);
      if (shouldStick) clone.removeAttribute('aria-hidden');
      else clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('a, button').forEach(control => {
        if (shouldStick) control.removeAttribute('tabindex');
        else control.setAttribute('tabindex', '-1');
      });
      if (!shouldStick) collapseNavigation(clone);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- Mobile navigation (Bootstrap collapse) ---------- */
  function collapseNavigation(header) {
    const toggle = header.querySelector('.navbar-toggle');
    const panel = header.querySelector('.navbar-collapse');
    if (panel && panel.classList.contains('in')) setNavigationOpen(toggle, panel, false);
  }

  function setNavigationOpen(toggle, panel, open) {
    toggle.classList.toggle('collapsed', !open);
    toggle.setAttribute('aria-expanded', String(open));
    if (reduceMotion) {
      panel.classList.toggle('in', open);
      return;
    }
    const startHeight = open ? 0 : panel.scrollHeight;
    panel.classList.remove('collapse', 'in');
    panel.classList.add('collapsing');
    panel.style.height = `${startHeight}px`;
    requestAnimationFrame(() => {
      panel.style.height = open ? `${panel.scrollHeight}px` : '0px';
    });
    window.setTimeout(() => {
      panel.classList.remove('collapsing');
      panel.classList.add('collapse');
      panel.classList.toggle('in', open);
      panel.style.height = '';
    }, COLLAPSE_DURATION);
  }

  function initNavigation() {
    document.addEventListener('click', event => {
      const toggle = event.target.closest('.navbar-toggle');
      if (toggle) {
        const panel = toggle.closest('header').querySelector('.navbar-collapse');
        if (!panel.classList.contains('collapsing')) {
          setNavigationOpen(toggle, panel, !panel.classList.contains('in'));
        }
        return;
      }
      if (event.target.closest('.navbar-collapse a')) {
        collapseNavigation(event.target.closest('header'));
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') document.querySelectorAll('header.banner').forEach(collapseNavigation);
    });
  }

  /* ---------- Entrance animations (Elementor "Motion Effects") ---------- */
  function initEntranceAnimations() {
    const animated = document.querySelectorAll('.elementor-invisible');
    const reveal = element => {
      const settings = readSettings(element);
      const animation = responsiveSetting(settings, '_animation') || responsiveSetting(settings, 'animation');
      element.classList.remove('elementor-invisible');
      if (!animation || animation === 'none' || reduceMotion) return;
      const delay = settings._animation_delay || settings.animation_delay || 0;
      const start = () => element.classList.add('animated', animation);
      if (delay) {
        element.classList.add('elementor-invisible');
        window.setTimeout(() => {
          element.classList.remove('elementor-invisible');
          start();
        }, delay);
      } else {
        start();
      }
    };

    if (!('IntersectionObserver' in window)) {
      animated.forEach(reveal);
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        reveal(entry.target);
      });
    });
    animated.forEach(element => observer.observe(element));
  }

  /* ---------- Image carousels (Elementor image-carousel on Swiper 8) ---------- */
  function initCarousels() {
    if (typeof window.Swiper !== 'function') return;
    document.querySelectorAll('.elementor-widget-image-carousel').forEach(widget => {
      const settings = readSettings(widget);
      const container = widget.querySelector('.elementor-image-carousel-wrapper');
      if (!container) return;
      const slideCount = container.querySelectorAll('.swiper-slide').length;
      const slidesToShow = device => {
        const fallback = { desktop: 3, tablet: 2, mobile: 1 }[device];
        const key = device === 'desktop' ? 'slides_to_show' : `slides_to_show_${device}`;
        return Number(settings[key]) || fallback;
      };
      const slidesToScroll = device => {
        const key = device === 'desktop' ? 'slides_to_scroll' : `slides_to_scroll_${device}`;
        return Number(settings[key]) || 1;
      };
      const spacing = device => {
        const key = device === 'desktop' ? 'image_spacing_custom' : `image_spacing_custom_${device}`;
        const value = settings[key] && settings[key].size;
        if (value !== undefined && value !== '') return Number(value);
        return device === 'desktop' ? 20 : spacing('desktop');
      };
      const breakpointConfig = device => ({
        slidesPerView: slidesToShow(device),
        slidesPerGroup: slidesToScroll(device),
        spaceBetween: spacing(device),
      });
      const isSingle = slidesToShow('desktop') === 1;

      const options = {
        ...breakpointConfig('mobile'),
        speed: Number(settings.speed) || 500,
        loop: settings.infinite === 'yes' && slideCount > slidesToShow('desktop'),
        effect: isSingle && settings.effect === 'fade' ? 'fade' : 'slide',
        grabCursor: true,
        handleElementorBreakpoints: true,
        breakpoints: {
          768: breakpointConfig('tablet'),
          1025: breakpointConfig('desktop'),
        },
        a11y: { enabled: true },
      };
      if (settings.autoplay === 'yes' && !reduceMotion) {
        options.autoplay = {
          delay: Number(settings.autoplay_speed) || 5000,
          disableOnInteraction: settings.pause_on_interaction === 'yes',
          pauseOnMouseEnter: settings.pause_on_hover === 'yes',
        };
      }
      if (['arrows', 'both'].includes(settings.navigation)) {
        options.navigation = {
          prevEl: widget.querySelector('.elementor-swiper-button-prev'),
          nextEl: widget.querySelector('.elementor-swiper-button-next'),
        };
      }
      if (['dots', 'both'].includes(settings.navigation)) {
        options.pagination = {
          el: widget.querySelector('.swiper-pagination'),
          type: 'bullets',
          clickable: true,
        };
      }
      new window.Swiper(container, options);
    });
  }

  /* ---------- Toggle / accordion (Elementor toggle widget) ---------- */
  // The end state is applied by a timer, not by the animation's finish event:
  // animations are paused in background tabs and the event may never fire.
  const runningSlides = new WeakMap();
  function slide(element, open) {
    const previous = runningSlides.get(element);
    if (previous) {
      previous.animation.cancel();
      window.clearTimeout(previous.timer);
    }
    const settle = () => {
      runningSlides.delete(element);
      element.style.overflow = '';
      element.style.display = open ? 'block' : 'none';
    };
    if (reduceMotion) {
      settle();
      return;
    }
    element.style.overflow = 'hidden';
    element.style.display = 'block';
    const fullHeight = element.offsetHeight;
    const collapsed = { height: '0px', paddingTop: '0px', paddingBottom: '0px' };
    const animation = element.animate(
      open ? [collapsed, { height: `${fullHeight}px` }] : [{ height: `${fullHeight}px` }, collapsed],
      { duration: TOGGLE_DURATION, easing: 'ease-in-out', fill: 'forwards' }
    );
    const timer = window.setTimeout(() => {
      animation.cancel();
      settle();
    }, TOGGLE_DURATION);
    runningSlides.set(element, { animation, timer });
  }

  function initToggles() {
    document.querySelectorAll('.elementor-toggle .elementor-tab-title').forEach(title => {
      const content = document.getElementById(title.getAttribute('aria-controls'));
      if (!content) return;
      const activate = () => {
        const open = !title.classList.contains('elementor-active');
        title.classList.toggle('elementor-active', open);
        content.classList.toggle('elementor-active', open);
        title.setAttribute('aria-expanded', String(open));
        slide(content, open);
      };
      title.addEventListener('click', activate);
      title.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
      });
    });
  }

  /* ---------- Lightbox (Elementor lightbox for carousel images) ---------- */
  function initLightbox() {
    const links = [...document.querySelectorAll('a[data-elementor-open-lightbox="yes"]')];
    if (!links.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'qg-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image');
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="qg-lightbox__header">
        <span class="qg-lightbox__counter" aria-live="polite"></span>
        <button type="button" class="qg-lightbox__tool qg-lightbox__fullscreen" aria-label="Plein écran"><i class="eicon-frame-expand" aria-hidden="true"></i></button>
        <button type="button" class="qg-lightbox__tool qg-lightbox__zoom" aria-label="Zoom"><i class="eicon-zoom-in-bold" aria-hidden="true"></i></button>
        <button type="button" class="qg-lightbox__tool qg-lightbox__share" aria-label="Partager" aria-expanded="false"><i class="eicon-share-arrow" aria-hidden="true"></i></button>
        <div class="qg-lightbox__share-links" hidden>
          <a data-share="facebook" target="_blank" rel="noopener"><i class="fab fa-facebook" aria-hidden="true"></i>Partager sur Facebook</a>
          <a data-share="twitter" target="_blank" rel="noopener"><i class="fab fa-twitter" aria-hidden="true"></i>Partager sur Twitter</a>
          <a data-share="pinterest" target="_blank" rel="noopener"><i class="fab fa-pinterest" aria-hidden="true"></i>Épingler</a>
          <a data-share="download" download><i class="fas fa-download" aria-hidden="true"></i>Télécharger l’image</a>
        </div>
      </div>
      <button type="button" class="qg-lightbox__close" aria-label="Fermer"><i class="eicon-close" aria-hidden="true"></i></button>
      <button type="button" class="qg-lightbox__prev" aria-label="Précédent"><i class="eicon-chevron-left" aria-hidden="true"></i></button>
      <figure class="qg-lightbox__stage"><img class="qg-lightbox__image" alt="" /></figure>
      <button type="button" class="qg-lightbox__next" aria-label="Suivant"><i class="eicon-chevron-right" aria-hidden="true"></i></button>
      <div class="qg-lightbox__footer"><div class="qg-lightbox__title"></div></div>`;
    document.body.appendChild(overlay);
    const image = overlay.querySelector('.qg-lightbox__image');
    const counter = overlay.querySelector('.qg-lightbox__counter');
    const title = overlay.querySelector('.qg-lightbox__title');
    const shareButton = overlay.querySelector('.qg-lightbox__share');
    const shareLinks = overlay.querySelector('.qg-lightbox__share-links');

    let gallery = [];
    let index = 0;
    let lastFocus = null;
    const setShareOpen = open => {
      shareLinks.hidden = !open;
      shareButton.setAttribute('aria-expanded', String(open));
    };
    const updateShareLinks = () => {
      const imageUrl = new URL(gallery[index].href, window.location.href).href;
      const pageUrl = encodeURIComponent(window.location.href);
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(imageUrl)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(imageUrl)}`,
        pinterest: `https://www.pinterest.com/pin/create/button/?url=${pageUrl}&media=${encodeURIComponent(imageUrl)}`,
        download: imageUrl,
      };
      shareLinks.querySelectorAll('a').forEach(link => { link.href = shareUrls[link.dataset.share]; });
    };
    const show = newIndex => {
      index = (newIndex + gallery.length) % gallery.length;
      overlay.classList.remove('qg-lightbox--zoomed');
      setShareOpen(false);
      image.src = gallery[index].href;
      image.alt = gallery[index].dataset.elementorLightboxTitle || '';
      title.textContent = gallery[index].dataset.elementorLightboxTitle || '';
      counter.textContent = `${index + 1} / ${gallery.length}`;
      overlay.querySelectorAll('.qg-lightbox__prev, .qg-lightbox__next').forEach(button => {
        button.hidden = gallery.length < 2;
      });
      updateShareLinks();
    };
    const close = () => {
      if (document.fullscreenElement === overlay) document.exitFullscreen();
      overlay.hidden = true;
      document.documentElement.classList.remove('qg-lightbox-open');
      if (lastFocus) lastFocus.focus();
    };

    links.forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        const group = link.dataset.elementorLightboxSlideshow;
        // Swiper loop mode duplicates slides; keep one entry per image.
        gallery = links.filter(candidate => candidate.dataset.elementorLightboxSlideshow === group)
          .filter((candidate, position, all) => all.findIndex(other => other.href === candidate.href) === position);
        lastFocus = link;
        show(gallery.findIndex(candidate => candidate.href === link.href));
        overlay.hidden = false;
        document.documentElement.classList.add('qg-lightbox-open');
        overlay.querySelector('.qg-lightbox__close').focus();
      });
    });
    overlay.addEventListener('click', event => {
      const target = event.target;
      if (target.closest('.qg-lightbox__share-links a')) return;
      if (target.closest('.qg-lightbox__close') || target === overlay || target.classList.contains('qg-lightbox__stage')) close();
      else if (target.closest('.qg-lightbox__prev')) show(index - 1);
      else if (target.closest('.qg-lightbox__next')) show(index + 1);
      else if (target.closest('.qg-lightbox__zoom')) overlay.classList.toggle('qg-lightbox--zoomed');
      else if (target.closest('.qg-lightbox__share')) setShareOpen(shareLinks.hidden);
      else if (target.closest('.qg-lightbox__fullscreen')) {
        if (document.fullscreenElement) document.exitFullscreen();
        else overlay.requestFullscreen?.();
      }
    });
    document.addEventListener('keydown', event => {
      if (overlay.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ---------- Scroll to top (theme "scrollUp") ---------- */
  function initScrollUp() {
    const button = document.createElement('a');
    button.id = 'scrollUp';
    button.href = '#top';
    button.setAttribute('aria-label', 'Retour en haut');
    button.style.position = 'fixed';
    button.style.zIndex = '2147483647';
    button.style.display = 'none';
    button.addEventListener('click', event => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(button);

    // jQuery scrollUp defaults used by the theme: shown past 300px, 200ms fade.
    let isVisible = false;
    let fade = null;
    const setVisible = visible => {
      if (visible === isVisible) return;
      isVisible = visible;
      if (fade) fade.cancel();
      button.style.display = 'block';
      const targetOpacity = getComputedStyle(button).opacity;
      if (reduceMotion) {
        button.style.display = visible ? 'block' : 'none';
        return;
      }
      fade = button.animate(
        visible ? [{ opacity: 0 }, { opacity: targetOpacity }] : [{ opacity: targetOpacity }, { opacity: 0 }],
        { duration: SCROLL_UP_FADE_DURATION }
      );
      fade.onfinish = () => {
        fade = null;
        if (!isVisible) button.style.display = 'none';
      };
    };
    const update = () => setVisible(window.scrollY > SCROLL_UP_DISTANCE);
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- In-page anchors: offset for the sticky header ---------- */
  function initAnchorScroll() {
    const scrollToTarget = target => {
      const stickyHeader = document.querySelector('.headhesive--clone');
      const offset = stickyHeader ? stickyHeader.offsetHeight : 0;
      const destination = target.getBoundingClientRect().top + window.scrollY - offset;
      if (reduceMotion) {
        window.scrollTo(0, destination);
        return;
      }
      const origin = window.scrollY;
      const startTime = performance.now();
      const step = now => {
        const progress = Math.min((now - startTime) / ANCHOR_SCROLL_DURATION, 1); // theme uses 'linear'
        window.scrollTo(0, origin + (destination - origin) * progress);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    document.addEventListener('click', event => {
      const link = event.target.closest('a[href*="#"]');
      if (!link || link.id === 'scrollUp') return;
      const url = new URL(link.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash || url.hash === '#') return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
      history.pushState(null, '', url.hash);
    });
  }

  /* ---------- reCAPTCHA v2 (same site key as the WordPress form) ---------- */
  function initRecaptcha() {
    const captchas = [...document.querySelectorAll('.frm-g-recaptcha')];
    if (!captchas.length) return;
    window.qgRecaptchaReady = () => {
      captchas.forEach(captcha => {
        captcha.dataset.widgetId = window.grecaptcha.render(captcha, {
          sitekey: captcha.dataset.sitekey,
          theme: captcha.dataset.theme || 'light',
          size: captcha.dataset.size || 'normal',
        });
      });
    };
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?onload=qgRecaptchaReady&render=explicit';
    script.async = true;
    document.head.appendChild(script);
  }

  function captchaMissing(form) {
    const captcha = form.querySelector('.frm-g-recaptcha');
    if (!captcha || captcha.dataset.widgetId === undefined || !window.grecaptcha) return false;
    return !window.grecaptcha.getResponse(Number(captcha.dataset.widgetId));
  }

  /* ---------- Forms (Formidable markup, validated client-side) ---------- */
  function initForms() {
    document.querySelectorAll('form.frm-show-form').forEach(form => {
      form.setAttribute('novalidate', '');
      // The honeypot field is visible on the live WordPress site too (kept for 1:1 parity).
      const honeypot = form.querySelector('.frm_verify');

      form.addEventListener('submit', event => {
        event.preventDefault();
        form.querySelectorAll('.frm_error').forEach(message => message.remove());
        form.querySelectorAll('.frm_blank_field').forEach(field => field.classList.remove('frm_blank_field'));
        form.querySelector('.frm_error_style')?.remove();

        let firstInvalid = null;
        form.querySelectorAll('input[name^="item_meta"], textarea[name^="item_meta"]').forEach(input => {
          if (input.classList.contains('frm_verify')) return;
          const value = input.value.trim();
          let message = '';
          if (input.getAttribute('aria-required') === 'true' && !value) {
            message = input.dataset.reqmsg;
          } else if (value && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            message = input.dataset.invmsg;
          }
          input.setAttribute('aria-invalid', String(Boolean(message)));
          if (!message) return;
          const container = input.closest('.frm_form_field');
          container.classList.add('frm_blank_field');
          const error = document.createElement('div');
          error.className = 'frm_error';
          error.id = `frm_error_${input.id}`;
          error.setAttribute('role', 'alert');
          error.textContent = message;
          container.appendChild(error);
          input.setAttribute('aria-describedby', error.id);
          firstInvalid = firstInvalid || input;
        });

        if (captchaMissing(form)) {
          const container = form.querySelector('.frm-g-recaptcha').closest('.frm_form_field');
          container.classList.add('frm_blank_field');
          const error = document.createElement('div');
          error.className = 'frm_error';
          error.setAttribute('role', 'alert');
          error.textContent = 'The captcha is missing from this form';
          container.appendChild(error);
          firstInvalid = firstInvalid || container;
        }

        if (firstInvalid) {
          const summary = document.createElement('div');
          summary.className = 'frm_error_style';
          summary.setAttribute('role', 'alert');
          summary.textContent = 'There was a problem with your submission. Errors are marked below.';
          form.querySelector('.frm_form_fields').before(summary);
          (firstInvalid.querySelector?.('input, textarea') || firstInvalid).focus?.();
          return;
        }
        submitForm(form, Boolean(honeypot && honeypot.value));
      });
    });
  }

  function submitForm(form, isSpam) {
    const endpoint = isSpam ? '' : form.dataset.endpoint;
    const done = () => {
      const message = document.createElement('div');
      message.className = 'frm_message';
      message.setAttribute('role', 'status');
      message.innerHTML = '<p>Your responses were successfully submitted. Thank you!</p>';
      form.replaceWith(message);
    };
    if (!endpoint) {
      done();
      return;
    }
    const submitButton = form.querySelector('[type="submit"]');
    submitButton.disabled = true;
    fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(response => {
        if (!response.ok) throw new Error(String(response.status));
        done();
      })
      .catch(() => {
        submitButton.disabled = false;
        const error = document.createElement('div');
        error.className = 'frm_error_style';
        error.setAttribute('role', 'alert');
        error.textContent = 'There was a problem with your submission. Please try again.';
        form.querySelector('.frm_form_fields').before(error);
      });
  }

  initBodyState();
  initStickyHeader();
  initNavigation();
  initEntranceAnimations();
  initCarousels();
  initToggles();
  initLightbox();
  initScrollUp();
  initAnchorScroll();
  initRecaptcha();
  initForms();
})();
