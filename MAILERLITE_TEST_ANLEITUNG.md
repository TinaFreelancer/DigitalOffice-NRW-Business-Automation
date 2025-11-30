# MailerLite Integration - Test-Anleitung

## 🎯 Ziel
Sicherstellen, dass das Kontaktformular korrekt mit MailerLite kommuniziert und die richtigen Automationen ausgelöst werden.

---

## 📋 Vorbereitung

### 1. MailerLite Custom Fields prüfen
Gehe zu **MailerLite Dashboard → Subscribers → Fields** und stelle sicher, dass folgende Custom Fields existieren:

- ✅ `paket` (Type: Text)
- ✅ `paket_key` (Type: Text)
- ✅ `nachricht` (Type: Text)
- ✅ `quelle` (Type: Text)

**Falls nicht vorhanden:** Erstelle sie mit "Add Field" → Type: Text.

### 2. Automations einrichten
Für jede Gruppe sollte eine Automation existieren mit Trigger:

**Automations → Create Automation → Trigger: "Subscriber joins a group"**

Beispiel-Automationen:
- "Website to go Welcome" → Trigger: Group "Website to go"
- "Newsletter Kickstart Onboarding" → Trigger: Group "Newsletter Kickstart"
- "Kombi Starter Journey" → Trigger: Group "Kombi Starter"
- usw.

### 3. Double Opt-In Einstellungen prüfen
**Settings → Forms → Double Opt-In**

- ✅ Aktiviert: Subscriber muss E-Mail bestätigen → Automation startet NACH Bestätigung
- ❌ Deaktiviert: Automation startet sofort

---

## 🧪 Test-Methoden

### Methode 1: Manuelle Formular-Tests (empfohlen)

#### Schritt 1: Website öffnen
1. Öffne PowerShell im Projektordner:
   ```powershell
   cd "c:\Users\Suppo\Downloads\simply-static-1-1763196913"
   python -m http.server 8080
   ```

2. Öffne im Browser: `http://localhost:8080/kontakt/`

#### Schritt 2: Browser DevTools öffnen
**F12 drücken** → Tabs:
- **Network**: Zeigt API-Requests
- **Console**: Zeigt JavaScript-Logs

#### Schritt 3: Formular ausfüllen & absenden

**Test 1: Website to go**
- Name: `Test Website`
- E-Mail: `deinname+wtg@gmail.com` (Gmail Alias für eindeutige Tests)
- Telefon: `+49 1234 567890`
- Paket: **Website to go**
- Nachricht: `Test für Website to go Automation`
- Consent: ✅
- **Absenden**

**Was du sehen solltest:**
1. **Network Tab**: 
   - Request zu `https://connect.mailerlite.com/api/subscribers`
   - Status: `201 Created` oder `200 OK`
   - Response: JSON mit `data.id` (Subscriber ID)

2. **Console Tab**:
   - `MailerLite Success: {data: {...}}`
   - **KEINE** roten Fehler

3. **Formular**:
   - Grüne Erfolgsmeldung: "✓ Danke für deine Nachricht!"
   - Formular wird zurückgesetzt

#### Schritt 4: MailerLite prüfen

**Subscribers → Recent Activity**
- Neuer Subscriber: `deinname+wtg@gmail.com`
- Group: **Website to go** (171127365471044985)
- Custom Fields:
  - `paket`: "Website to go"
  - `paket_key`: "website-to-go"
  - `nachricht`: "Test für Website to go Automation"
  - `quelle`: "Kontaktformular Website"

**Automations → Activity**
- Automation für "Website to go" gestartet
- Status: "Active" oder "Completed"
- Subscriber: `deinname+wtg@gmail.com`

#### Weitere Tests
Wiederhole mit anderen Paketen:
- `deinname+nk@gmail.com` → **Newsletter Kickstart**
- `deinname+kombi@gmail.com` → **Kombi Starter**
- `deinname+allg@gmail.com` → **Allgemeine Anfrage**

---

### Methode 2: PowerShell API-Tests (technische Validierung)

#### Einzelner Test-Request

```powershell
# Kopiere diesen Code in PowerShell

$apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNWYwOTU0ZWQzN2QzNmQ0MDYyNTRkOTk4NDU1MTJkYTlhN2QzZWY0MDFhNTgxNzcxMjIyY2JlMDA5MWY5NGU5YjM3ZGIzYWFlODhjMDlkYjYiLCJpYXQiOjE3NjQyNjM3ODEuMzU3NDU3LCJuYmYiOjE3NjQyNjM3ODEuMzU3NDYsImV4cCI6NDkxOTkzNzM4MS4zNDk2MDEsInN1YiI6IjE5MDk2NTEiLCJzY29wZXMiOltdfQ.kxDY-gYnlrlrQ-5ZjYNu1la_KiMwPzkmz_AY7U9n6JhyGqtKbtDwIJfQiiOpETiQZ3ZwFlTHxYZFQyGD_XZSAaRJGEhK1UDmQGRfBn2T0lGLu6os6elzVu8JYsvFpjx2kCIlNYPTHKyqMbfGjiwKKstn6IiASjPPyNkZja_dYZhkPBt571X36p73l72gVvNA5M5-flJOOUf7Zpb13EXbg6JpFNdbZRRMeVQPFB0Ukra42am7FNVJU0KbRrkxv37aV-g4TmHSo6NMT7KdLL5YdS9zKuYExLfFxP0Jvd8psbQNa7-7oOaYBlJ1mF3YZmZoMOZ_O0P5QobJpDquQJfAbYnXowl2E4njgs3sd4JT5bG4beFfOizLXOPzAfK_MyluNBxQQJHSTcde_mGg4snv9uZENblDJxXCJVUdIKnaSqxbcjez566p6afxWv1oUkHilQVJCoD3yq3KOtIIiP6j-p3yiARhwBb3pNG1QtIXeXOBc-H_076E-d9d8hM5Fk4mn2QH32QD5upJR4v5aTerdUj88Dw0xSEBI7hqdFBr0vAVD4Gro_Jl9qNg7HLOLY1keRTx67SNM5TkZqTRsOKGNgFZhFRj6DCjS7Pqyx1sL9Wpc26nJcR7mLWGbVXwByXJNDpc6iPclsGxNDpBfq74pLf7DEpEjF9O2bIGM0wN7Jg"

# Test: Website to go
$groupId = "171127365471044985"
$body = @{
  email = "api-test-wtg@probe.test"
  fields = @{
    name = "API Test Website"
    phone = "+49 1234 567890"
    paket = "Website to go"
    paket_key = "website-to-go"
    nachricht = "API Test für Website to go"
    quelle = "PowerShell API Test"
  }
  groups = @($groupId)
} | ConvertTo-Json -Depth 5

Write-Host "=== TEST: Website to go ===" -ForegroundColor Cyan
Write-Host "Sende Request..." -ForegroundColor Yellow

try {
  $response = Invoke-RestMethod -Method Post `
    -Uri "https://connect.mailerlite.com/api/subscribers" `
    -Headers @{
      "Authorization" = "Bearer $apiKey"
      "Content-Type" = "application/json"
      "Accept" = "application/json"
    } `
    -Body $body
  
  Write-Host "`n✓ ERFOLG!" -ForegroundColor Green
  Write-Host "Subscriber ID: $($response.data.id)"
  Write-Host "Email: $($response.data.email)"
  Write-Host "Status: $($response.data.status)"
  Write-Host "Groups: $($response.data.groups -join ', ')"
  
  Write-Host "`n>>> Prüfe jetzt MailerLite:" -ForegroundColor Yellow
  Write-Host "1. Subscribers → Suche: api-test-wtg@probe.test"
  Write-Host "2. Automations → Activity → Website to go"
  
} catch {
  Write-Host "`n✗ FEHLER!" -ForegroundColor Red
  Write-Host $_.Exception.Message
  if ($_.ErrorDetails.Message) {
    $error = $_.ErrorDetails.Message | ConvertFrom-Json
    Write-Host "Message: $($error.message)" -ForegroundColor Red
  }
}
```

#### Alle Pakete auf einmal testen

```powershell
# Kopiere diesen Code in PowerShell

$apiKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNWYwOTU0ZWQzN2QzNmQ0MDYyNTRkOTk4NDU1MTJkYTlhN2QzZWY0MDFhNTgxNzcxMjIyY2JlMDA5MWY5NGU5YjM3ZGIzYWFlODhjMDlkYjYiLCJpYXQiOjE3NjQyNjM3ODEuMzU3NDU3LCJuYmYiOjE3NjQyNjM3ODEuMzU3NDYsImV4cCI6NDkxOTkzNzM4MS4zNDk2MDEsInN1YiI6IjE5MDk2NTEiLCJzY29wZXMiOltdfQ.kxDY-gYnlrlrQ-5ZjYNu1la_KiMwPzkmz_AY7U9n6JhyGqtKbtDwIJfQiiOpETiQZ3ZwFlTHxYZFQyGD_XZSAaRJGEhK1UDmQGRfBn2T0lGLu6os6elzVu8JYsvFpjx2kCIlNYPTHKyqMbfGjiwKKstn6IiASjPPyNkZja_dYZhkPBt571X36p73l72gVvNA5M5-flJOOUf7Zpb13EXbg6JpFNdbZRRMeVQPFB0Ukra42am7FNVJU0KbRrkxv37aV-g4TmHSo6NMT7KdLL5YdS9zKuYExLfFxP0Jvd8psbQNa7-7oOaYBlJ1mF3YZmZoMOZ_O0P5QobJpDquQJfAbYnXowl2E4njgs3sd4JT5bG4beFfOizLXOPzAfK_MyluNBxQQJHSTcde_mGg4snv9uZENblDJxXCJVUdIKnaSqxbcjez566p6afxWv1oUkHilQVJCoD3yq3KOtIIiP6j-p3yiARhwBb3pNG1QtIXeXOBc-H_076E-d9d8hM5Fk4mn2QH32QD5upJR4v5aTerdUj88Dw0xSEBI7hqdFBr0vAVD4Gro_Jl9qNg7HLOLY1keRTx67SNM5TkZqTRsOKGNgFZhFRj6DCjS7Pqyx1sL9Wpc26nJcR7mLWGbVXwByXJNDpc6iPclsGxNDpBfq74pLf7DEpEjF9O2bIGM0wN7Jg"

$tests = @(
  @{Name="Website to go"; Email="api-wtg@test.local"; GroupId="171127365471044985"; Paket="Website to go"; Key="website-to-go"},
  @{Name="Onepager to go"; Email="api-op@test.local"; GroupId="170209900406769468"; Paket="Onepager to go"; Key="onepager-to-go"},
  @{Name="Newsletter Kickstart"; Email="api-nk@test.local"; GroupId="171127394964342547"; Paket="Newsletter Kickstart"; Key="newsletter-kickstart"},
  @{Name="Newsletter Abo"; Email="api-nabo@test.local"; GroupId="171127404342805611"; Paket="Abo Newsletter Premium"; Key="newsletter-abo"},
  @{Name="E-Mail Marketing Setup"; Email="api-em@test.local"; GroupId="171127269627004910"; Paket="E-Mail Marketing Setup"; Key="newsletter-einrichten"},
  @{Name="Business-Automation"; Email="api-auto@test.local"; GroupId="171127288491935656"; Paket="Business-Automation"; Key="automatisierung"},
  @{Name="Kombi Starter"; Email="api-ks@test.local"; GroupId="171127309429901142"; Paket="Kombi: All in One Starter"; Key="kombi-starter"},
  @{Name="Kombi Profi"; Email="api-kp@test.local"; GroupId="171127343124842340"; Paket="Kombi: Website Funnel E-Mail"; Key="kombi-profi"},
  @{Name="Allgemein"; Email="api-allg@test.local"; GroupId="172245375343658156"; Paket="Allgemeine Anfrage"; Key="allgemein"}
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   MAILERLITE INTEGRATION TEST SUITE   " -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$results = @()

foreach ($test in $tests) {
  Write-Host ">>> $($test.Name)" -ForegroundColor Yellow
  
  $body = @{
    email = $test.Email
    fields = @{
      name = "Test $($test.Name)"
      phone = "+49 1234 567890"
      paket = $test.Paket
      paket_key = $test.Key
      nachricht = "Automatischer Test für $($test.Name)"
      quelle = "PowerShell API Test Suite"
    }
    groups = @($test.GroupId)
  } | ConvertTo-Json -Depth 5
  
  try {
    $response = Invoke-RestMethod -Method Post `
      -Uri "https://connect.mailerlite.com/api/subscribers" `
      -Headers @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
      } `
      -Body $body
    
    Write-Host "  ✓ ID: $($response.data.id) | Status: $($response.data.status)" -ForegroundColor Green
    $results += @{Test=$test.Name; Status="✓ Erfolg"; ID=$response.data.id}
    
  } catch {
    $errorMsg = if ($_.ErrorDetails.Message) { 
      ($_.ErrorDetails.Message | ConvertFrom-Json).message 
    } else { 
      $_.Exception.Message 
    }
    Write-Host "  ✗ Fehler: $errorMsg" -ForegroundColor Red
    $results += @{Test=$test.Name; Status="✗ Fehler"; ID=$errorMsg}
  }
  
  Start-Sleep -Milliseconds 500
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST ZUSAMMENFASSUNG   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$results | ForEach-Object {
  $color = if ($_.Status -like "*Erfolg*") { "Green" } else { "Red" }
  Write-Host "$($_.Test): $($_.Status)" -ForegroundColor $color
}

Write-Host "`n>>> NÄCHSTE SCHRITTE:" -ForegroundColor Yellow
Write-Host "1. Gehe zu MailerLite Dashboard" -ForegroundColor White
Write-Host "2. Subscribers → Recent Activity (alle Test-Subscriber sichtbar?)" -ForegroundColor White
Write-Host "3. Automations → Activity (für jedes Paket Automation gestartet?)" -ForegroundColor White
Write-Host "4. Subscribers → Klick auf Test-Subscriber → Custom Fields prüfen" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan
```

---

## 🔍 Was du in MailerLite prüfen musst

### 1. Subscribers → Recent Activity
Nach jedem Test sollte ein neuer Subscriber erscheinen:

**Klicke auf den Subscriber und prüfe:**
- ✅ **Groups**: Richtige Gruppe zugewiesen (z.B. "Website to go")
- ✅ **Custom Fields**:
  - `paket`: "Website to go" (lesbarer Name)
  - `paket_key`: "website-to-go" (technischer Key)
  - `nachricht`: Deine Test-Nachricht
  - `quelle`: "Kontaktformular Website" (oder "PowerShell API Test")

### 2. Automations → Activity
Für jede Gruppe sollte die zugehörige Automation erscheinen:

**Prüfe:**
- ✅ Automation gestartet (Status: "Active" oder "Completed")
- ✅ Subscriber-E-Mail korrekt
- ✅ Startzeit ≈ Submit-Zeitpunkt
- ✅ Schritte werden ausgeführt (z.B. E-Mail versendet)

### 3. Double Opt-In (falls aktiviert)
- ✅ Subscriber erhält Bestätigungs-E-Mail
- ✅ Nach Bestätigung: Status wechselt zu "Active"
- ✅ **ERST DANN** startet die Automation

---

## 🚨 Troubleshooting

### Problem: "MailerLite API Fehler" im Console

**Mögliche Ursachen:**
1. **API Key ungültig**
   - Prüfe in MailerLite → Settings → API
   - Regeneriere Key falls nötig

2. **Custom Fields fehlen**
   - Gehe zu Subscribers → Fields
   - Erstelle `paket`, `paket_key`, `nachricht`, `quelle`

3. **Group ID falsch**
   - Prüfe in Groups → Klick auf Gruppe → URL enthält ID
   - Vergleiche mit `kontakt/index.html` → `MAILERLITE_CONFIG.groups`

### Problem: Subscriber erscheint, aber keine Automation

**Mögliche Ursachen:**
1. **Automation-Trigger falsch konfiguriert**
   - Gehe zu Automations → Bearbeiten
   - Trigger muss sein: "Subscriber joins a group: <deine Gruppe>"

2. **Automation nicht aktiviert**
   - Status muss "Active" sein, nicht "Draft"

3. **Double Opt-In aktiv, aber nicht bestätigt**
   - Subscriber-Status: "Unconfirmed"
   - Lösung: Bestätige E-Mail oder deaktiviere Double Opt-In

### Problem: Network Error im Browser

**DevTools → Console zeigt:**
```
Failed to fetch
CORS error
```

**Lösung:** Das ist normal bei `file://` URLs. Nutze den HTTP-Server:
```powershell
python -m http.server 8080
```
Dann: `http://localhost:8080/kontakt/`

---

## ✅ Erfolgs-Checkliste

Nach allen Tests sollte gelten:

- [ ] Alle Formular-Submits erfolgreich (grüne Meldung)
- [ ] Browser Network: Status 200/201 für MailerLite API
- [ ] Browser Console: Keine roten Fehler
- [ ] MailerLite Subscribers: Alle Test-Subscriber vorhanden
- [ ] MailerLite Groups: Korrekte Zuordnung
- [ ] MailerLite Custom Fields: Alle 4 Felder befüllt
- [ ] MailerLite Automations: Für jede Gruppe gestartet
- [ ] Bei Double Opt-In: Bestätigungs-E-Mail erhalten

---

## 📝 Produktion: Finaler Check

**Vor dem Live-Gang:**

1. **Test mit echter E-Mail**
   - Nutze deine echte E-Mail
   - Prüfe, ob Willkommens-E-Mail ankommt
   - Bestätige (falls Double Opt-In)
   - Prüfe Automation-Flow

2. **Formular-Validierung**
   - Teste ohne Consent → sollte blockieren
   - Teste mit ungültiger E-Mail → sollte Fehler zeigen
   - Teste ohne Paket-Auswahl → sollte Fehler zeigen

3. **Mobile Test**
   - Öffne auf Smartphone
   - WhatsApp FAB sichtbar?
   - Formular funktioniert?

4. **Deployment**
   - Upload zu deinem Webserver
   - Teste erneut mit echter Domain
   - Prüfe SSL-Zertifikat (HTTPS)

---

## 🎉 Fertig!

Du hast jetzt ein voll funktionsfähiges Kontaktformular mit MailerLite-Integration und paketspezifischen Automationen!

**Support:**
- MailerLite Docs: https://developers.mailerlite.com/docs
- API Reference: https://developers.mailerlite.com/docs/subscribers
