# Digital Office NRW - Statische Website

Professionelle statische Website für digitales Marketing und Business Automation.

## Deployment auf GitHub Pages

Diese Website ist optimiert für GitHub Pages Hosting.

### Technologien
- Statischer HTML/CSS/JS Export
- Responsive Design (Mobile-First)
- MailerLite Integration für Lead-Generierung
- SEO-optimiert mit Sitemaps

### Lokale Entwicklung
```bash
# Einfacher lokaler Server
python -m http.server 8000
# Oder
npx serve .
```

Dann öffne: `http://localhost:8000`

### Live-Website
https://digitalofficenrw.com

---

**Hinweis:** Die MailerLite API-Konfiguration ist aus Sicherheitsgründen nicht im Repository enthalten. Nach dem Deployment muss der API-Key manuell ergänzt werden.

---

## Performance & Optimierungs-Checkliste (Stand 2025-12-01)

### Bereits umgesetzt
- Kritische Hero-Bilder: `fetchpriority="high"`, `loading="eager"`, `decoding="async"`, feste Breiten/Höhen zur Vermeidung von Layout Shift.
- Dritter Anbieter (Elfsight Reviews): Lazy Load via `IntersectionObserver` + Fallback (Idle, Scroll, Interaktion) in `assets/js/perf.js`.
- Einheitliche Skript-Ladereihenfolge: Alle nicht-kritischen Skripte mit `defer`.
- Font Loading: Nicht-blockierend (Print-Swap Pattern) + `preconnect`.
- Bild-Optimierung Basis: Lazy Loading für nicht kritische Bilder, automatische `decoding="async"` Vergabe.
- Browser Caching: `.htaccess` mit langem Cache (1 Jahr, immutable) für Assets und kurzem Cache für HTML (10 Min.). ETag entfernt für konsistente Invalidierung.
- Strukturierte Daten: Getrennte JSON-LD Blöcke (WebPage, BreadcrumbList) mit absoluten URLs.
- Sitemap: Alle `loc` und Bildpfade absolut + fehlerhafte Einträge entfernt.
- Kontrast: Primärfarbe abgedunkelt; Buttons mit hoher Lesbarkeit und verbesserter Fokus-Darstellung.

### Nächste optionale Schritte
- WebP/AVIF Rollout finalisieren: Verbleibende PNG/JPG manuell konvertieren (Script vorhanden unter `scripts/convert-images.ps1`).
- CSS/JS Minifizierung: Manuell über Build-Schritt (z. B. `npx lightningcss` / `esbuild`); Ergebnis-Dateien versionieren (Dateiname mit Hash) für Cache Busting.
- Kritische CSS Inline: Kleinsten Above-the-fold Teil extrahieren und inline ins `<head>`; restliche CSS per Preload + Media Swap laden.
- HTTP/2 Push / Early Hints: Falls Server unterstützt, Early Hints für Hero-Bild und Haupt-CSS setzen.
- Security/Privacy: CSP Header für Skript-Whitelisting (Beispiel: `Content-Security-Policy: default-src 'self'; img-src 'self' https://elfsightcdn.com https://fonts.gstatic.com data:; script-src 'self' https://elfsightcdn.com` … anpassen).
- Accessibility vertiefen: Skip-Link Testing auf Mobile, ARIA für komplexe Komponenten (Accordion/Toggle) ergänzen, Farbkontrast re-test bei zukünftigen Branding-Änderungen.
- Build Automatisierung: Kleines Node-Skript für Bildprüfung + fehlende `width/height` Warnungen.
- Core Web Vitals Monitoring: Regelmäßig Lighthouse (Desktop/Mobile) + ggf. Web Vitals Library einbinden für RUM (Real User Monitoring).

### Best Practices bei neuen Seiten
- Hero-Bild: Direkt mit festen Dimensionen + `fetchpriority="high"` + `decoding="async"` + kein Lazy Loading.
- Neue Drittanbieter-Skripte: Niemals direkt im HTML laden – stattdessen Lazy Loader Hook in `perf.js` erweitern.
- Bilder im Content: Immer feste `width` und `height` oder `aspect-ratio`, `loading="lazy"` wenn nicht sichtbar beim Start.
- Interaktive Komponenten: Keyboard-Fokus und ARIA-Rollen sofort einbauen.
- Sitemap & Canonical: Neue Seite mit absoluter Canonical-URL pflegen; Sitemap-Eintrag aktualisieren (falls manuell geführt).

### Asset Versionierung (Cache Busting)
Bei Änderungen an `css/style.css` oder JS-Dateien: Dateinamen mit Hash versehen (z. B. `style.20251201.css`) und im HTML aktualisieren. So kann `Cache-Control: immutable` voll genutzt werden. Alternativ Query-Parameter (`style.css?v=20251201`) – weniger optimal, aber akzeptabel, falls Renaming nicht gewünscht.

### Lokales Testen der Optimierungen
```bash
# Lighthouse lokal (Beispiel mit Chrome installiert)
npx lighthouse http://localhost:8000 --only-categories=performance,accessibility --view
```

### Manuelle Trigger für Reviews (Debug)
Im Browser-Konsole: `loadTestimonials()` führt sofort das Laden des Elfsight-Skripts aus.

### Wartungsintervall Empfehlung
- Monatlich: Lighthouse + Kontrast-Check + Broken Links.
- Vierteljährlich: Sitemap Validierung, Structured Data Testing (Search Console / Rich Results Test).
- Halbjährlich: Abhängigkeiten & Drittanbieter Skripte prüfen (Version & Performance Auswirkung).

---

Letzte Aktualisierung der Optimierungs-Dokumentation: 2025-12-01.
