// Accordion Funktion
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        item.classList.toggle('active');
    });
});
