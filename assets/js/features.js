// Features JavaScript - Cookie Banner, Dark Mode, Back to Top, Scroll Animations

// ===== COOKIE BANNER =====
document.addEventListener('DOMContentLoaded', function() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAccept = document.getElementById('cookie-accept');
    const cookieDecline = document.getElementById('cookie-decline');

    try {
        if (cookieBanner && !localStorage.getItem('cookieConsent')) {
            cookieBanner.style.display = 'block';
        }

        if (cookieAccept) {
            cookieAccept.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }

        if (cookieDecline) {
            cookieDecline.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                if (cookieBanner) cookieBanner.style.display = 'none';
            });
        }
    } catch (e) {
        // Fail silently if banner elements are missing
        console.warn('Cookie banner init skipped:', e);
    }
});

// ===== BACK TO TOP BUTTON =====
// In manchen Seiten (Kontakt) wird der Button erst NACH den Script-Tags eingefügt.
// Deshalb alles in DOMContentLoaded kapseln, damit das Element sicher existiert.
document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.getElementById('back-to-top');
    const siteHeader = document.querySelector('.site-header');
    if (!backToTop) return;

    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Initialer Zustand beim Laden
    toggleBackToTop();
    const headerInitialOffset = siteHeader ? siteHeader.offsetTop : 0;

    function onScrollHeader() {
        toggleBackToTop();
        if (!siteHeader) return;
    }

    window.addEventListener('scroll', onScrollHeader, { passive: true });
    onScrollHeader(); // Initialer Zustand
    // Back-to-Top & Header Effekte initialisieren (nachdem Header sicher vorhanden ist)
    function initHeaderEffects() {
        const backToTop = document.getElementById('back-to-top');
        const siteHeader = document.querySelector('.site-header');
        if (!backToTop && !siteHeader) return;

        function toggleBackToTop() {
            if (!backToTop) return;
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Vereinfachter Scroll-Handler ohne Fallback-Reflow
        let ticking = false;
        function onScrollRaw() {
            toggleBackToTop();
            if (!siteHeader) return;
            const y = window.pageYOffset || document.documentElement.scrollTop;
            if (y > 10) {
                siteHeader.classList.add('is-scrolled');
            } else {
                siteHeader.classList.remove('is-scrolled');
            }
        }
        function onScroll() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    onScrollRaw();
                    ticking = false;
                });
                ticking = true;
            }
        }

        // Initialer Zustand
        onScrollRaw();
        window.addEventListener('scroll', onScroll, { passive: true });

        if (backToTop) {
            backToTop.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Falls Header bereits im DOM ist (Server-seitig eingebettet)
    if (document.readyState !== 'loading') {
        initHeaderEffects();
    } else {
        document.addEventListener('DOMContentLoaded', initHeaderEffects);
    }
    // Nach dynamischem Nachladen (includes.js) Event hören
    document.addEventListener('header-loaded', initHeaderEffects);

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ===== SCROLL FADE-IN ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
        }
    });
}, observerOptions);

// Observe all sections and any element already marked as .fade-in
document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('fade-in')) {
        section.classList.add('fade-in');
    }
    observer.observe(section);
});

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ===== STAGGER ANIMATION FOR CARDS =====
const staggerElements = document.querySelectorAll('.step-card, .service-card, .review-card');
staggerElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
});

// ===== BOX ANIMATION PAUSE ON HOVER =====
const boxInners = document.querySelectorAll('.box .inner');
boxInners.forEach(inner => {
    inner.addEventListener('mouseenter', function() {
        const span = this.querySelector('span');
        if (span) {
            span.style.animationPlayState = 'paused';
        }
    });
    
    inner.addEventListener('mouseleave', function() {
        const span = this.querySelector('span');
        if (span) {
            span.style.animationPlayState = 'running';
        }
    });
});

// ===== SMOOTH ACCORDION TRANSITIONS =====
function initAccordion(selector) {
    document.querySelectorAll(selector).forEach(button => {
        button.addEventListener('click', function() {
            const accordionItem = this.closest('.accordion-item');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Close all other items (optional behavior)
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== accordionItem) {
                    item.classList.remove('active');
                    const hdr = item.querySelector(selector);
                    if (hdr) hdr.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            accordionItem.classList.toggle('active');
            this.setAttribute('aria-expanded', (!isExpanded).toString());
        });
    });
}

// Support both header styles
initAccordion('.accordion-header');
initAccordion('.accordion-toggle');
