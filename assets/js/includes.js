// Load Header and Footer dynamically
function loadIncludes() {
    // Berechne den richtigen relativen Pfad basierend auf der aktuellen Seitenstruktur
    const pathDepth = (window.location.pathname.match(/\//g) || []).length - 1;
    const basePath = pathDepth > 0 ? '../'.repeat(pathDepth) : './';
    
    // Load Header
    fetch(`${basePath}includes/header.html`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                // Set active menu item based on current page
                setActiveMenuItem();
                // Initialize mobile menu toggle
                initMobileMenu();
                // Custom Event für nachgeladene Header-Initialisierung
                document.dispatchEvent(new Event('header-loaded'));
                // Performance: Preconnect zu Optimole CDN
                addPreconnect('https://mlrkphgmmzx5.i.optimole.com');
                // Performance: Perf-Skript einmalig laden
                loadPerfScriptOnce();
            }
        })
        .catch(err => console.error('Header konnte nicht geladen werden:', err));

    // Load Footer
    fetch(`${basePath}includes/footer.html`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = data;
                // Event auslösen nach Footer-Laden für URL-Normalisierung
                document.dispatchEvent(new Event('footer-loaded'));
            }
        })
        .catch(err => console.error('Footer konnte nicht geladen werden:', err));
}

// Set active menu item based on current URL
function setActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.nav-menu > li');
    
    menuItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && link.getAttribute('href') === currentPath) {
            item.classList.add('active');
        }
    });
}

// Initialize mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.main-nav')) {
                navMenu.classList.remove('active');
            }
        });
        
        // Handle dropdown on mobile
        const dropdownToggles = document.querySelectorAll('.has-dropdown > a');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth < 768) {
                    e.preventDefault();
                    toggle.parentElement.classList.toggle('active');
                }
            });
        });
    }
}

// Keyboard Accessibility for Dropdowns
function initDropdownKeyboardUX() {
    const dropdownParents = document.querySelectorAll('.has-dropdown');
    dropdownParents.forEach(parent => {
        const trigger = parent.querySelector('a[aria-haspopup="true"]');
        const submenu = parent.querySelector('.dropdown');
        if (!trigger || !submenu) return;

        // Open on focus
        trigger.addEventListener('focus', () => {
            parent.classList.add('active');
            trigger.setAttribute('aria-expanded', 'true');
        });

        // Close on blur (delay to allow focus into submenu)
        trigger.addEventListener('blur', () => {
            setTimeout(() => {
                if (!parent.contains(document.activeElement)) {
                    parent.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                }
            }, 100);
        });

        // Close on Escape
        parent.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                parent.classList.remove('active');
                trigger.setAttribute('aria-expanded', 'false');
                trigger.focus();
            }
        });

        // Allow arrow down to move into submenu
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const firstItem = submenu.querySelector('a');
                if (firstItem) firstItem.focus();
            }
        });
    });
}

// Add preconnect link to head if not present
function addPreconnect(href) {
    const head = document.head;
    if (!head) return;
    const existing = head.querySelector(`link[rel="preconnect"][href="${href}"]`);
    if (existing) return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = href;
    link.crossOrigin = '';
    head.appendChild(link);
}

// Dynamically load perf.js once
function loadPerfScriptOnce() {
    if (window.__perfScriptLoaded) return;
    window.__perfScriptLoaded = true;
    const script = document.createElement('script');
    script.src = './assets/js/perf.js';
    script.defer = true;
    document.head.appendChild(script);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        loadIncludes();
        // init after header is injected
        document.addEventListener('header-loaded', () => {
            initDropdownKeyboardUX();
        });
    });
} else {
    loadIncludes();
    document.addEventListener('header-loaded', () => {
        initDropdownKeyboardUX();
    });
}

