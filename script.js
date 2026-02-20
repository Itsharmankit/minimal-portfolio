/* ==========================================
   ANKIT SHARMA PORTFOLIO - CLEAN VERSION
========================================== */

/* ==========================================
   ANKIT SHARMA PORTFOLIO - CLEAN VERSION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // GSAP SETUP (SAFE VERSION)
  // ==========================================

  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }
  } else {
    console.error("GSAP not loaded");
  }


  // ==========================================
  // CONTACT FORM CONNECTION
  // ==========================================

  const form = document.querySelector("#contactForm");

  if (form) {
    form.addEventListener("submit", async function (e) {

      e.preventDefault();   // Stop page reload

      console.log("Form submitted");

      const data = {
        name: form.querySelector('input[name="name"]').value,
        email: form.querySelector('input[name="email"]').value,
        message: form.querySelector('textarea[name="message"]').value
      };

      try {
        const response = await fetch(
          "https://portfolio-backend-wt5.onrender.com/contact",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        if (!response.ok) {
          throw new Error("Submission failed");
        }

        alert("Message sent successfully!");
        form.reset();

      } catch (error) {
        console.error("Error:", error);
        alert("Error sending message");
      }

    });
  }

  // ==========================================
  // DETECT MOBILE/TOUCH DEVICES
  // ==========================================
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  
  if (isTouchDevice) {
    document.body.classList.add('touch-device');
  }

  // ==========================================
  // DETECT REDUCED MOTION PREFERENCE
  // ==========================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ── PARTICLE EXPLOSION EFFECT (DISABLED FOR PERFORMANCE) ── */

  /* ── LOADER + HERO ENTRANCE (SIMPLIFIED) ── */
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }

  /* ── NAV: SCROLL STATE + MORPHIC ACTIVE PILL ── */
  const nav = document.getElementById('mainNav');
  const pillLinks = document.querySelectorAll('.nav-pill-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      nav.classList.remove('hero-zone');
      nav.classList.add('scrolled');
    } else {
      nav.classList.add('hero-zone');
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active pill tracks current section via IntersectionObserver
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        pillLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  window.addEventListener('scroll', () => {
    if (window.scrollY < 80) {
      pillLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.section === 'hero');
      });
    }
  }, { passive: true });

  /* ── SCROLL PROGRESS BAR ── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    let ticking = false;
    
    function updateProgressBar() {
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      progressBar.style.width = pct + '%';
      ticking = false;
    }
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgressBar);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── HERO BUTTONS COLOR SWAP ── */
  const primaryBtn = document.querySelector('.hero-btn-primary');
  const secondaryBtn = document.querySelector('.hero-btn-secondary');

  if (primaryBtn && secondaryBtn) {
    primaryBtn.addEventListener('mouseenter', () => {
      primaryBtn.style.cssText = 'background: var(--black) !important; color: var(--white) !important;';
      secondaryBtn.style.cssText = 'background: var(--white) !important; color: var(--black) !important;';
    });
    
    primaryBtn.addEventListener('mouseleave', () => {
      primaryBtn.style.cssText = '';
      secondaryBtn.style.cssText = '';
    });
    
    secondaryBtn.addEventListener('mouseenter', () => {
      secondaryBtn.style.cssText = 'background: var(--white) !important; color: var(--black) !important;';
      primaryBtn.style.cssText = 'background: var(--black) !important; color: var(--white) !important;';
    });
    
    secondaryBtn.addEventListener('mouseleave', () => {
      secondaryBtn.style.cssText = '';
      primaryBtn.style.cssText = '';
    });
  }

  /* ── FORM VALIDATION & SUBMISSION ── */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      
      const formData = {
        name: document.getElementById('name') ? document.getElementById('name').value.trim() : '',
        email: document.getElementById('email') ? document.getElementById('email').value.trim() : '',
        subject: document.getElementById('subject') ? document.getElementById('subject').value.trim() : '',
        message: document.getElementById('message') ? document.getElementById('message').value.trim() : ''
      };
      
      if (!formData.name || formData.name.length < 2) {
        showFormStatus('Please enter a valid name', 'error');
        return;
      }
      
      if (!isValidEmail(formData.email)) {
        showFormStatus('Please enter a valid email address', 'error');
        return;
      }
      
      if (!formData.subject || formData.subject.length < 3) {
        showFormStatus('Please enter a subject', 'error');
        return;
      }
      
      if (!formData.message || formData.message.length < 10) {
        showFormStatus('Please enter a message (at least 10 characters)', 'error');
        return;
      }
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        await simulateFormSubmission(formData);
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } catch (error) {
        showFormStatus('Oops! Something went wrong. Please try again or email directly.', 'error');
        console.error('Form submission error:', error);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get In Touch';
      }
    });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showFormStatus(message, type) {
    if (formStatus) {
      formStatus.textContent = message;
      formStatus.className = `form-status form-status-${type}`;
    }
  }

  async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          console.log('Form data:', data);
          resolve();
        } else {
          reject(new Error('Simulated network error'));
        }
      }, 1500);
    });
  }

}); // End DOMContentLoaded
