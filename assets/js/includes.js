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

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIncludes);
} else {
    loadIncludes();
}

