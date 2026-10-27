// Explain: JavaScript for interactive gallery filtering functionality.
document.addEventListener('DOMContentLoaded', function () {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active state
            filterBtns.forEach(function(b) {
                b.setAttribute('aria-pressed', 'false');
            });
            btn.setAttribute('aria-pressed', 'true');

            var filterValue = btn.getAttribute('data-filter');

            // Filter items
            galleryItems.forEach(function(item) {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    setTimeout(function() {
                        item.style.transition = 'opacity 0.4s ease';
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                }
            });
        });
    });
});