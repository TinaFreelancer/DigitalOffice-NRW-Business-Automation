// Performance enhancements for images and scripts
(function(){
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
    });
  } else {
    enhanceImages();
    deferNonCriticalScripts();
    preconnectFonts();
  }
})();
