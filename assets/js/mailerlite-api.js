// MailerLite API Configuration mit paketspezifischen Groups
const MAILERLITE_CONFIG = {
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiNWYwOTU0ZWQzN2QzNmQ0MDYyNTRkOTk4NDU1MTJkYTlhN2QzZWY0MDFhNTgxNzcxMjIyY2JlMDA5MWY5NGU5YjM3ZGIzYWFlODhjMDlkYjYiLCJpYXQiOjE3NjQyNjM3ODEuMzU3NDU3LCJuYmYiOjE3NjQyNjM3ODEuMzU3NDYsImV4cCI6NDkxOTkzNzM4MS4zNDk2MDEsInN1YiI6IjE5MDk2NTEiLCJzY29wZXMiOltdfQ.kxDY-gYnlrlrQ-5ZjYNu1la_KiMwPzkmz_AY7U9n6JhyGqtKbtDwIJfQiiOpETiQZ3ZwFlTHxYZFQyGD_XZSAaRJGEhK1UDmQGRfBn2T0lGLu6os6elzVu8JYsvFpjx2kCIlNYPTHKyqMbfGjiwKKstn6IiASjPPyNkZja_dYZhkPBt571X36p73l72gVvNA5M5-flJOOUf7Zpb13EXbg6JpFNdbZRRMeVQPFB0Ukra42am7FNVJU0KbRrkxv37aV-g4TmHSo6NMT7KdLL5YdS9zKuYExLfFxP0Jvd8psbQNa7-7oOaYBlJ1mF3YZmZoMOZ_O0P5QobJpDquQJfAbYnXowl2E4njgs3sd4JT5bG4beFfOizLXOPzAfK_MyluNBxQQJHSTcde_mGg4snv9uZENblDJxXCJVUdIKnaSqxbcjez566p6afxWv1oUkHilQVJCoD3yq3KOtIIiP6j-p3yiARhwBb3pNG1QtIXeXOBc-H_076E-d9d8hM5Fk4mn2QH32QD5upJR4v5aTerdUj88Dw0xSEBI7hqdFBr0vAVD4Gro_Jl9qNg7HLOLY1keRTx67SNM5TkZqTRsOKGNgFZhFRj6DCjS7Pqyx1sL9Wpc26nJcR7mLWGbVXwByXJNDpc6iPclsGxNDpBfq74pLf7DEpEjF9O2bIGM0wN7Jg',
    
    // Group IDs für jedes Paket - ersetze die Werte mit deinen echten MailerLite Group IDs
    groups: {
        'GROUP_ID_Website to go': '171127365471044985',           // Website to go
        'GROUP_ID_Onepager to go': '170209900406769468',         // Onepager to go
       
        'GROUP_ID_Newsletter Abo': '171127404342805611',          // Newsletter Abo
        'GROUP_ID_Newsletter Kickstart': '171127394964342547',         // Newsletter Kickstart

        'GROUP_ID_Newsletter einrichten': '171127269627004910',          // Newsletter einrichten
        'GROUP_ID_Automatisierung': '171127288491935656',     // Automatisierung
        

        'GROUP_ID_Kombi Starter': '171127309429901142',             // Kombi Starter
        'GROUP_ID_Kombi Profi': '171127343124842340',            // Kombi Profi
       
       
        'GROUP_ID_ALLGEMEIN': '172245375343658156'                  // Allgemein
    }
};

// MailerLite API Integration
async function sendToMailerLite(formData) {
    // Hole die Group ID basierend auf der Paketauswahl
    const selectedOption = document.querySelector('#contact-subject option:checked');
    const groupKey = selectedOption.getAttribute('data-group');
    const groupId = groupKey ? MAILERLITE_CONFIG.groups[groupKey] : null;

    const subscriberData = {
        email: formData.email,
        status: 'active', // Explizit auf "active" setzen (Single Opt-In)
        fields: {
            name: formData.name,
            phone: formData.phone || '',
            last_name: formData.name.split(' ').slice(1).join(' ') || ''
        }
    };

    // WICHTIG: Gruppe direkt beim Erstellen zuweisen (API erlaubt keinen separaten POST mehr)
    if (groupId) {
        subscriberData.groups = [groupId];
    }

    // Custom fields für Nachrichtendetails
    subscriberData.fields.paket = formData.subjectLabel; // Lesbare Paketbezeichnung
    subscriberData.fields.paket_key = formData.subject;   // Technischer Key
    subscriberData.fields.nachricht = formData.message;
    subscriberData.fields.quelle = 'Kontaktformular Website';

    // Hilfsfunktion: Subscriber explizit einer Gruppe hinzufügen, um "joins group" sicher zu triggern
        async function addSubscriberToGroup(email, groupId) {
            if (!groupId) return null;
            try {
                const body = { subscribers: [ { email } ] };
                const res = await fetch(`https://connect.mailerlite.com/api/groups/${groupId}/subscribers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${MAILERLITE_CONFIG.apiKey}`,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                if (!res.ok) {
                    let details = null;
                    try { details = await res.json(); } catch(e) {}
                    updateStatus(`⚠️ Gruppen-Zuordnung fehlgeschlagen (${res.status}): ${details ? JSON.stringify(details) : ''}`,'error');
                    console.warn('Add to group failed', res.status, details || '');
                }
                return res.ok;
            } catch (e) {
                updateStatus(`⚠️ Gruppen-Zuordnung Fehler: ${e.message}`,'error');
                console.warn('Add to group error', e);
                return null;
            }
        }

    // Hilfsfunktion: Felder explizit aktualisieren, um Custom-Field-Trigger sicher auszulösen
    async function updateSubscriberFields(email, fields) {
        try {
            const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MAILERLITE_CONFIG.apiKey}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, fields })
            });
            if (!res.ok) {
                let details = null;
                try { details = await res.json(); } catch(e) {}
                console.warn('Update fields failed', res.status, details || '');
            }
            return res.ok;
        } catch (e) {
            console.warn('Update fields error', e);
            return null;
        }
    }

    try {
        updateStatus('⏳ Verbinde mit MailerLite …', 'info');
        // 1) Subscriber anlegen MIT Gruppenzuordnung (API-Fix: Gruppe muss im ersten Call übergeben werden)
        const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERLITE_CONFIG.apiKey}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(subscriberData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.warn('MailerLite Create Subscriber non-OK:', response.status, errorData || '');
            updateStatus(`❌ Fehler beim Erstellen (${response.status}): ${errorData?.message || 'Unbekannt'}`, 'error');
            return { ok: false, status: response.status, error: errorData };
        }

        const result = await response.json();
        updateStatus('✅ Kontakt erstellt & Gruppe zugewiesen. Automation sollte starten …', 'success');

        // Kurzer Puffer für MailerLite-Verarbeitung
        await new Promise(r => setTimeout(r, 800));

        // Optional: Custom-Field-Trigger zusätzlich anstoßen (falls Automation darauf basiert)
        const triggerToken = `${formData.subject}-${Date.now()}`;
        await updateSubscriberFields(formData.email, {
            paket_key: formData.subject,
            paket: formData.subjectLabel,
            trigger_at: new Date().toISOString(),
            trigger_token: triggerToken
        });

        updateStatus('🎉 Alles bereit. Du erhältst gleich eine Bestätigung per E-Mail.', 'success');
        return result;
    } catch (error) {
        console.error('MailerLite Integration Error:', error);
        updateStatus('❌ Fehler bei der Übermittlung an MailerLite. Bitte erneut versuchen.', 'error');
        throw error;
    }
}
