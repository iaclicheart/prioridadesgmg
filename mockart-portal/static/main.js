document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Toggle Logic
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    
    // Check local storage for preference
    const savedTheme = localStorage.getItem('mockart-theme');
    
    if (savedTheme) {
        htmlEl.setAttribute('data-theme', savedTheme);
    } else {
        // Defaults to dark in HTML, but check system pref
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            htmlEl.setAttribute('data-theme', 'light');
        }
    }

    themeBtn.addEventListener('click', () => {
        let currentTheme = htmlEl.getAttribute('data-theme');
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('mockart-theme', newTheme);
    });

    // Hide Navbar on Scroll Down
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll <= 0) {
            navbar.style.boxShadow = 'none';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
        }

        if (currentScroll > lastScroll && currentScroll > 80) {
            // Scroll down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll up
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Form Intercept
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.style.opacity = '0.7';
            
            // Mock API request
            setTimeout(() => {
                form.innerHTML = '<div style="text-align:center; padding: 2rem;"><h3>Mensagem Enviada!</h3><p>A equipe da Mockart Premedia entrará em contato em breve.</p></div>';
            }, 1500);
        });
    }

    // Initialize rich dense floating particles (No Lines)
    if(window.particlesJS) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 150, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#8B5CF6", "#06B6D4", "#EC4899", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { 
                    "value": 0.8, 
                    "random": true, 
                    "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false }
                },
                "size": { 
                    "value": 4, 
                    "random": true,
                    "anim": { "enable": true, "speed": 2, "size_min": 0.3, "sync": false }
                },
                "line_linked": { "enable": false }, /* NO LINES! */
                "move": { "enable": true, "speed": 1.5, "direction": "top", "random": true, "out_mode": "out" }
            },
            "interactivity": {
                "detect_on": "window",
                "events": {
                    "onhover": { "enable": true, "mode": "repulse" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "repulse": { "distance": 100, "duration": 0.4 },
                    "push": { "particles_nb": 6 }
                }
            },
            "retina_detect": true
        });
    }
});
