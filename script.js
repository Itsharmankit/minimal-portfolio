/* ==========================================
   ANKIT SHARMA PORTFOLIO - CLEAN VERSION
========================================== */

/* ==========================================
   ANKIT SHARMA PORTFOLIO - CLEAN VERSION
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  // Wait for GSAP to be available
  function waitForGSAP(callback, attempts = 0) {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      callback();
    } else if (attempts < 50) {
      setTimeout(() => waitForGSAP(callback, attempts + 1), 100);
    } else {
      console.error("GSAP failed to load after 5 seconds");
      callback(); // Continue anyway with limited functionality
    }
  }

  waitForGSAP(initializePortfolio);

  function initializePortfolio() {
    // ==========================================
    // GSAP SETUP (SAFE VERSION)
    // ==========================================

    const gsapAvailable = typeof gsap !== "undefined";
    const scrollTriggerAvailable = typeof ScrollTrigger !== "undefined";

    if (gsapAvailable && scrollTriggerAvailable) {
      gsap.registerPlugin(ScrollTrigger);
      console.log("✓ GSAP and ScrollTrigger loaded successfully");
    } else {
      console.warn("GSAP or ScrollTrigger not available - using fallback animations");
      // Fallback: Show elements using CSS animations
      document.documentElement.style.setProperty('--gsap-failed', 'true');
    }

    // ==========================================
    // SHOW CURSOR AS FALLBACK
    // ==========================================
    const isTouchDevice2 = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice2) {
      const cursor = document.getElementById('cursor');
      const follower = document.getElementById('cursorFollower');
      if (cursor) cursor.style.display = 'block';
      if (follower) follower.style.display = 'block';
      console.log("✓ Cursor elements shown");
    }

    // ==========================================
    // HIDE LOADER AFTER DELAY IF GSAP NOT AVAILABLE
    // ==========================================
    if (!gsapAvailable) {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.display = 'none';
          console.log("✓ Loader hidden (fallback)");
        }
      }, 2000);
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

  /* ── HERO MOUSE PARALLAX ── */
  if (!isTouchDevice && !prefersReducedMotion && gsapAvailable) {
    document.addEventListener('mousemove', e => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 12;
      const ry = (e.clientY / window.innerHeight - 0.5) * 12;
      gsap.to('.hero-bg-text', {
        x: rx * 0.6, y: ry * 0.6, duration: 1.4, ease: 'power2.out', overwrite: 'auto'
      });
    }, { passive: true });
  }

  /* ── LETTER-BY-LETTER REVEAL ON SECTION LABELS ── */
  if (!prefersReducedMotion) {
    const labelElements = document.querySelectorAll('.section-label, .skills-label, .about-label, .contact-eyebrow');
    
    const labelObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('span').forEach(s => { 
            s.style.opacity = '1'; 
            s.style.transform = 'translateY(0)'; 
          });
          labelObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    labelElements.forEach(el => {
      const text = el.textContent;
      el.textContent = '';
      text.split('').forEach((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.cssText = 'display:inline-block;opacity:0;transform:translateY(10px);transition:opacity .35s ' + (i * 0.03) + 's,transform .35s ' + (i * 0.03) + 's';
        el.appendChild(span);
      });
      labelObserver.observe(el);
    });
  }

  /* ── CURSOR (Disabled on touch devices) ── */
  if (!isTouchDevice) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    
    if (cursor && follower) {
      cursor.style.display = 'block';
      follower.style.display = 'block';
      
      let mx = 0, my = 0, fx = 0, fy = 0;

      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

      (function tick() {
        cursor.style.transform = `translate3d(${mx - 5}px,${my - 5}px,0)`;
        fx += (mx - fx) * 0.12;
        fy += (my - fy) * 0.12;
        follower.style.transform = `translate3d(${fx - 18}px,${fy - 18}px,0)`;
        requestAnimationFrame(tick);
      })();

      document.querySelectorAll(
        'a, button, .service-card, .project-item, .hero-role, .social-icon-btn, .skill-item, .section-header'
      ).forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursor.classList.add('expand');
          follower.classList.add('expand');
        });
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('expand');
          follower.classList.remove('expand');
        });
      });
    }
  }

  /* ── PARTICLE EXPLOSION EFFECT ── */
  function createParticleExplosion(x, y) {
    if (!gsapAvailable) return;
    
    const particleCount = 8;
    const colors = ['var(--black)', 'var(--white)', '#FFD700', '#FFA500', '#666'];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-explosion';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      
      document.body.appendChild(particle);
      
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 60 + 40;
      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;
      
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

  /* ── ADD PARTICLE EFFECT TO ELEMENTS ── */
  function addParticleEffect(selector) {
    if (!gsapAvailable) return;
    
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('click', function(e) {
        const rect = element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        createParticleExplosion(x, y);
        
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

  /* ── APPLY PARTICLE EFFECTS ── */
  addParticleEffect('.nav-logo');
  addParticleEffect('.hero-btn');
  addParticleEffect('.nav-pill-link');
  addParticleEffect('.social-icon-btn');
  addParticleEffect('.footer-social');

  /* ── SCROLL ANIMATIONS ── */
  if (!prefersReducedMotion && gsapAvailable && scrollTriggerAvailable) {
    gsap.from('.about-heading', {
      opacity: 0, y: 44, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }
    });
    gsap.from('.about-text', {
      opacity: 0, y: 24, duration: 0.6, delay: 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }
    });
    gsap.from('.about-stats', {
      opacity: 0, y: 24, duration: 0.6, delay: 0.2, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 76%', once: true }
    });
    gsap.from('.about-img-box', {
      opacity: 0, scale: 0.95, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#about', start: 'top 65%', once: true }
    });

    ScrollTrigger.batch('.skill-item', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.from(els, { opacity: 0, y: 18, duration: 0.45, stagger: 0.04, ease: 'power2.out' })
    });

    ScrollTrigger.batch('.service-card', {
      start: 'top 88%', once: true,
      onEnter: els => gsap.from(els, { opacity: 0, y: 44, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
    });

    ScrollTrigger.batch('.project-item', {
      start: 'top 92%', once: true,
      onEnter: els => gsap.from(els, { opacity: 0, x: -20, duration: 0.5, stagger: 0.07, ease: 'power2.out' })
    });

    ScrollTrigger.batch('.section-title', {
      start: 'top 88%', once: true,
      onEnter: els => gsap.from(els, { opacity: 0, y: 36, duration: 0.6, ease: 'power2.out' })
    });

    gsap.from('.contact-heading', {
      opacity: 0, y: 56, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '#contact', start: 'top 76%', once: true }
    });

    ScrollTrigger.batch('.social-icon-btn', {
      start: 'top 90%', once: true,
      onEnter: els => gsap.from(els, { opacity: 0, y: 24, scale: 0.9, duration: 0.5, stagger: 0.08, ease: 'power2.out' })
    });
  }

  /* ── STAT COUNTER ANIMATION ── */
  if (!prefersReducedMotion && gsapAvailable && scrollTriggerAvailable) {
    document.querySelectorAll('.stat-num').forEach(el => {
      const raw = el.textContent.trim();
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');

      let isAnimating = false;

      function animateCounter(duration = 1.6) {
        if (isAnimating) return;
        isAnimating = true;
        
        gsap.to({ val: 0 }, {
          val: num,
          duration: duration,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          },
          onComplete: () => {
            isAnimating = false;
          }
        });
      }

      el.textContent = '0' + suffix;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => animateCounter()
      });

      if (!isTouchDevice) {
        el.parentElement.addEventListener('mouseenter', () => {
          if (!isAnimating) {
            el.textContent = '0' + suffix;
            animateCounter(1.2);
          }
        });
      }
    });
  }

  /* ── HERO IMAGE SCROLL PARALLAX ── */
  if (!prefersReducedMotion && gsapAvailable && scrollTriggerAvailable) {
    gsap.to('.hero-image-wrapper', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true
      }
    });
  }

  /* ── ABOUT IMAGE CLIP-PATH WIPE REVEAL ── */
  if (!prefersReducedMotion && scrollTriggerAvailable) {
    ScrollTrigger.create({
      trigger: '.about-img-box',
      start: 'top 72%',
      once: true,
      onEnter: () => {
        const imgBox = document.querySelector('.about-img-box');
        if (imgBox) imgBox.classList.add('revealed');
      }
    });
  }

  /* ── SECTION TITLE CHARACTER REVEAL ── */
  if (!prefersReducedMotion) {
    document.querySelectorAll('.section-title, .skills-title').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          obs.disconnect();
        }
      }, { threshold: 0.3 });
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      obs.observe(el);
    });
  }

  /* ── MAGNETIC CTA BUTTONS ── */
  if (!isTouchDevice && !prefersReducedMotion && gsapAvailable) {
    document.querySelectorAll('.hero-btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease';
      });
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(btn, { x: dx * 0.28, y: dy * 0.28, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.4)', overwrite: 'auto' });
      });
    });
  }

  /* ── HERO ANIMATED TEXT PULSE ── */
  if (!prefersReducedMotion && gsapAvailable) {
    gsap.timeline({ repeat: -1, repeatDelay: 2 })
      .to('#heroWord1', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 0)
      .to('#heroWord1', { scale: 1, duration: 0.3, ease: 'power2.in' }, 0.5)
      .to('#heroWord2', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 1)
      .to('#heroWord2', { scale: 1, duration: 0.3, ease: 'power2.in' }, 1.5)
      .to('#heroWord3', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 2)
      .to('#heroWord3', { scale: 1, duration: 0.3, ease: 'power2.in' }, 2.5);
  }

  /* ── PARTICLE BURST ON BUTTON CLICK ── */
  function burstParticles(e) {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = 8;
    const colors = ['#0a0a0a', '#555', '#888', '#0a0a0a'];

    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle-dot';
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      p.style.background = colors[i % colors.length];

      const angle = (360 / count) * i;
      const dist = 30 + Math.random() * 30;
      const dx = Math.cos(angle * Math.PI / 180) * dist;
      const dy = Math.sin(angle * Math.PI / 180) * dist;
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.animationDelay = (i * 0.04) + 's';

      document.body.appendChild(p);
      
      let removed = false;
      const cleanup = () => {
        if (!removed) {
          removed = true;
          p.remove();
        }
      };
      p.addEventListener('animationend', cleanup);
      setTimeout(cleanup, 1000);
    }

    btn.style.transform = 'scale(0.94)';
    setTimeout(() => btn.style.transform = '', 120);
  }

  document.querySelectorAll('.hero-btn, .social-icon-btn').forEach(btn => btn.addEventListener('click', burstParticles));

  /* ── PARTICLE EXPLOSION EFFECT (DISABLED FOR PERFORMANCE) ── */

  /* ── LOADER + HERO ENTRANCE ── */
  const animDuration = prefersReducedMotion ? 0.2 : 0.7;
  const animStagger = prefersReducedMotion ? 0.02 : 0.12;

  const loaderText = document.getElementById('loaderText');
  if (loaderText) {
    setTimeout(() => {
      loaderText.textContent = 'SHARMA';
    }, prefersReducedMotion ? 150 : 400);
  }

  if (gsapAvailable) {
    gsap.timeline({
      onComplete: () => {
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none';
        
        gsap.timeline()
          .to('.hero-name .line', { y: 0, opacity: 1, duration: animDuration, stagger: animStagger, ease: 'power3.out' })
          .to('.hero-tagline', { opacity: 1, duration: animDuration * 0.85, ease: 'power2.out' }, '-=.3')
          .to('.hero-animated-text', { opacity: 1, duration: animDuration * 0.7, ease: 'power2.out' }, '-=.2')
          .to('.hero-cta', { opacity: 1, duration: animDuration * 0.7, ease: 'power2.out' }, '-=.2')
          .to('.hero-image-box', { opacity: 1, scale: 1, duration: animDuration * 1.15, ease: 'power2.out' }, '-=.5')
          .to('.hero-scroll', { opacity: 1, duration: animDuration * 0.7, ease: 'power2.out' }, '-=.2');
      }
    })
      .to('#loaderText', { opacity: 0, duration: prefersReducedMotion ? 0.15 : 0.3, delay: prefersReducedMotion ? 0.2 : 0.6 })
      .to('#loader', { yPercent: -100, duration: prefersReducedMotion ? 0.3 : 0.65, ease: 'power4.inOut' });
  } else {
    // Fallback: Hide loader and show hero elements without GSAP
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.style.display = 'none';
      
      // Show hero elements immediately (CSS animations will handle the rest)
      document.querySelectorAll('.hero-name .line, .hero-tagline, .hero-animated-text, .hero-cta, .hero-image-box, .hero-scroll').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }, 1500);
  }

  /* ── NAV: SCROLL STATE + MORPHIC ACTIVE PILL ── */
  const nav = document.getElementById('mainNav');
  const pillLinks = document.querySelectorAll('.nav-pill-link');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        nav.classList.remove('hero-zone');
        nav.classList.add('scrolled');
      } else {
        nav.classList.add('hero-zone');
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

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
      let pct = 0;
      if (total > 0) {
        pct = (window.scrollY / total) * 100;
      }
      pct = Math.max(0, Math.min(100, pct));
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
      
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
      
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
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      try {
        await simulateFormSubmission(formData);
        showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
      } catch (error) {
        showFormStatus('Oops! Something went wrong. Please try again or email directly.', 'error');
        console.error('Form submission error:', error);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get In Touch';
        }
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

  } // End initializePortfolio function

}); // End DOMContentLoaded
