// ========================================
// CONFIGURATION
// ========================================
const CONFIG = {
  scrollThreshold: 100,
  parallaxSpeed: 0.5,
  animationDuration: 600,
  staggerDelay: 100,
  letterRevealSpeed: 80,
};

// ========================================
// PRELOADER PREMIUM
// ========================================
const initPreloader = () => {
  const preloader = document.getElementById("preloader");
  const preloaderText = document.getElementById("preloaderText");
  const preloaderBar = document.querySelector(".preloader-bar");

  if (!preloader || !preloaderText) return;

  const text = "CAXAS DIGITAL";
  let index = 0;
  let progress = 0;

  // Bloquear scroll
  document.body.style.overflow = "hidden";

  // Añadir porcentaje
  const percentage = document.createElement("div");
  percentage.className = "preloader-percentage";
  percentage.textContent = "0%";
  preloaderBar.style.position = "relative";
  preloaderBar.appendChild(percentage);

  // Actualizar porcentaje
  const updateProgress = setInterval(() => {
    if (progress < 100) {
      progress += Math.random() * 15;
      if (progress > 100) progress = 100;
      percentage.textContent = Math.floor(progress) + "%";
    }
  }, 100);

  // Revelar letras
  const revealLetter = () => {
    if (index < text.length) {
      const span = document.createElement("span");
      span.textContent = text[index];

      // Retraso escalonado para cada letra
      span.style.animationDelay = `${index * 0.08}s`;

      // Espacio entre palabras
      if (text[index] === " ") {
        span.style.width = "24px";
        span.style.opacity = "0";
      }

      preloaderText.appendChild(span);
      index++;

      // Continuar con siguiente letra
      setTimeout(revealLetter, 85);
    } else {
      // Completar progreso
      clearInterval(updateProgress);
      progress = 100;
      percentage.textContent = "100%";

      // Esperar y cerrar
      setTimeout(() => {
        preloader.classList.add("fade-out");
        setTimeout(() => {
          preloader.remove();
          document.body.style.overflow = "auto";
          document.body.classList.add("loaded");

          // Trigger animaciones de entrada
          triggerPageAnimations();
        }, 1000);
      }, 800);
    }
  };

  // Iniciar animación
  setTimeout(revealLetter, 400);
};

// ========================================
// ANIMACIONES DE ENTRADA DE LA PÁGINA
// ========================================
const triggerPageAnimations = () => {
  const header = document.getElementById("mainHeader");
  const hero = document.querySelector(".hero");

  if (header) {
    header.style.animation = "slideDown 0.8s ease-out";
  }

  if (hero) {
    hero.style.animation = "fadeIn 1s ease-out";
  }
};

// Añadir estas animaciones al CSS
const style = document.createElement("style");
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// UTILITY FUNCTIONS
// ========================================
const smoothScroll = (target) => {
  target?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// ========================================
// ANIMATED HEADER ON SCROLL
// ========================================
const initAnimatedHeader = () => {
  const header = document.getElementById("mainHeader");
  if (!header) return;

  let lastScroll = 0;
  let ticking = false;

  const updateHeader = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > CONFIG.scrollThreshold) {
      header.style.transform =
        currentScroll > lastScroll ? "translateY(-100%)" : "translateY(0)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.transform = "translateY(0)";
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
    ticking = false;
  };

  header.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  });
};

// ========================================
// NAVIGATION
// ========================================
const initNavigation = () => {
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href?.startsWith("#")) {
        e.preventDefault();
        smoothScroll(document.querySelector(href));
      }
    });
  });
};

// ========================================
// ENHANCED PARALLAX EFFECT
// ========================================
const initParallax = () => {
  const heroBackground = document.querySelector(".hero-background");
  if (!heroBackground) return;

  let ticking = false;

  const updateParallax = () => {
    const scrolled = window.pageYOffset;
    const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

    if (scrolled < heroHeight) {
      heroBackground.style.transform = `translateY(${
        scrolled * CONFIG.parallaxSpeed
      }px)`;
    }

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
};

// ========================================
// VIDEO BACKGROUND OPTIMIZATION
// ========================================
const initVideoBackground = () => {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (iOS) {
    video.remove();
    return;
  }

  window.addEventListener("load", () => {
    video.play().catch(() => {});
  });

  setTimeout(() => video.pause(), 300000);
};

// ========================================
// OFFER SECTION INTERACTIONS
// ========================================
const initOfferSection = () => {
  const serviceCards = document.querySelectorAll(".left-column .card");
  const infoCards = document.querySelectorAll(".right-column .info-card");

  const cardMapping = {
    0: [0, 1],
    1: [2, 3],
    2: [2],
    3: [3],
  };

  serviceCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      serviceCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      infoCards.forEach((infoCard, infoIndex) => {
        const shouldShow = cardMapping[index]?.includes(infoIndex);
        infoCard.classList.toggle("inactive", !shouldShow);

        if (shouldShow) {
          infoCard.style.animation = "fadeInUp 0.5s ease forwards";
        }
      });
    });
  });
};

// ========================================
// ADVANCED SCROLL ANIMATIONS
// ========================================
const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const animateElement = (element, delay = 0) => {
    setTimeout(() => {
      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, delay);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = `all ${CONFIG.animationDuration}ms ease`;

        const delay = parseInt(element.dataset.delay || 0);
        animateElement(element, delay);

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".card, .info-card, .industry-card, .section-title")
    .forEach((el) => {
      observer.observe(el);
    });
};

// ========================================
// STAGGER ANIMATION FOR LISTS
// ========================================
const initStaggerAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px",
  };

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(
          ".tech-item, .industry-card"
        );

        items.forEach((item, index) => {
          item.style.opacity = "0";
          item.style.transform = "translateX(-20px)";
          item.style.transition = "all 0.5s ease";

          setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateX(0)";
          }, index * CONFIG.staggerDelay);
        });

        staggerObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const techSection = document.querySelector(".tech-section");
  const industriesSection = document.querySelector(".industries-section");

  if (techSection) staggerObserver.observe(techSection);
  if (industriesSection) staggerObserver.observe(industriesSection);
};

// ========================================
// MAGNETIC HOVER EFFECT FOR BUTTONS
// ========================================
const initMagneticButtons = () => {
  const buttons = document.querySelectorAll(
    ".cta-button, .contact-button, .read-more-btn"
  );

  buttons.forEach((button) => {
    button.style.transition = "transform 0.3s ease";

    button.addEventListener("mousemove", (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(${x * 0.2}px, ${
        y * 0.2
      }px) scale(1.05)`;
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translate(0, 0) scale(1)";
    });
  });
};

// ========================================
// FLOATING CONTACT BUTTON
// ========================================
const initContactButton = () => {
  const contactBtn = document.querySelector(".contact-fab");
  if (!contactBtn) return;

  const updateButton = () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= CONFIG.scrollThreshold) {
      contactBtn.style.transform = "translateY(150px)";
    } else {
      contactBtn.style.transform = "translateY(0)";
    }
  };

  contactBtn.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";

  window.addEventListener("scroll", debounce(updateButton, 10));

  contactBtn.addEventListener("click", () => {
    smoothScroll(document.querySelector("#contact"));
  });
};

// ========================================
// IMAGE REVEAL ANIMATIONS
// ========================================
const initImageReveal = () => {
  const images = document.querySelectorAll(".tech-image img");

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "0";
          entry.target.style.transform = "scale(1.1)";
          entry.target.style.transition = "all 1s ease";

          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "scale(1)";
          }, 100);

          imageObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  images.forEach((img) => imageObserver.observe(img));
};

// ========================================
// SCROLL PROGRESS INDICATOR
// ========================================
const initScrollProgress = () => {
  const progressBar = document.createElement("div");
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #06b6d4, #055d6dff);
        width: 0%;
        z-index: 9999;
        transition: width 0.1s ease;
    `;
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const winScroll = document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });
};

// ========================================
// CARD HOVER EFFECTS
// ========================================
const initCardEffects = () => {
  const cards = document.querySelectorAll(".card, .industry-card, .info-card");

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
};

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  initPreloader();

  // Resto de inicializaciones después del preloader
  setTimeout(() => {
    initAnimatedHeader();
    initNavigation();
    initParallax();
    initVideoBackground();
    initOfferSection();
    initScrollAnimations();
    initStaggerAnimations();
    initMagneticButtons();
    initContactButton();
    initImageReveal();
    initScrollProgress();
  }, 3500);
});

// ========================================
// HERO BADGES CAROUSEL
// ========================================

function initBadgesCarousel() {
    const badgesCarousel = document.querySelector('.badges-carousel');
    const partnerCarousel = document.querySelector('.partner-carousel');
    
    if (!badgesCarousel && !partnerCarousel) return;
    
    // Function to rotate slides
    function rotateSlides(carousel, interval) {
        const slides = carousel.querySelectorAll('.badge-slide, .partner-slide');
        if (slides.length <= 1) return;
        
        let currentIndex = 0;
        
        setInterval(() => {
            slides[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % slides.length;
            slides[currentIndex].classList.add('active');
        }, interval);
    }
    
    // Initialize carousels with different intervals
    if (badgesCarousel) {
        rotateSlides(badgesCarousel, 4000); // Change every 4 seconds
    }
    
    if (partnerCarousel) {
        rotateSlides(partnerCarousel, 5000); // Change every 5 seconds
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBadgesCarousel);
} else {
    initBadgesCarousel();
}
