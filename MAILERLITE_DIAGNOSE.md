# MailerLite Automation Diagnose – Warum E-Mails nicht gesendet werden

## Problem
Kontakte werden erfolgreich erstellt, Status ist "active", Gruppenbeitritt sichtbar, aber **keine E-Mail wird von der Automation gesendet**.

---

## 🔥 AKTUELLE FEHLERANALYSE (30. Nov 2025)

### Symptom-Vergleich

**VOR Kampagnen-Neuerstellung:**
- ✅ Kontakt erstellt
- ✅ Gruppe zugewiesen (API funktionierte)
- ❌ E-Mails NICHT gesendet

**NACH Kampagnen-Neuerstellung:**
- ✅ Kontakt erstellt
- ❌ Gruppe NICHT zugewiesen (API schlägt fehl)
- ✅ E-Mails gesendet (bei manueller Gruppen-Zuordnung)

### Wahrscheinlichste Fehlerquellen

#### 🔴 KRITISCH: Gruppen-IDs sind veraltet

**Hypothese:** Beim Neuerstellen der Kampagnen wurden neue Gruppen angelegt. Die alten Group-IDs im Formular-Code sind ungültig.

**Sofort-Maßnahme:**
1. Öffne MailerLite → Gruppen
2. Klicke auf "Onepager to go" (oder die Zielgruppe)
3. Kopiere die URL: `https://dashboard.mailerlite.com/groups/XXXXXXXXXX/subscribers`
4. Die Zahl `XXXXXXXXXX` ist die Group-ID
5. Vergleiche mit Zeile 374 in `kontakt/index.html`:
   ```javascript
   'GROUP_ID_Onepager to go': '170209900406769468'
   ```
6. Stimmt die ID überein? **Wenn NEIN → Code muss aktualisiert werden**

**Prüfung im Browser-Formular:**
- Fülle Formular aus → öffne Browser-Konsole (F12)
- Siehst du: `⚠️ Gruppen-Zuordnung fehlgeschlagen (4xx)`?
- Wenn JA → Group-ID ist falsch oder API hat keine Berechtigung

#### 🟠 WAHRSCHEINLICH: Double Opt-In aktiviert

**Hypothese:** Neue Kampagnen haben versehentlich Double Opt-In aktiviert → Kontakt wird mit Status "unconfirmed" erstellt statt "active".

**Sofort-Maßnahme:**
1. MailerLite → Settings → Forms & Pop-ups
2. Prüfe: Ist "Single opt-in" oder "Double opt-in" Standard?
3. Prüfe jede Gruppe: Gruppen → [Gruppe] → Settings → Confirmation Settings
4. Muss "Single opt-in" sein (keine Bestätigungs-E-Mail erforderlich)

#### 🟡 MÖGLICH: API-Rate-Limit überschritten

**Hypothese:** Zu viele API-Calls in kurzer Zeit → MailerLite blockt temporär.

**Sofort-Maßnahme:**
- Warte 5 Minuten, teste mit neuer Temp-E-Mail
- Prüfe Browser-Konsole auf HTTP 429 "Too Many Requests"

---

## Kritische Prüfpunkte in MailerLite (in dieser Reihenfolge)

### 1. AUTOMATION-STATUS
**Wo:** Automations → Deine Automation auswählen
**Prüfen:**
- [ ] Status ist **"Active"** (nicht "Draft" oder "Paused")
- [ ] Automation wurde **nach dem letzten Edit aktiviert** (speichern + publish)
- [ ] Keine Warnmeldungen oben im Workflow-Builder

**Häufigster Fehler:** Automation im Draft-Modus oder nach Änderungen nicht neu aktiviert.

---

### 2. TRIGGER-KONFIGURATION
**Wo:** Automations → Trigger-Schritt (erster grüner Block)

#### Option A: "Joins group"
- [ ] Trigger-Typ: **"Joins group"** (nicht "Is in group")
- [ ] Gruppe: Exakt **"Onepager to go"** (oder entsprechende Paket-Gruppe)
- [ ] **Keine** zusätzlichen Filter/Bedingungen im Trigger

#### Option B: "Custom field"
- [ ] Trigger-Typ: **"Field updated"** oder **"changes to"** (nicht nur "equals")
- [ ] Feld: **"paket_key"** oder **"trigger_token"**
- [ ] Wert: Bei "trigger_token" muss jeder Submit einen neuen Wert setzen

**Häufigster Fehler:** 
- "Is in group" statt "Joins group" → feuert nur bei manueller Prüfung, nicht bei Ereignis
- "Field equals" ohne "updated" → feuert nicht, wenn Wert bereits existiert

---

### 3. ENROLLMENT-REGELN
**Wo:** Automations → Settings (Zahnrad-Symbol oben rechts)
**Prüfen:**
- [ ] **"Allow contacts to enroll multiple times"** ist **aktiviert**
- [ ] **"Remove contacts if they no longer match trigger"** ist **deaktiviert** (optional)
- [ ] Keine "Exit conditions" definiert, die Kontakte sofort ausschließen

**Häufigster Fehler:** Mehrfach-Einschreibung deaktiviert → wiederholte Tests mit derselben Adresse starten Automation nicht erneut.

---

### 4. ERSTER SCHRITT (E-MAIL)
**Wo:** Automations → Erster Schritt nach dem Trigger
**Prüfen:**
- [ ] Schritt-Typ: **"Send email"** (nicht "Wait" oder "Condition")
- [ ] E-Mail-Status: **"Active"** (grüner Haken, nicht grau/draft)
- [ ] **Kein Delay** vor dem ersten E-Mail-Schritt (oder max. 1-2 Min zum Test)
- [ ] **Kein Sendezeitfenster** ("Send only on weekdays/hours") aktiviert
- [ ] E-Mail ist **vollständig konfiguriert** (Subject, From, Content nicht leer)

**Häufigster Fehler:** 
- E-Mail im Draft-Modus
- Sendezeitfenster aktiv → E-Mail wartet auf nächstes erlaubtes Zeitfenster
- Delay von mehreren Stunden/Tagen → E-Mail noch in Warteschlange

---

### 5. E-MAIL-KONFIGURATION
**Wo:** Automations → E-Mail-Schritt → Edit
**Prüfen:**
- [ ] **From-Adresse:** Vollständig verifiziert (grüner Haken in Settings → Domains)
- [ ] **From-Name:** Nicht leer
- [ ] **Subject:** Nicht leer
- [ ] **Content:** Mindestens ein Text-Block vorhanden
- [ ] **No A/B-Test** aktiv (oder Wartezeit auf 0)

**Häufigster Fehler:** From-Domain nicht verifiziert → E-Mails werden von ML blockiert.

---

### 6. KONTAKT-STATUS
**Wo:** Subscribers → Kontakt suchen
**Prüfen:**
- [ ] Status: **"Active"** (nicht "Unsubscribed", "Bounced", "Unconfirmed", "Suppressed")
- [ ] Groups: Kontakt ist **Mitglied der Trigger-Gruppe** (z.B. "Onepager to go")
- [ ] Activity: Reihenfolge ist korrekt:
  1. "Status changed to active" (oder "Subscribed")
  2. "Added to group [Name]"
  3. Idealerweise: "Enrolled in automation [Name]"

**Häufigster Fehler:** 
- Kontakt "Unsubscribed" → Automations starten nicht für unsubscribed Kontakte
- "Added to group" **vor** "Status active" → Trigger feuert nicht

---

### 7. SUPPRESSION & ZUSTELLBARKEIT
**Wo:** Subscribers → Kontakt auswählen → Details
**Prüfen:**
- [ ] **Nicht auf Suppression-Liste** (keine rote Warnung)
- [ ] **Nicht gebounced** (kein Bounce-Icon)
- [ ] **E-Mail-Adresse gültig** (keine Tippfehler)
- [ ] **Domain verifiziert:** Settings → Domains → SPF/DKIM grün

**Häufigster Fehler:** Testadresse bereits mehrfach unsubscribed/gebounced → ML blockiert automatisch.

---

### 8. WORKFLOW-ACTIVITY (ENROLLMENT)
**Wo:** Automations → Deine Automation → Tab "Activity"
**Prüfen:**
- [ ] Kontakt erscheint in der Activity-Liste
- [ ] Status: **"Active"** oder **"Completed"** (nicht "Waiting", "Failed")
- [ ] Bei "Active": Nächster Schritt zeigt **kein Datum weit in der Zukunft**
- [ ] Bei "Failed": Fehlergrund anklicken und lesen

**Häufigster Fehler:** 
- Kontakt erscheint **gar nicht** in Activity → Trigger hat nicht gefeuert
- Status "Waiting" mit Datum in 24h → Sendezeitfenster aktiv

---

### 9. ACCOUNT-LIMITS & QUOTAS
**Wo:** Settings → Account → Billing/Limits
**Prüfen:**
- [ ] **E-Mail-Limit nicht erreicht** (z.B. 1000/Monat bei Free-Plan)
- [ ] **Kein Sending-Pause** aktiv (nach Spam-Beschwerde o.ä.)
- [ ] **Account aktiv** (nicht suspended/paused)

**Häufigster Fehler:** Free-Plan-Limit überschritten → E-Mails werden in Warteschlange gehalten.

---

### 10. SEGMENT/FILTER IM WORKFLOW
**Wo:** Automations → Jeden Schritt einzeln prüfen
**Prüfen:**
- [ ] **Keine "If/Else"-Conditions**, die alle Kontakte ausfiltern
- [ ] **Keine Segment-Filter** im ersten E-Mail-Schritt
- [ ] Keine "Exit"-Schritte vor der ersten E-Mail

**Häufigster Fehler:** Versteckter Filter (z.B. "If field X is empty") schließt alle Kontakte aus.

---

## Typische Fehlerbilder und Lösungen

### Problem: "Kontakt sichtbar, aber nicht in Workflow-Activity"
**Ursache:** Trigger hat nicht gefeuert
**Lösungen:**
- Trigger-Typ auf "Joins group" (nicht "Is in group") ändern
- Bei Custom-Field: "Field updated" statt "equals" nutzen
- Sicherstellen, dass Gruppenbeitritt **nach** Status=active erfolgt

### Problem: "Kontakt in Activity, Status 'Waiting', kein E-Mail-Versand"
**Ursache:** Delay oder Sendezeitfenster aktiv
**Lösungen:**
- Delay auf 0 setzen oder entfernen
- Sendezeitfenster deaktivieren ("Send anytime")
- Prüfen, ob A/B-Test aktive Wartezeit hat

### Problem: "Kontakt in Activity, Status 'Failed'"
**Ursache:** E-Mail-Konfiguration unvollständig oder Domain nicht verifiziert
**Lösungen:**
- Fehlergrund in Activity-Detail lesen
- Domain/SPF/DKIM in Settings → Domains prüfen
- E-Mail-Content und From-Adresse validieren

### Problem: "Mehrfache Tests mit gleicher Adresse funktionieren nicht"
**Ursache:** "Multiple enrollments" deaktiviert
**Lösungen:**
- Settings → "Allow contacts to enroll multiple times" aktivieren
- **Oder:** Kontakt manuell aus Gruppe entfernen → neu hinzufügen

### Problem: "Formular sendet, API zeigt OK, aber Automation startet nie"
**Ursache:** Gruppenbeitritt erfolgt vor Status=active (Race Condition)
**Lösungen:**
- Im Code: Delay zwischen Create und Add-to-Group erhöhen (1000-1500ms statt 600ms)
- In ML: Statt "Joins group" auf "Custom field updated" umstellen mit eindeutigem Token

---

## Schritt-für-Schritt Diagnose (in dieser Reihenfolge durchführen)

1. **Automation-Status:** Active? Neu aktiviert nach letztem Edit?
2. **Trigger-Typ:** "Joins group" oder "Field updated" (nicht "equals")?
3. **Trigger-Gruppe/Feld:** Korrekt eingestellt? Keine Tippfehler?
4. **Enrollment-Settings:** Multiple enrollments aktiviert?
5. **Erster Schritt:** E-Mail active, kein Delay, kein Zeitfenster?
6. **From-Domain:** Vollständig verifiziert (SPF + DKIM)?
7. **Kontakt-Status:** Active? Nicht unsubscribed/bounced?
8. **Kontakt-Gruppen:** Mitglied der Trigger-Gruppe?
9. **Workflow-Activity:** Kontakt erscheint? Status "Active" oder "Completed"?
10. **Account-Limits:** Keine Quotas überschritten?

---

## Test mit Screenshot-Dokumentation

Wenn alle obigen Punkte korrekt sind, aber E-Mails immer noch nicht senden:

1. **Erstelle neuen Test-Workflow:**
   - Trigger: "Joins group: Test-Gruppe"
   - Schritt 1: Send email (kein Delay, "Send anytime")
   - E-Mail: Einfacher Text, verifizierte From-Adresse

2. **Füge Test-Kontakt manuell hinzu:**
   - Subscribers → Create subscriber
   - Status: Active
   - Gruppe: Test-Gruppe

3. **Prüfe Activity innerhalb 2 Minuten:**
   - Workflow → Activity: Kontakt sollte erscheinen
   - Status sollte "Completed" sein
   - E-Mail sollte gesendet worden sein

4. **Falls auch das nicht funktioniert:**
   - **Screenshots machen von:**
     - Workflow-Builder (gesamter Flow)
     - Trigger-Konfiguration
     - Erster Schritt (E-Mail-Konfiguration)
     - Settings → "Allow multiple enrollments"
     - Kontakt-Details (Status, Groups, Activity)
     - Workflow-Activity (leer oder mit Kontakt)
   - **MailerLite Support kontaktieren** mit Screenshots
   - Mögliche Ursachen: Account-spezifische Einschränkung, Bug in MailerLite

---

## Alternativen, falls Automation nicht funktionstüchtig

### Option 1: Manuelle Kampagne statt Automation
- Erstelle normale Campaign (nicht Automation)
- Sende an Segment: "Is in group: Onepager to go"
- Nachteil: Kein automatischer Versand, muss manuell gestartet werden

### Option 2: Zapier/Make.com Integration
- Webhook von Formular an Zapier
- Zapier → MailerLite: Create subscriber + Send campaign
- Vorteil: Unabhängig von ML-Automations

### Option 3: Direkter E-Mail-Versand via SMTP
- Formular sendet direkt via SMTP (z.B. SendGrid, Mailgun)
- MailerLite nur für Subscriber-Verwaltung
- Nachteil: Tracking/Analytics getrennt

---

## Nächste Schritte

1. Gehe die **10 Prüfpunkte** oben durch (mit Haken markieren)
2. Prüfe **Workflow-Activity** nach jedem Test-Submit
3. Falls Kontakt **nicht in Activity** erscheint → Trigger-Problem (Punkt 2)
4. Falls Kontakt in Activity **"Waiting"** → Delay/Zeitfenster (Punkt 4)
5. Falls Kontakt in Activity **"Failed"** → E-Mail-Config/Domain (Punkt 5)
6. Falls alle Punkte korrekt, aber immer noch kein Versand → **MailerLite Support kontaktieren**

---

**Stand:** 29. November 2025  
**Formular-Code:** Aktuelle Version mit status=active, Delay 600ms, expliziter Gruppenbeitritt + Custom-Field-Update
