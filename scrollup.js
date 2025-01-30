document.addEventListener('DOMContentLoaded', () => {
    const scrollButton = document.querySelector('.scroll-to-top');
    
    // Sjekk scroll posisjon og vis/skjul knappen
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) { // Viser knappen etter 500px scroll
            scrollButton.style.display = 'flex';
            scrollButton.style.opacity = '1';
        } else {
            scrollButton.style.opacity = '0';
            setTimeout(() => {
                if (window.scrollY <= 500) {
                    scrollButton.style.display = 'none';
                }
            }, 300); // Venter med å skjule til fade-out er ferdig
        }
    });
});