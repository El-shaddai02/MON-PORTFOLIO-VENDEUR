// Explain: JavaScript for mobile navigation toggle functionality.
document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) {
        return;
    }

    function setOpen(isOpen) {
        menu.classList.toggle('hidden', !isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
        var icon = toggle.querySelector('i');
        if (icon) {
            icon.className = isOpen ? 'fa-solid fa-xmark text-xl' : 'fa-solid fa-bars text-xl';
        }
    }

    toggle.addEventListener('click', function () {
        setOpen(menu.classList.contains('hidden'));
    });

    menu.addEventListener('click', function (event) {
        if (event.target.closest('a')) {
            setOpen(false);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            setOpen(false);
        }
    });

    document.addEventListener('click', function (event) {
        if (menu.classList.contains('hidden')) {
            return;
        }
        if (!menu.contains(event.target) && !toggle.contains(event.target)) {
            setOpen(false);
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024) {
            setOpen(false);
        }
    });
});