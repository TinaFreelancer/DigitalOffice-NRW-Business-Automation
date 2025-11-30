# MailerLite Integration Test-Protokoll

**Datum:** 29. November 2025  
**Test-URL:** http://localhost:8080/kontakt/index.html

## Vorbereitung

### API-Konfiguration
- ✅ API Key vorhanden und aktiv
- ✅ 9 Gruppen konfiguriert (Website to go, Onepager to go, Newsletter Kickstart, Newsletter Abo, Newsletter einrichten, Automatisierung, Kombi Starter, Kombi Profi, Allgemein)
- ✅ Custom Fields erforderlich: `paket`, `paket_key`, `nachricht`, `quelle`

### Zu testende Dropdown-Optionen
1. **Website to go** → Group ID: `171127365471044985`
2. **Newsletter Kickstart** → Group ID: `171127394964342547`
3. **Kombi Starter** → Group ID: `171127309429901142`
4. **Allgemeine Anfrage** → Group ID: `172245375343658156`

---

## Test-Durchläufe

### Test 1: Website to go
**E-Mail:** `test-wtg@digitalofficenrw-probe.com`  
**Zeitstempel:** [PENDING]

**Formular-Daten:**
- Name: `Test Website to go`
- E-Mail: `test-wtg@digitalofficenrw-probe.com`
- Telefon: `+49 1234 567890`
- Paket: `Website to go`
- Nachricht: `Test-Eintrag für Website to go Paket - Automation-Trigger-Prüfung`
- Consent: ✅

**Erwartetes Ergebnis:**
- HTTP 200/201 von MailerLite API
- Subscriber in Gruppe `171127365471044985` (Website to go)
- Custom Fields: `paket="Website to go"`, `paket_key="website-to-go"`, `nachricht=<text>`, `quelle="Kontaktformular Website"`
- Automation "Website to go Welcome" startet

**Tatsächliches Ergebnis:**
[WIRD GETESTET]

---

### Test 2: Newsletter Kickstart
**E-Mail:** `test-nk@digitalofficenrw-probe.com`  
**Zeitstempel:** [PENDING]

**Formular-Daten:**
- Name: `Test Newsletter Kickstart`
- E-Mail: `test-nk@digitalofficenrw-probe.com`
- Telefon: `+49 9876 543210`
- Paket: `Newsletter Kickstart`
- Nachricht: `Test-Eintrag für Newsletter Kickstart - Automation-Check`
- Consent: ✅

**Erwartetes Ergebnis:**
- HTTP 200/201
- Subscriber in Gruppe `171127394964342547` (Newsletter Kickstart)
- Custom Fields korrekt befüllt
- Automation "Newsletter Kickstart Onboarding" startet

**Tatsächliches Ergebnis:**
[WIRD GETESTET]

---

### Test 3: Kombi Starter
**E-Mail:** `test-kombi@digitalofficenrw-probe.com`  
**Zeitstempel:** [PENDING]

**Formular-Daten:**
- Name: `Test Kombi Starter`
- E-Mail: `test-kombi@digitalofficenrw-probe.com`
- Telefon: leer
- Paket: `Kombi: All in One Starter`
- Nachricht: `Kombiniertes Paket Test - alle Features prüfen`
- Consent: ✅

**Erwartetes Ergebnis:**
- HTTP 200/201
- Subscriber in Gruppe `171127309429901142` (Kombi Starter)
- Custom Fields: `paket="Kombi: All in One Starter"`, `paket_key="kombi-starter"`
- Automation "Kombi Starter Journey" startet

**Tatsächliches Ergebnis:**
[WIRD GETESTET]

---

### Test 4: Allgemeine Anfrage
**E-Mail:** `test-allgemein@digitalofficenrw-probe.com`  
**Zeitstempel:** [PENDING]

**Formular-Daten:**
- Name: `Test Allgemein`
- E-Mail: `test-allgemein@digitalofficenrw-probe.com`
- Telefon: `+49 555 123456`
- Paket: `Allgemeine Anfrage`
- Nachricht: `Unspezifische Anfrage - Basis-Automation testen`
- Consent: ✅

**Erwartetes Ergebnis:**
- HTTP 200/201
- Subscriber in Gruppe `172245375343658156` (Allgemein)
- Automation "General Inquiry Follow-up" startet (falls konfiguriert)

**Tatsächliches Ergebnis:**
[WIRD GETESTET]

---

## Browser DevTools Prüfungen

### Network Tab
- [ ] POST zu `https://connect.mailerlite.com/api/subscribers` sichtbar
- [ ] Status Code: 200 oder 201
- [ ] Request Headers: `Authorization: Bearer <API_KEY>`, `Content-Type: application/json`
- [ ] Request Payload: `groups: [<group_id>]`, `fields: {paket, paket_key, nachricht, quelle}`
- [ ] Response: Subscriber-Objekt mit ID

### Console Tab
- [ ] Keine JavaScript-Fehler
- [ ] `console.log('MailerLite Success:', ...)` erscheint bei Erfolg
- [ ] Bei Fehler: `console.error('MailerLite Error:', ...)` mit Details

---

## MailerLite Dashboard Prüfungen

### Subscribers → Recent Activity
- [ ] Alle 4 Test-Subscriber vorhanden
- [ ] Korrekte Gruppenzuweisung
- [ ] Custom Fields korrekt befüllt (`paket`, `paket_key`, `nachricht`, `quelle`)

### Automations → Activity
- [ ] Für jede Gruppe: Automation gestartet
- [ ] Startzeit ≈ Submit-Zeitpunkt
- [ ] Status: "Active" oder "Completed" (je nach Automation-Länge)

---

## Edge Cases

### Test 5: Ohne Consent
**Erwartung:** Formular blockiert, Fehlermeldung erscheint  
**Ergebnis:** [WIRD GETESTET]

### Test 6: Ungültige E-Mail
**Input:** `test@ungueltig`  
**Erwartung:** Validierung blockiert, Fehlermeldung  
**Ergebnis:** [WIRD GETESTET]

### Test 7: Double Opt-In (falls aktiviert)
**Erwartung:** Bestätigungs-E-Mail → nach Bestätigung startet Automation  
**Ergebnis:** [WIRD GETESTET - PRÜFE MAILERLITE EINSTELLUNGEN]

---

## PowerShell API-Test (Gegenprobe)

```powershell
# Test: Direkter API-Call für "Website to go"
$apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9..."
$groupId = "171127365471044985"

$body = @{
  email = "api-probe-wtg@test.local"
  fields = @{
    name = "API Direct Test"
    paket = "Website to go"
    paket_key = "website-to-go"
    nachricht = "Direkter API-Test ohne Frontend"
    quelle = "PowerShell API Test"
  }
  groups = @($groupId)
} | ConvertTo-Json

$response = Invoke-RestMethod -Method Post `
  -Uri "https://connect.mailerlite.com/api/subscribers" `
  -Headers @{
    "Authorization" = "Bearer $apiKey"
    "Content-Type" = "application/json"
    "Accept" = "application/json"
  } `
  -Body $body

$response | ConvertTo-Json -Depth 5
```

**Ergebnis:** [WIRD AUSGEFÜHRT]

---

## Zusammenfassung & Empfehlungen

### Funktioniert ✅
[NACH TESTS BEFÜLLEN]

### Probleme ❌
[NACH TESTS BEFÜLLEN]

### Nächste Schritte
1. MailerLite Custom Fields prüfen: Existieren `paket`, `paket_key`, `nachricht`, `quelle`?
2. Automations konfigurieren: Trigger "On join group: <Gruppenname>"
3. Double Opt-In Einstellungen prüfen
4. Produktiv-Test mit echter E-Mail-Adresse
