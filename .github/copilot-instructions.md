# AI Coding Agent Instructions – Static WordPress Export

## Essentials
- Statische HTML/CSS/JS-Snapshot-Site (Simply Static Export), kein PHP/DB, kein `/wp-admin`; alles ist pre-rendered Content. Theme: Thrive Theme 10.8.2, Builder: Thrive Architect, Optimierungen: Optimole CDN, WP Fastest Cache.
- Arbeitsdomain: digitalofficenrw.com; Code liegt als statischer Export, siehe [README.md](README.md).
- Pfade immer relativ halten (`./` oder `./../`); jede Seite ist eine `index.html` im eigenen Ordner (z. B. `angebot/index.html`).

## Struktur & wichtige Orte
- Seiten & Rechtliches: `index.html`, `angebot/`, `agbs/`, `kontakt/`, `impressum/`, `privacy-policy/` etc.
- Theme/Assets: `css/style.css`, `assets/js/*.js` (u. a. `perf.js` für Lazy-/Deferred-Loading, `features.js`/`includes.js`/`main.js` für UI), Bilder unter `assets/images/` und `wp-content/uploads/`.
- WordPress Core/Plugins sind nur statische Artefakte (`wp-includes/`, `wp-content/plugins/`); nicht anfassen.
- MailerLite Doku/Prozesse: `MAILERLITE_SETUP_ANLEITUNG.md`, `MAILERLITE_TEST_ANLEITUNG.md`, `MAILERLITE_TEST_PROTOKOLL.md`, `MAILERLITE_DIAGNOSE.md`.

## Bearbeitungskonventionen
- HTML direkt editieren; häufige Klassen/Patterns aus Thrive: `tcb-*`, `thrv_*`, `tve_*`, Toggle (`thrv_toggle` → `thrv_toggle_item`), Flex Rows (`tcb-flex-row` + `tcb-flex-col`).
- CSS anpassen in `css/style.css` oder in inline `<style class="tve_custom_style">`; nutze vorhandene Custom Properties (`--tcb-skin-color-*`, `--tcb-main-master-*`).
- JavaScript nur in projekt-eigenen Dateien (`assets/js/*.js`); keine Änderungen in minifizierten oder exportierten WP-Core/Plugin-Dateien.
- Bilder lokal referenzieren (nicht die Optimole-CDN-Links verwenden); Dimensionen (`width`/`height` oder `aspect-ratio`) und Lazy-Loading beachten.

## Performance/SEO-Hinweise (siehe [README.md](README.md#L1-L86))
- Kritische Hero-Bilder: feste Dimensionen + `fetchpriority="high"`, `decoding="async"`, kein Lazy Loading.
- Skripte: nicht-kritische mit `defer`; neue Third-Party-Skripte über den Lazy-Loader in `assets/js/perf.js` integrieren.
- Bildoptimierung: WebP/AVIF-Rollout offen; PowerShell-Helfer `scripts/convert-images.ps1` vorhanden.
- SEO: Yoast-Meta im `<head>`, strukturierte Daten bereits getrennt (WebPage, Breadcrumb). Sitemap unter `sitemap.xml`; kanonische URLs absolut halten.
- Cache Busting: Bei Änderungen an `css/style.css` oder JS nach Möglichkeit Dateinamen versionieren (z. B. `style.20251201.css`) und Referenzen anpassen.

## Formulare
- Lead-Formulare sind statische Thrive-Formulare (`.thrv_lead_generation`) und posten eigentlich gegen `/wp-admin/admin-ajax.php` (hier wirkungslos). Für Funktionalität externen Dienst (z. B. Formspree) hinterlegen und Action/JS anpassen.

## Tests & Lokaler Betrieb
- Lokaler Server: `python -m http.server 8000` oder `npx serve .` (siehe [README.md](README.md#L1-L86)); öffne `http://localhost:8000`.
- Lighthouse lokal möglich: `npx lighthouse http://localhost:8000 --only-categories=performance,accessibility --view`.
- Manuelles Lazy-Load-Debugging: In der Browser-Konsole `loadTestimonials()` triggert Elfsight-Reviews sofort (siehe `assets/js/perf.js`).

## Tabuzonen
- Keine Änderungen in `wp-includes/`, `wp-content/plugins/`, minifizierten `.min.js/.min.css`, oder generierten Sitemap-Dateien.
- Keine absoluten internen Links schreiben; keine WordPress-PHP-Funktionen nutzen.

## Neue Seiten
- Ordner + `index.html` von einer bestehenden Seite kopieren (z. B. `kontakt/index.html`), Pfade anpassen, Canonical/Sitemap/Structured Data prüfen.

## Deployment
- Statisches Hosting (GitHub Pages, Netlify, Vercel, S3/CloudFront); API-Keys (z. B. MailerLite) werden nicht versioniert und müssen nach Deployment manuell gesetzt werden.
