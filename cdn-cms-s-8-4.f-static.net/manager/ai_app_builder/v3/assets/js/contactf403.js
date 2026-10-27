// Explain: JavaScript for handling contact form submission and sending confirmation emails.
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    var status = document.getElementById('formStatus');
    var button = document.getElementById('contactSubmit');

    function value(name) {
        var el = form.elements[name];
        return el ? String(el.value).trim() : '';
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function setStatus(message, color) {
        if (!status) {
            return;
        }
        status.textContent = message;
        status.style.color = color;
    }

    function buildConfirmationEmail(name, service, message) {
        var safeName = escapeHtml(name);
        var safeService = escapeHtml(service || 'Demande générale');
        var safeMessage = escapeHtml(message).replace(/\n/g, '<br>');
        return '' +
            '<div style="font-family:Arial,Helvetica,sans-serif;background:#f8fafc;padding:24px;">' +
                '<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">' +
                    '<div style="background:#1d4ed8;padding:24px 28px;">' +
                        '<p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;">EL-SHADDAI (TECH-SERVICES)</p>' +
                        '<p style="margin:4px 0 0;color:#fecaca;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Confirmation de votre demande</p>' +
                    '</div>' +
                    '<div style="padding:28px;">' +
                        '<p style="margin:0 0 16px;color:#0f172a;font-size:16px;">Bonjour ' + safeName + ',</p>' +
                        '<p style="margin:0 0 20px;color:#475569;font-size:14px;line-height:1.6;">Merci de nous avoir contactés. Nous avons bien reçu votre demande et notre équipe vous répondra très rapidement.</p>' +
                        '<p style="margin:0 0 8px;color:#0f172a;font-size:13px;font-weight:bold;">Récapitulatif de votre demande</p>' +
                        '<table role="presentation" style="width:100%;border-collapse:collapse;margin:0 0 20px;">' +
                            '<tr>' +
                                '<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px;width:130px;">Service souhaité</td>' +
                                '<td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:13px;font-weight:bold;">' + safeService + '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td style="padding:10px 0;color:#64748b;font-size:13px;vertical-align:top;">Votre message</td>' +
                                '<td style="padding:10px 0;color:#0f172a;font-size:13px;line-height:1.6;">' + safeMessage + '</td>' +
                            '</tr>' +
                        '</table>' +
                        '<p style="margin:0 0 8px;color:#0f172a;font-size:14px;font-weight:bold;">Besoin urgent ?</p>' +
                        '<p style="margin:0 0 20px;color:#475569;font-size:13px;line-height:1.6;">WhatsApp : <a href="https://wa.me/242067545743" style="color:#1d4ed8;text-decoration:none;">+242 06 754 5743</a><br>Téléphone : <a href="tel:+242065693606" style="color:#1d4ed8;text-decoration:none;">+242 06 569 3606</a></p>' +
                    '</div>' +
                    '<div style="background:#0b1220;padding:16px 28px;">' +
                        '<p style="margin:0;color:#94a3b8;font-size:12px;">EL-SHADDAI (TECH-SERVICES) — Brazzaville, République du Congo</p>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        var email = value('email');
        var name = value('fullname');
        var message = value('message');
        var service = value('service');

        if (!name || !email || !message) {
            setStatus('Merci de renseigner votre nom, votre email et votre message.', '#dc2626');
            return;
        }
        if (email.indexOf('@') === -1) {
            setStatus('Merci de saisir une adresse email valide.', '#dc2626');
            return;
        }

        if (button) {
            button.disabled = true;
        }
        setStatus('Envoi en cours...', '#64748b');

        window.MessagesSystem.submit([
            { label: 'Nom complet', value: name, type: 'text' },
            { label: 'Email', value: email, type: 'email' },
            { label: 'Téléphone', value: value('phone'), type: 'tel' },
            { label: 'Service souhaité', value: service, type: 'select' },
            { label: 'Message', value: message, type: 'textarea' }
        ], form).then(function (response) {
            if (response && response.success) {
                setStatus('Merci ! Votre message a bien été envoyé. Un email de confirmation vient de vous être adressé. Nous vous répondrons très vite.', '#15803d');
                form.reset();

                window.PluginsSystem.sendRequest('send_email', {
                    to: email,
                    subject: 'Confirmation de votre demande — EL-SHADDAI (TECH-SERVICES)',
                    body_html: buildConfirmationEmail(name, service, message),
                    reply_to: 'Eboostinformatique@gmail.com'
                }).catch(function () {
                    /* La demande a déjà été reçue par le propriétaire ; on ignore un échec d'email. */
                });
            } else {
                setStatus((response && response.error) ? response.error : 'Une erreur est survenue. Réessayez ou écrivez-nous sur WhatsApp.', '#dc2626');
            }
        }).catch(function () {
            setStatus('Connexion impossible. Réessayez ou contactez-nous directement sur WhatsApp.', '#dc2626');
        }).then(function () {
            if (button) {
                button.disabled = false;
            }
        });
    });
});