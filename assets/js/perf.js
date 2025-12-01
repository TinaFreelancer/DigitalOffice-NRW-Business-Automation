// Performance enhancements for images and scripts
(function(){
  let elfsightLoaded = false;
  function loadElfsight(){
    if (elfsightLoaded) return;
    elfsightLoaded = true;
    const s = document.createElement('script');
    s.src = 'https://elfsightcdn.com/platform.js';
    s.defer = true;
    s.dataset.critical = 'false';
    document.head.appendChild(s);
  }

  function initElfsightLazy(){
    const widgets = document.querySelectorAll('[data-elfsight-app-lazy]');
    if (!widgets.length) return;

    // Placeholder to reduce CLS (optional minimal height if empty)
    widgets.forEach(w => {
      if (!w.hasAttribute('data-elfsight-placeholder')){
        w.style.minHeight = '260px';
        w.style.opacity = '0';
        w.setAttribute('data-elfsight-placeholder','true');
      }
    });

    const reveal = () => {
      widgets.forEach(w => { w.style.opacity = '1'; });
    };

    const observerCallback = (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadElfsight();
          reveal();
          obs.disconnect();
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(observerCallback, { rootMargin: '500px 0px' });
      widgets.forEach(w => io.observe(w));
    } else {
      // Fallback: multiple graceful triggers (idle, timeout, scroll, user interaction)
      const trigger = () => { loadElfsight(); reveal(); detach(); };
      let triggered = false;
      function safeTrigger(){ if (!triggered){ triggered = true; trigger(); } }
      function detach(){
        window.removeEventListener('scroll', safeTrigger);
        window.removeEventListener('keydown', safeTrigger);
        window.removeEventListener('click', safeTrigger);
        window.removeEventListener('touchstart', safeTrigger);
        widgets.forEach(w => w.removeEventListener('focusin', safeTrigger));
      }
      // Idle / timeout
      if ('requestIdleCallback' in window) {
        requestIdleCallback(safeTrigger, { timeout: 2500 });
      } else {
        setTimeout(safeTrigger, 1800);
      }
      // Interaction based triggers
      window.addEventListener('scroll', safeTrigger, { passive: true });
      window.addEventListener('keydown', safeTrigger, { passive: true });
      window.addEventListener('click', safeTrigger, { passive: true });
      window.addEventListener('touchstart', safeTrigger, { passive: true });
      widgets.forEach(w => w.addEventListener('focusin', safeTrigger));
    }

    // Manual global hook (debug / forced load)
    if (!window.loadTestimonials){
      window.loadTestimonials = function(){ loadElfsight(); reveal(); };
    }
  }
  function enhanceImages(){
    // Erfasse alle Bilder der Seite
    const images = document.querySelectorAll('img');
    const viewportHeight = window.innerHeight || 800;
    images.forEach((img, idx) => {
      // Skip likely above-the-fold hero/logo images
      const rect = img.getBoundingClientRect();
      const isAboveFold = rect.top < viewportHeight * 0.8;
      const isCritical = img.dataset.critical === 'true' || img.closest('.hero') || img.closest('.site-header');

      // Always async decode
      img.setAttribute('decoding', 'async');

      if (!isCritical && !isAboveFold) {
        img.setAttribute('loading', 'lazy');
        img.setAttribute('fetchpriority', 'low');
      } else {
        // Hint browser to prioritize key visuals
        img.setAttribute('fetchpriority', 'high');
      }

      // Prevent layout shift: add width/height if missing from attributes using natural sizes when available
      if (!img.hasAttribute('width') && img.naturalWidth) {
        img.setAttribute('width', img.naturalWidth);
      }
      if (!img.hasAttribute('height') && img.naturalHeight) {
        img.setAttribute('height', img.naturalHeight);
      }
    });
  }

  function deferNonCriticalScripts(){
    // Add defer to script tags without data-critical and without inline content
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    scripts.forEach(script => {
      const isCritical = script.dataset.critical === 'true' || /includes\.js|mailerlite-api\.js/.test(script.src);
      if (!isCritical) {
        script.defer = true;
      }
    });
  }

  function preconnectFonts(){
    // Preconnect to common font CDNs if used
    const head = document.head;
    if (!head) return;
    const add = (href) => {
      if (document.querySelector(`link[rel=\"preconnect\"][href=\"${href}\"]`)) return;
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = '';
      head.appendChild(link);
    };
    // Only add if matching references exist in DOM
    if (document.querySelector('link[href*="fonts.googleapis.com"]') || document.querySelector('link[href*="gstatic.com"]')){
      add('https://fonts.googleapis.com');
      add('https://fonts.gstatic.com');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      enhanceImages();
      deferNonCriticalScripts();
      preconnectFonts();
      initElfsightLazy();
    });
  } else {
    enhanceImages();
    deferNonCriticalScripts();
    preconnectFonts();
    initElfsightLazy();
  }
})();
