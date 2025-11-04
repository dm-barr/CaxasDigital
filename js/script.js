// ==========================================
// LENIS SMOOTH SCROLL
// ==========================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ==========================================
// GSAP + SCROLLTRIGGER SETUP
// ==========================================
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.defaults({
    markers: false
});

// ==========================================
// PRELOADER
// ==========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    
    setTimeout(() => {
        preloader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initAnimations();
    }, 2500);
});

// ==========================================
// SCROLL PROGRESS
// ==========================================
const updateScrollProgress = () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
};

window.addEventListener('scroll', updateScrollProgress);

// ==========================================
// NAVIGATION DOTS
// ==========================================
const sections = document.querySelectorAll('.snap-section');
const navDots = document.querySelectorAll('.nav-dots .dot');

const updateActiveDot = () => {
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navDots.forEach(dot => dot.classList.remove('active'));
            navDots[index]?.classList.add('active');
        }
    });
};

window.addEventListener('scroll', updateActiveDot);

navDots.forEach((dot, index) => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = sections[index];
        
        lenis.scrollTo(targetSection, {
            offset: 0,
            duration: 1.5
        });
    });
});

// ==========================================
// HEADER SCROLL EFFECT
// ==========================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==========================================
// GSAP ANIMATIONS
// ==========================================
const initAnimations = () => {
    
    // Services Cards
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '#servicios',
            start: 'top center',
            end: 'bottom center',
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Process Steps
    gsap.from('.process-step', {
        scrollTrigger: {
            trigger: '#proceso',
            start: 'top center',
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'back.out(1.7)'
    });
    
    // Tech Items
    gsap.from('.tech-item', {
        scrollTrigger: {
            trigger: '#tecnologia',
            start: 'top center',
        },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
    });
    
    // Testimonial
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '#testimonios',
            start: 'top center',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    // Contact Form
    gsap.from('.contact-form .form-group', {
        scrollTrigger: {
            trigger: '#contacto',
            start: 'top center',
        },
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    });
};

// ==========================================
// SECTION SNAP BEHAVIOR
// ==========================================
let isSnapping = false;
let lastScrollTime = Date.now();
let currentSectionIndex = 0;

const snapToSection = (direction) => {
    if (isSnapping) return;
    
    const now = Date.now();
    if (now - lastScrollTime < 1000) return;
    
    lastScrollTime = now;
    isSnapping = true;
    
    if (direction === 'down' && currentSectionIndex < sections.length - 1) {
        currentSectionIndex++;
    } else if (direction === 'up' && currentSectionIndex > 0) {
        currentSectionIndex--;
    }
    
    lenis.scrollTo(sections[currentSectionIndex], {
        offset: 0,
        duration: 1.5,
        onComplete: () => {
            isSnapping = false;
        }
    });
};

// Wheel Event
let wheelTimer;
window.addEventListener('wheel', (e) => {
    clearTimeout(wheelTimer);
    
    wheelTimer = setTimeout(() => {
        if (Math.abs(e.deltaY) > 50) {
            snapToSection(e.deltaY > 0 ? 'down' : 'up');
        }
    }, 150);
}, { passive: true });

// Touch Events
let touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > 50) {
        snapToSection(diff > 0 ? 'down' : 'up');
    }
});

// Keyboard Navigation
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        snapToSection('down');
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        snapToSection('up');
    }
});

// ==========================================
// TESTIMONIALS SLIDER
// ==========================================
const testimonials = [
    {
        text: "Caxas Digital transformó completamente nuestra presencia online. Las ventas aumentaron un 340% en solo 6 meses. Increíble trabajo.",
        author: "María González",
        role: "CEO, TechVision",
        img: "https://i.pravatar.cc/150?img=1",
        stats: [{value: "340%", label: "Aumento en ventas"}, {value: "2.5M", label: "Usuarios activos"}]
    },
    {
        text: "La app que desarrollaron superó todas nuestras expectativas. Es intuitiva, rápida y nuestros usuarios la califican con 4.9 estrellas.",
        author: "Carlos Ruiz",
        role: "Founder, HealthPlus",
        img: "https://i.pravatar.cc/150?img=3",
        stats: [{value: "4.9★", label: "Rating"}, {value: "500K", label: "Downloads"}]
    },
    {
        text: "Su estrategia de marketing digital nos posicionó como líderes. Pasamos de invisibles a referentes en solo 8 meses.",
        author: "Ana Martínez",
        role: "CMO, EcoStyle",
        img: "https://i.pravatar.cc/150?img=5",
        stats: [{value: "850%", label: "Aumento tráfico"}, {value: "#1", label: "Google Rank"}]
    }
];

let currentTestimonial = 0;

const updateTestimonial = (index) => {
    const card = document.querySelector('.testimonial-card');
    const data = testimonials[index];
    
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        card.querySelector('.testimonial-text').textContent = data.text;
        card.querySelector('.testimonial-author img').src = data.img;
        card.querySelector('.testimonial-author h4').textContent = data.author;
        card.querySelector('.testimonial-author p').textContent = data.role;
        
        const stats = card.querySelectorAll('.stat');
        stats[0].querySelector('.stat-value').textContent = data.stats[0].value;
        stats[0].querySelector('.stat-label').textContent = data.stats[0].label;
        stats[1].querySelector('.stat-value').textContent = data.stats[1].value;
        stats[1].querySelector('.stat-label').textContent = data.stats[1].label;
        
        // Update dots
        document.querySelectorAll('.slider-dots .dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 300);
};

document.querySelector('.slider-btn.prev').addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial(currentTestimonial);
});

document.querySelector('.slider-btn.next').addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial(currentTestimonial);
});

// Auto-slide
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial(currentTestimonial);
}, 6000);

// ==========================================
// CONTACT FORM
// ==========================================
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Aquí va tu lógica de envío
    alert('¡Mensaje enviado! Te contactaremos pronto 🚀');
    e.target.reset();
});

// ==========================================
// SMOOTH ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5
            });
        }
    });
});
