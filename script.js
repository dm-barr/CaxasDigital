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

  // AÃƒÂ±adir porcentaje
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

  // Iniciar animaciÃƒÂ³n
  setTimeout(revealLetter, 400);
};

// ========================================
// ANIMACIONES DE ENTRADA DE LA PÃƒÂGINA
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

// AÃƒÂ±adir estas animaciones al CSS
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
// VIDEO BACKGROUND OPTIMIZATION - MEJORADO PARA MÃ“VILES
// ========================================
const initVideoBackground = () => {
  const video = document.querySelector(".hero-video");
  if (!video) return;

  // FunciÃ³n para intentar reproducir el video
  const playVideo = () => {
    // Asegurar que el video tenga los atributos correctos
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("loop", "");
    video.setAttribute("preload", "auto");
    video.muted = true; // Crucial para autoplay en mÃ³viles

    // Intentar reproducir
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("âœ“ Video reproduciendo correctamente");
        })
        .catch((error) => {
          console.warn("âš  Error al reproducir video:", error);
          // Intentar de nuevo despuÃ©s de interacciÃ³n del usuario
          const tryPlayAgain = () => {
            video
              .play()
              .then(() =>
                console.log("âœ“ Video reproducido despuÃ©s de interacciÃ³n")
              )
              .catch((e) => console.warn("âœ— Segundo intento fallido:", e));
          };

          document.body.addEventListener("click", tryPlayAgain, { once: true });
          document.body.addEventListener("touchstart", tryPlayAgain, {
            once: true,
          });
        });
    }
  };

  // Intentar reproducir cuando el video estÃ© listo
  if (video.readyState >= 2) {
    playVideo();
  } else {
    video.addEventListener("loadeddata", playVideo, { once: true });
  }

  // TambiÃ©n intentar cuando la pÃ¡gina cargue completamente
  if (document.readyState === "loading") {
    window.addEventListener("load", playVideo);
  }
};

// ========================================
// OFFER SECTION INTERACTIONS
// ========================================
const initOfferSection = () => {
  const serviceCards = document.querySelectorAll(".left-column .card");
  const infoCards = document.querySelectorAll(".right-column .info-card");

  if (serviceCards.length === 0 || infoCards.length === 0) return;

  // FunciÃƒÂ³n para mostrar tarjetas segÃƒÂºn el servicio seleccionado
  const showCards = (serviceIndex) => {
    console.log("Activando servicio:", serviceIndex); // Debug

    // Remover clase active de todos los botones de servicio
    serviceCards.forEach((card) => {
      card.classList.remove("active");
      card.classList.remove("card-highlight");
    });

    // Activar el botÃƒÂ³n seleccionado
    const selectedCard = document.querySelector(
      `.left-column .card[data-service="${serviceIndex}"]`
    );
    if (selectedCard) {
      selectedCard.classList.add("active");
      selectedCard.classList.add("card-highlight");
    }

    // Actualizar tarjetas de informaciÃƒÂ³n
    infoCards.forEach((infoCard) => {
      const category = infoCard.getAttribute("data-category");

      if (category === serviceIndex.toString()) {
        infoCard.classList.add("active");
      } else {
        infoCard.classList.remove("active");
      }
    });
  };

  // Agregar event listeners a las tarjetas de servicio
  serviceCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const serviceIndex = card.getAttribute("data-service");
      showCards(serviceIndex);
    });

    // Mejorar la respuesta visual
    card.style.cursor = "pointer";
  });

  // Inicializar mostrando el primer servicio
  showCards("0");
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
  // EXCLUIR las tarjetas de la columna izquierda de offer
  const cards = document.querySelectorAll(
    ".industry-card, .right-column .info-card.active"
  );

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
// CONTACT FAB EXPANSION SYSTEM - FAST ANIMATION
// ========================================
const initContactFabSystem = () => {
  const fabSystem = document.getElementById("contactFabSystem");
  const fabFloating = document.getElementById("fabFloating");
  const formSection = document.getElementById("contactFormSection");
  const form = document.getElementById("contactMainForm");
  const hero = document.querySelector(".hero");

  if (!fabSystem || !fabFloating || !formSection) return;

  let hasExpanded = false;

  // Detectar posiciÃƒÂ³n y controlar visibilidad
  const checkScrollVisibility = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollFromBottom = pageHeight - (scrollPosition + windowHeight);

    // Altura del hero (si existe)
    const heroHeight = hero ? hero.offsetHeight : windowHeight;

    // PosiciÃƒÂ³n de la secciÃƒÂ³n de formulario
    const formSectionTop = formSection.offsetTop;
    const formSectionBottom = formSectionTop + formSection.offsetHeight;

    // LÃƒÂ³gica de visibilidad
    if (scrollPosition < heroHeight - 100) {
      // Estamos en el Hero - ocultar botÃƒÂ³n
      fabSystem.classList.add("hide");
    } else if (
      scrollPosition + windowHeight >= formSectionTop &&
      scrollPosition < formSectionBottom
    ) {
      // Estamos en la secciÃƒÂ³n del formulario - ocultar botÃƒÂ³n
      fabSystem.classList.add("hide");
    } else {
      // Estamos en otras secciones - mostrar botÃƒÂ³n
      fabSystem.classList.remove("hide");
    }

    // Expandir formulario cuando llegamos cerca del final
    if (scrollFromBottom < 1500 && !hasExpanded) {
      expandContact();
    }
  };

  // Expandir - MÃƒÂS RÃƒÂPIDO
  const expandContact = () => {
    if (hasExpanded) return;
    hasExpanded = true;

    fabSystem.classList.add("hide");
    // Reducido de 300ms a 100ms
    setTimeout(() => {
      formSection.classList.add("show");
    }, 10);
  };

  // Click en FAB
  fabFloating.addEventListener("click", () => {
    if (!hasExpanded) {
      // Scroll suave al formulario
      formSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // Reducido de 600ms a 300ms
      setTimeout(() => expandContact(), 300);
    }
  });

  // Pills de tÃƒÂ³picos
  const pills = document.querySelectorAll(".pill-topic");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  // Submit
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      form.reset();
    });
  }

  // Listener de scroll
  window.addEventListener("scroll", checkScrollVisibility);

  // Check inicial
  checkScrollVisibility();
};

// ========================================
// INICIALIZACIÃƒâ€œN
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  //initPreloader();
  setTimeout(() => {
    initAnimatedHeader();
    initNavigation();
    initParallax();
    initVideoBackground();
    initOfferSection();
    initScrollAnimations();
    initStaggerAnimations();
    initMagneticButtons();
    initContactFabSystem(); // Ã¢â€ Â CAMBIAR AQUÃƒÂ
    initImageReveal();
    initScrollProgress();
    initCardEffects();
  }, 500);
});

// ========================================
// HERO BADGES CAROUSEL
// ========================================

function initBadgesCarousel() {
  const badgesCarousel = document.querySelector(".badges-carousel");
  const partnerCarousel = document.querySelector(".partner-carousel");

  if (!badgesCarousel && !partnerCarousel) return;

  // Function to rotate slides
  function rotateSlides(carousel, interval) {
    const slides = carousel.querySelectorAll(".badge-slide, .partner-slide");
    if (slides.length <= 1) return;

    let currentIndex = 0;

    setInterval(() => {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
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
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initBadgesCarousel);
} else {
  initBadgesCarousel();
}

document
  .getElementById("contactMainForm")
  .addEventListener("submit", function (event) {
    const politica = document.getElementById("politica");
    const telefono = document.getElementById("telefono");

    // Validar checkbox obligatorio
    if (!politica.checked) {
      alert("Debes aceptar la polÃƒÂ­tica de privacidad antes de enviar.");
      event.preventDefault();
      return;
    }

    // Validar solo nÃƒÂºmeros en telÃƒÂ©fono
    const regex = /^[0-9]{6,15}$/; // de 6 a 15 dÃƒÂ­gitos
    if (!regex.test(telefono.value)) {
      alert(
        "El campo TelÃƒÂ©fono solo puede contener nÃƒÂºmeros (entre 6 y 15 dÃƒÂ­gitos)."
      );
      event.preventDefault();
      return;
    }
  });

// Evita que se puedan ingresar letras en tiempo real
document.getElementById("telefono").addEventListener("input", function (e) {
  this.value = this.value.replace(/[^0-9]/g, "");
});

// Manejo del formulario de contacto
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactMainForm");
  const topicButtons = document.querySelectorAll(".pill-topic");
  const topicInput = document.getElementById("tema_conversacion");

  // Manejo de botones de tema
  topicButtons.forEach((button) => {
    button.addEventListener("click", function () {
      topicButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      topicInput.value = this.getAttribute("data-value") || this.textContent;
    });
  });

  // Envío del formulario
  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const submitBtn = form.querySelector(".submit-form-btn");
    const originalBtnText = submitBtn.innerHTML;

    // Deshabilitar botón y mostrar estado de carga
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Enviando... <span class="arrow">→</span>';

    try {
      const formData = new FormData(form);
      const response = await fetch("procesar_contacto.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Limpiar formulario
        form.reset();
        // Resetear tema seleccionado
        topicButtons.forEach((btn) => btn.classList.remove("active"));
        topicButtons[0].classList.add("active");
        topicInput.value = topicButtons[0].getAttribute("data-value");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Restaurar botón
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});

// Animación de aparición para las tarjetas de equipo
const observerTeam = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.team-card').forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observerTeam.observe(card);
});
