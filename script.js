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

});

/* ── PARTICLE EXPLOSION EFFECT ── */
function createParticleExplosion(x, y) {
    const particleCount = 8;
    const colors = ['var(--black)', 'var(--white)', '#FFD700', '#FFA500', '#666'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle-explosion';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        document.body.appendChild(particle);
        
        // Random direction and distance
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const distance = Math.random() * 60 + 40;
        const moveX = Math.cos(angle) * distance;
        const moveY = Math.sin(angle) * distance;
        
        // Animate with GSAP
        gsap.to(particle, {
            x: moveX,
            y: moveY,
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            duration: 0.8,
            delay: i * 0.05,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// Add particle effect to elements
function addParticleEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        element.addEventListener('click', function(e) {
            // Prevent default for navigation temporarily to show effect
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            createParticleExplosion(x, y);
            
            // Add scale effect to button
            gsap.to(element, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut'
            });
        });
    });
}

/* ── DETECT MOBILE/TOUCH DEVICES ── */
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Add class to body for CSS targeting
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

/* ── DETECT REDUCED MOTION PREFERENCE ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── SMOOTH SCROLL REMOVED (Using native CSS scroll-behavior and GSAP ScrollTrigger) ── */
// Previous expensive smooth scroll implementation removed for performance

/* ── HERO MOUSE PARALLAX (Fixed: removed pseudo-element targeting) ── */
if (!isTouchDevice && !prefersReducedMotion) {
    document.addEventListener('mousemove', e => {
        const rx = (e.clientX / window.innerWidth - 0.5) * 12;
        const ry = (e.clientY / window.innerHeight - 0.5) * 12;
        gsap.to('.hero-bg-text', {
            x: rx * 0.6, y: ry * 0.6, duration: 1.4, ease: 'power2.out', overwrite: 'auto'
        });
    }, { passive: true });
}

/* ── XVS-STYLE LETTER-BY-LETTER REVEAL ON SECTION LABELS (DISABLED) ── */
// DISABLED: Removed expensive DOM creation causing freeze
// Creating hundreds of span elements was blocking page interaction

/* ── CURSOR (Disabled on touch devices) ── */
// Cursor loop disabled for performance - use CSS instead

/* ── APPLY PARTICLE EFFECTS TO INTERACTIVE ELEMENTS (DISABLED) ── */
// Removed particle effects for performance optimization

/* ── NAV: SCROLL STATE + MORPHIC ACTIVE PILL ── */
const nav = document.getElementById('mainNav');
const pillLinks = document.querySelectorAll('.nav-pill-link');

// Frosted/shadow state on scroll
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

// Also set Home active when at very top
window.addEventListener('scroll', () => {
    if (window.scrollY < 80) {
        pillLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === 'hero');
        });
    }
}, { passive: true });

/* ── LOADER + HERO ENTRANCE (SIMPLIFIED) ── */
// Minimal loader animation to avoid freeze
const loader = document.getElementById('loader');
if (loader) {
    setTimeout(() => {
        loader.style.display = 'none';
    }, 800);
}

/* ── HERO ANIMATED TEXT PULSE (DISABLED) ── */
// Removed for performance optimization

/* float animation removed */

/* ── HERO DECORATIVE ELEMENTS (Respects reduced motion) ── */
// Note: These elements don't exist in the HTML, so this animation is commented out
// If you want to add decorative elements, uncomment this and add the HTML elements
/*
if (!prefersReducedMotion) {
    gsap.timeline({ repeat: -1, yoyo: true })
        .to('.hero-circle-1', { scale: 1.05, duration: 4, ease: 'power1.inOut' }, 0)
        .to('.hero-circle-2', { scale: 0.95, duration: 3.5, ease: 'power1.inOut' }, 0)
        .to('.hero-circle-3', { scale: 1.1, duration: 3, ease: 'power1.inOut' }, 0)
        .to('.hero-dot-1', { y: -10, duration: 2.5, ease: 'power1.inOut' }, 0)
        .to('.hero-dot-2', { y: 8, duration: 2, ease: 'power1.inOut' }, 0)
        .to('.hero-dot-3', { x: -5, duration: 2.2, ease: 'power1.inOut' }, 0)
        .to('.hero-grid', { rotate: 5, duration: 8, ease: 'power1.inOut' }, 0);
}
*/

/* ── SCROLL ANIMATIONS (DISABLED for performance) ── */
// Removed expensive scroll animations causing page freeze
// ScrollTrigger batch operations were blocking rendering

/* ══════════════════════════════════════
   PREMIUM EFFECTS
══════════════════════════════════════ */

/* ── 1. SCROLL PROGRESS BAR (Optimized with RAF) ── */
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

/* ── 2. MAGNETIC CTA BUTTONS (DISABLED) ── */
// Removed mousemove tracking causing performance issues

/* ── HERO BUTTONS COLOR SWAP (Interactive hover effect) ── */
const primaryBtn = document.querySelector('.hero-btn-primary');
const secondaryBtn = document.querySelector('.hero-btn-secondary');

if (primaryBtn && secondaryBtn) {
    // When hovering primary button, swap both colors
    primaryBtn.addEventListener('mouseenter', () => {
        primaryBtn.style.cssText = 'background: var(--black) !important; color: var(--white) !important;';
        secondaryBtn.style.cssText = 'background: var(--white) !important; color: var(--black) !important;';
    });
    
    primaryBtn.addEventListener('mouseleave', () => {
        primaryBtn.style.cssText = '';
        secondaryBtn.style.cssText = '';
    });
    
    // When hovering secondary button, swap both colors
    secondaryBtn.addEventListener('mouseenter', () => {
        secondaryBtn.style.cssText = 'background: var(--white) !important; color: var(--black) !important;';
        primaryBtn.style.cssText = 'background: var(--black) !important; color: var(--white) !important;';
    });
    
    secondaryBtn.addEventListener('mouseleave', () => {
        secondaryBtn.style.cssText = '';
        primaryBtn.style.cssText = '';
    });
}

/* ── 3. HERO IMAGE SCROLL PARALLAX (DISABLED) ── */
// Removed ScrollTrigger parallax for performance

/* ── 4. STAT COUNTER ANIMATION (DISABLED) ── */
// Original counter animations removed for performance

/* ── 6. ABOUT IMAGE CLIP-PATH WIPE REVEAL (DISABLED) ── */
// Removed for performance

/* ── 7. SECTION TITLE CHARACTER REVEAL (DISABLED) ── */
// Removed expensive IntersectionObserver animations

/* ── PARTICLE BURST ON BUTTON CLICK (DISABLED) ── */
// Removed particle effects for performance

/* ══════════════════════════════════════
   FORM VALIDATION & SUBMISSION
══════════════════════════════════════ */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous status
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validation
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
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // TODO: Replace with your actual form submission endpoint
            // Example options:
            // 1. FormSpree: https://formspree.io/
            // 2. Netlify Forms: https://www.netlify.com/products/forms/
            // 3. Your own backend API
            
            // Simulated submission (replace with actual API call)
            await simulateFormSubmission(formData);
            
            // Success
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
    formStatus.textContent = message;
    formStatus.className = `form-status form-status-${type}`;
}

// Simulated form submission - REPLACE THIS with your actual backend
async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                console.log('Form data:', data);
                resolve();
            } else {
                reject(new Error('Simulated network error'));
            }
        }, 1500);
    });
}

// Real-world example with FormSpree (uncomment and add your FormSpree endpoint):
/*
async function submitForm(data) {
  const response = await fetch('https://portfollio-backend-wwt5.onrender.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Form submission failed');
  }

  return response.json();
}

/* ── CUSTOM CURSOR WITH BACKGROUND COLOR DETECTION ── */
// DISABLED: Removed expensive duplicate cursor system causing performance freeze
// The primary cursor system (#cursor and #cursorFollower) is sufficient

}); // End DOMContentLoaded
