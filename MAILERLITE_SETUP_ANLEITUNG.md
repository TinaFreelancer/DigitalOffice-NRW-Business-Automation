# MailerLite Setup-Anleitung für Paket-Formulare

## ✅ Was bereits fertig ist:
- Kontaktformular mit allen Paketen als Dropdown
- API-Integration funktioniert
- Automatische Group-Zuweisung basierend auf Paket-Auswahl
- API-Key ist bereits eingetragen

## 📋 Was du noch tun musst:

### Schritt 1: Groups in MailerLite erstellen

Gehe zu **MailerLite** → **Subscribers** → **Groups** und erstelle folgende Gruppen:

**Webdesign & Entwicklung:**
- Webdesign Basis
- Webdesign Premium
- Website-Pflege & Support

**Newsletter & Marketing:**
- E-Mail Marketing Setup
- Newsletter Marketing & Funnel

**Automatisierung & Technik:**
- Toolheldin: E-Mail Marketing Setup
- Toolheldin: Business-Automation
- Toolheldin: Kombi-Paket

**Kombi-Pakete:**
- Kombi: Starter-Paket
- Kombi: Wachstums-Paket
- Kombi: Premium-Paket

**Sonstige:**
- Erstberatung / Kennenlernen
- Allgemeine Anfrage

### Schritt 2: Group IDs herausfinden

**Methode A: Über die URL (einfachste)**
1. Klicke auf eine Gruppe in MailerLite
2. Schau in die Browser-URL:
   ```
   https://dashboard.mailerlite.com/groups/123456789/subscribers
   ```
3. Die Nummer `123456789` ist die **Group ID**

**Methode B: Über die API**
1. Gehe zu **Developer API** → **API Documentation**
2. Öffne den Endpoint **GET /groups**
3. Klicke "Try it out" → "Execute"
4. Kopiere die IDs aus der Response

### Schritt 3: Group IDs im Code eintragen

Öffne `kontakt/index.html` und suche nach Zeile ~334:

```javascript
groups: {
    'GROUP_ID_WEBDESIGN_BASIS': '123456',           // Ersetze mit echter ID
    'GROUP_ID_WEBDESIGN_PREMIUM': '123457',         // Ersetze mit echter ID
    'GROUP_ID_WEBDESIGN_PFLEGE': '123458',          // Ersetze mit echter ID
    'GROUP_ID_NEWSLETTER_SETUP': '123459',          // usw...
    // ... weitere Groups
}
```

**Beispiel mit echten IDs:**
```javascript
groups: {
    'GROUP_ID_WEBDESIGN_BASIS': '98765432',
    'GROUP_ID_WEBDESIGN_PREMIUM': '98765433',
    'GROUP_ID_WEBDESIGN_PFLEGE': '98765434',
    // ... usw.
}
```

### Schritt 4: Custom Fields in MailerLite anlegen

Gehe zu **Subscribers** → **Fields** und erstelle:

| Feldname | Typ | Beschreibung |
|----------|-----|--------------|
| `paket` | Text | Lesbare Paketbezeichnung (z.B. "Toolheldin: E-Mail Marketing Setup") |
| `paket_key` | Text | Technischer Key (z.B. "toolheldin-email") |
| `nachricht` | Text/Long text | Nachricht des Kontakts |
| `quelle` | Text | Immer "Kontaktformular Website" |

### Schritt 5: Automationen einrichten (Optional)

Für jede Group kannst du jetzt Automationen triggern:

1. Gehe zu **Automations** → **Create automation**
2. Trigger: **Subscriber is added to group** → Wähle die Gruppe
3. Erstelle deine E-Mail-Sequenz:
   - Bestätigungs-E-Mail
   - Paketspezifische Infos
   - Follow-up nach X Tagen
   - etc.

**Beispiel-Automation für "Toolheldin: E-Mail Marketing Setup":**
- Tag 0: Bestätigung + PDF "Was du als Nächstes erwarten kannst"
- Tag 2: Follow-up "Hast du noch Fragen?"
- Tag 7: Fallback wenn keine Antwort

### Schritt 6: Testen

1. Fülle das Kontaktformular aus
2. Wähle ein Paket
3. Absenden
4. Prüfe in MailerLite:
   - Wurde der Kontakt angelegt?
   - Wurde er der richtigen Gruppe zugewiesen?
   - Wurden Custom Fields korrekt gefüllt?
   - Wurde die Automation getriggert?

## 🎯 So funktioniert das System:

1. User wählt Paket im Formular
2. JavaScript liest das `data-group` Attribut der gewählten Option
3. API-Call zu MailerLite mit:
   - E-Mail, Name, Telefon
   - Group ID (automatisch basierend auf Paket)
   - Custom Fields (paket, paket_key, nachricht, quelle)
4. MailerLite:
   - Legt Kontakt an
   - Fügt zu Gruppe hinzu
   - Triggert Automation für diese Gruppe

## 🔍 Debugging / Fehlerbehebung:

**Kontakt wird nicht hinzugefügt:**
- Überprüfe API-Key in Browser-Console
- Schau in Network-Tab nach API-Response
- Prüfe ob Group IDs korrekt sind

**Kontakt kommt in falsche Gruppe:**
- Überprüfe `data-group` Attribute im HTML
- Vergleiche mit `groups` Mapping im JavaScript

**Custom Fields werden nicht gefüllt:**
- Stelle sicher, dass die Fields in MailerLite existieren
- Feldnamen müssen exakt übereinstimmen (Groß-/Kleinschreibung!)

## 📊 Vorteile dieses Systems:

✅ **Automatische Segmentierung** – Jeder Lead landet direkt in der richtigen Gruppe
✅ **Paketspezifische Automationen** – Jede Gruppe kann eigene Follow-up-Sequenz haben
✅ **Saubere Daten** – Paket-Info als Custom Field gespeichert
✅ **Skalierbar** – Neue Pakete = neue Gruppe + neue Option im Dropdown
✅ **DSGVO-konform** – Nur nach Consent-Checkbox wird gesendet

## 🚀 Nächste Schritte:

1. Groups erstellen (15 Min)
2. Group IDs kopieren und eintragen (10 Min)
3. Custom Fields anlegen (5 Min)
4. Testen mit echtem Formular (5 Min)
5. Automationen aufsetzen (je nach Komplexität 30-60 Min pro Paket)

---

**Fragen? Probleme?**
- Browser Console öffnen (F12) und nach Fehlern schauen
- Network Tab → XHR filtern → MailerLite API-Calls prüfen
- MailerLite Support kontaktieren für API-Fragen
