# AI Coding Agent Instructions - WordPress Static Export

## Project Overview
Dies ist ein **statischer WordPress-Export**, der mit dem Plugin "Simply Static" erstellt wurde. Die Website ist ein deutschsprachiges digitales Marketing-Portal für Unternehmer und Selbstständige (digitalofficenrw.com).

**Wichtig:** Dies ist KEIN aktives WordPress-System, sondern eine statische HTML/CSS/JS-Snapshot-Version einer WordPress-Website.

## Architecture & Structure

### Site Type
- **Static HTML Export** von WordPress 6.8.3
- Theme: Thrive Theme (Version 10.8.2)
- Page Builder: Thrive Architect/Visual Editor
- Optimierung: Optimole (Bildoptimierung), WP Fastest Cache

### Directory Structure
```
/                          # Root mit Hauptseiten (index.html)
├── agbs/                  # Rechtliche Seiten (AGB, Impressum, etc.)
├── angebot/               # Service-Angebote
├── kontakt/               # Kontaktseite
├── wp-content/            
│   ├── plugins/           # WordPress Plugins (statisch exportiert)
│   │   ├── thrive-visual-editor/
│   │   ├── optimole-wp/
│   │   └── wordpress-seo/
│   ├── themes/
│   │   └── thrive-theme/
│   └── uploads/           # Medien (Bilder, Fonts, Templates)
├── wp-includes/           # WordPress Core (statisch)
│   ├── blocks/            # Gutenberg Blocks
│   ├── css/
│   └── js/                # JavaScript Libraries
└── sitemap files          # SEO Sitemaps (XML)
```

### HTML-Seiten-Konventionen
- Jede Seite ist eine `index.html` in ihrem Ordner
- URLs: `domain.com/angebot/` → `angebot/index.html`
- Alle Links sind **relative Pfade** (z.B. `./../wp-content/...`)

## Key Technologies & Patterns

### Frontend Framework
- **Thrive Architect** Custom Classes:
  - `tcb-*` = Thrive Content Builder
  - `thrv_*` = Thrive Wrapper Elements
  - `tve_*` = Thrive Visual Editor
- **CSS Custom Properties** für Theming:
  ```css
  --tcb-skin-color-0 bis --tcb-skin-color-32
  --tcb-main-master-h/s/l/a (HSLA Master Colors)
  ```

### Styling System
- **Inline Critical CSS** in `<style>` Tags im `<head>`
- **Data Attributes für Styling**: `[data-css="tve-u-..."]`
- **Responsive Breakpoints**:
  - Desktop: `min-width: 300px`
  - Tablet: `max-width: 1023px`
  - Mobile: `max-width: 767px`

### JavaScript Libraries
- jQuery 3.7.1 + jQuery UI + Migrate
- WordPress Emoji Support
- Optimole Lazy Loading
- Custom Thrive Frontend Scripts

### Image Optimization
Alle Bilder durchlaufen **Optimole CDN**:
```html
https://mlrkphgmmzx5.i.optimole.com/w:auto/h:auto/q:mauto/ig:avif/./wp-content/uploads/...
```

## Development Workflows

### Editing Static HTML Pages
1. **NIEMALS** WordPress-Admin-Pfade erwarten
2. Änderungen direkt in HTML-Dateien
3. CSS in `<style>` Tags oder externe Dateien in `wp-content/themes/`
4. JavaScript in `wp-includes/js/` oder Theme-Ordnern

### Adding New Pages
```bash
# Erstelle Ordner + index.html
mkdir neue-seite
# Kopiere Template von bestehender Seite
cp kontakt/index.html neue-seite/index.html
# Passe Pfade an (./../ für Parent-Verzeichnis)
```

### SEO & Sitemaps
- Hauptsitemap: `sitemap_index.xml`
- Yoast SEO Meta-Tags im `<head>`
- Strukturierte Daten: JSON-LD Schema.org

## Critical Constraints

### Static Site Limitations
- ❌ Keine Backend-Logik (PHP, Datenbank)
- ❌ Keine WordPress-Funktionen (`wp_*` aufrufe)
- ❌ Keine dynamischen Formular-Submissions (nur Client-Side)
- ✅ Alle Inhalte sind pre-rendered HTML
- ✅ JavaScript für Interaktivität (Accordion, Forms)

### Link-Referenzen
- Verwende **relative Pfade**: `./` oder `./../`
- NICHT: Absolute URLs wie `https://domain.com/...`
- Beispiel: `<link href="./../wp-content/themes/thrive-theme/style.css">`

### Formular-Handling
Lead-Generierungs-Formulare verwenden:
- Klasse: `.thrv_lead_generation`
- AJAX-Submissions zu `/wp-admin/admin-ajax.php` (nicht funktionsfähig im Static Export)
- **Hinweis:** Formulare benötigen Backend-Reintegration oder Service wie Formspree

## Thrive-Specific Patterns

### Responsive Layouts
```html
<!-- Flex Row System -->
<div class="tcb-flex-row tcb--cols--2">
  <div class="tcb-flex-col">
    <div class="tcb-col">...</div>
  </div>
</div>
```

### Toggle/Accordion Components
```html
<div class="thrv_toggle" data-css="tve-u-...">
  <div class="thrv_toggle_item">
    <div class="thrv_toggle_title">...</div>
    <div class="tve_faqC">...</div>
  </div>
</div>
```

### Custom Colors
```css
/* Lokale Farbvariablen */
--tcb-local-color-xxxxx: rgb(...);
/* Skin Colors mit Fallback */
color: var(--tcb-skin-color-4);
```

## Common Tasks

### Update Text Content
1. Suche nach Text in `index.html`-Dateien
2. Ändere innerhalb von `<p>`, `<h*>`, oder `.tcb-plain-text`
3. Beachte `data-css` Attribute für Styling

### Add/Modify Images
1. Upload zu `wp-content/uploads/`
2. Verwende **keine** Optimole-URLs in lokalem Code
3. Referenz: `./wp-content/uploads/dein-bild.jpg`

### Customize Styling
1. Finde `[data-css="tve-u-XXXXXXX"]` Element
2. Ändere Inline-Styles in `<style class="tve_custom_style">`
3. Nutze CSS Custom Properties für konsistente Themes

## Testing & Validation

### Local Testing
```bash
# Simple HTTP Server
python -m http.server 8000
# oder
npx serve .
```

### Accessibility Checks
- Yoast SEO Meta vorhanden
- Strukturierte Daten validieren
- Responsive auf 3 Breakpoints testen

## File Modification Guidelines

### Do NOT Edit
- `/wp-includes/` Core-Dateien
- `/wp-content/plugins/` Plugin-Dateien
- Minified `.min.js` oder `.min.css` Dateien

### Safe to Edit
- `index.html` in Seiten-Ordnern
- `<style class="tve_custom_style">` Blocks
- `wp-content/uploads/` (eigene Medien)

## Deployment
Dieser Static Export kann deployed werden zu:
- GitHub Pages
- Netlify / Vercel
- S3 + CloudFront
- Jeder Static File Hosting Service

**Keine** PHP/MySQL-Anforderungen!

---

**Hinweise für AI:**
- Behandle dies als statische Website, nicht als WordPress
- Alle "WordPress-Features" sind pre-rendered HTML
- Pfade sind relativ, nicht absolut
- Formulare benötigen externe Services für Submissions
