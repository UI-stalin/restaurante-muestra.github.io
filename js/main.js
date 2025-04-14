// Main JavaScript for Delicias Urbanas

// Función para manejar la visibilidad del menú móvil
const toggleMobileMenu = (show) => {
    const nav = document.querySelector('nav');
    const overlay = document.querySelector('.overlay');
    const menuToggle = document.querySelector('.menu-toggle i');
    
    nav.classList.toggle('active', show);
    overlay.classList.toggle('active', show);
    menuToggle.classList.toggle('fa-bars', !show);
    menuToggle.classList.toggle('fa-times', show);
};

// Función para manejar el scroll del header
const handleHeaderScroll = () => {
    const header = document.querySelector('header');
    const scrolled = window.scrollY > 50;
    header.classList.toggle('scrolled', scrolled);
};

document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const menuToggle = document.querySelector('.menu-toggle');
    const menuItems = document.querySelectorAll('.menu-item');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    // Optimizar el evento de scroll con throttle
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleHeaderScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Eventos del menú móvil
    menuToggle.addEventListener('click', () => toggleMobileMenu(true));
    document.querySelector('.overlay').addEventListener('click', () => toggleMobileMenu(false));
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => toggleMobileMenu(false));
    });
    
    // Función para filtrar el menú
    const filterMenu = (category, button) => {
        tabBtns.forEach(btn => btn.classList.toggle('active', btn === button));
        
        menuItems.forEach(item => {
            const isVisible = category === 'all' || item.getAttribute('data-category') === category;
            item.style.display = isVisible ? 'block' : 'none';
            
            if (isVisible) {
                item.classList.add('fade-in');
                setTimeout(() => item.classList.remove('fade-in'), 1000);
            }
        });
    };

    // Eventos de filtrado del menú
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterMenu(this.getAttribute('data-category'), this);
        });
    });
    
    // Inicialmente mostrar solo la categoría "entradas"
    document.querySelector('.tab-btn[data-category="entradas"]').click();
    
    // Función genérica para manejar envíos de formularios
    const handleFormSubmit = (formId, processingText, successMessage) => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.textContent = processingText;
            
            // Simulación de envío
            setTimeout(() => {
                alert(successMessage);
                this.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }, 1500);
        });
    };

    // Configuración de los formularios
    handleFormSubmit('booking-form', 'Procesando...', '¡Reserva realizada con éxito! Recibirás un correo de confirmación en breve.');
    handleFormSubmit('contact-form', 'Enviando...', '¡Mensaje enviado con éxito! Te responderemos lo antes posible.');
    handleFormSubmit('newsletter-form', 'Procesando...', '¡Gracias por suscribirte a nuestro boletín!');
    
    // Animación de elementos al hacer scroll con Intersection Observer
    const animateOnScroll = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    animateOnScroll.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '50px' }
    );

    // Observar elementos para animación
    document.querySelectorAll('.section-title, .menu-item, .review-item, .reservation-form, .contact-form')
        .forEach(element => animateOnScroll.observe(element));
    
    // Configurar fecha mínima para reservas
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
});

// Carrusel de imágenes del hero optimizado
class HeroCarousel {
    constructor(selector, images, interval = 5000) {
        this.hero = document.querySelector(selector);
        this.images = images;
        this.currentIndex = 0;
        this.interval = interval;
        
        // Precargar imágenes
        this.preloadImages();
        this.init();
    }

    preloadImages() {
        this.images.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    setBackground(index) {
        this.hero.style.opacity = 0;
        setTimeout(() => {
            this.hero.style.backgroundImage = 
                `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${this.images[index]})`;
            this.hero.style.opacity = 1;
        }, 500);
    }

    init() {
        this.hero.style.transition = 'opacity 0.5s ease';
        this.setBackground(0);

        setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.setBackground(this.currentIndex);
        }, this.interval);
    }
}

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HeroCarousel('.hero', [
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
        'https://images.unsplash.com/photo-1592861956120-e524fc739696'
    ]);
});