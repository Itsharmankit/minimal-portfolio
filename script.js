/* =============================================
   ANKIT SHARMA PORTFOLIO — script.js
   IMPROVED VERSION - Performance & Accessibility Optimized
   ============================================= */

// Configuration constants
const API_BASE_URL = 'https://portfollio-backend-wwt5.onrender.com';
const API_TIMEOUT = 30000; // 30 seconds

// Wait for DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function() {

// Check if GSAP is loaded
if (typeof gsap === 'undefined') {
    console.error('GSAP library failed to load. Check your internet connection.');
    // Remove loader to show content even if GSAP fails
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    document.querySelectorAll('.hero-tagline, .hero-animated-text, .hero-cta, .hero-name .line, .hero-image-box, .hero-scroll').forEach(el => {
        el.style.opacity = '1';
        el.style.visibility = 'visible';
        el.style.transform = 'none';
    });
    return;
}

gsap.registerPlugin(ScrollTrigger);

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
    const heroBgText = document.querySelector('.hero-bg-text');
    if (heroBgText) {
        document.addEventListener('mousemove', e => {
            const rx = (e.clientX / window.innerWidth - 0.5) * 12;
            const ry = (e.clientY / window.innerHeight - 0.5) * 12;
            gsap.to(heroBgText, {
                x: rx * 0.6, y: ry * 0.6, duration: 1.4, ease: 'power2.out', overwrite: 'auto'
            });
        }, { passive: true });
    }
}

/* ── XVS-STYLE LETTER-BY-LETTER REVEAL ON SECTION LABELS (Optimized) ── */
if (!prefersReducedMotion) {
    const labelElements = document.querySelectorAll('.section-label, .skills-label, .about-label, .contact-eyebrow');
    
    // Single shared IntersectionObserver for all labels (performance optimization)
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
        // Show cursors
        cursor.style.display = 'block';
        follower.style.display = 'block';

        let mx = 0, my = 0, fx = 0, fy = 0;
        let lastDetect = 0;
        let isOverText = false;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

        function getBackgroundBrightness(element) {
            const bgColor = window.getComputedStyle(element).backgroundColor;
            if (!bgColor || bgColor === 'rgba(0, 0, 0, 0)') return 255;
            
            const rgb = bgColor.match(/\d+/g);
            if (!rgb || rgb.length < 3) return 255;
            
            const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
            return brightness;
        }

        function isTextOrImage(element) {
            if (!element) return false;

            if (element.closest('a, button, .hero-btn, .nav-pill-link, .skill-item')) {
                return true;
            }

            if (element.closest(
                '.project-name, .project-cat, .project-tag, .service-title, .service-desc, .service-tag, .skill-name, .contact-desc, .contact-heading, .section-label, .section-title, .stat-num, .stat-label, .hero-tagline, .about-heading'
            )) {
                return true;
            }

            const tagName = element.tagName;
            if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'LI', 'BUTTON', 'IMG', 'SVG', 'PATH', 'STRONG', 'B', 'EM', 'I', 'U'].includes(tagName)) {
                return true;
            }

            // Check for dark backgrounds (projects with black background)
            if (element.closest('.project-card, .project-box')) {
                const brightness = getBackgroundBrightness(element);
                if (brightness < 128) {
                    return true;
                }
            }

            return false;
        }

        function updateCursorState() {
            const element = document.elementFromPoint(mx, my);
            if (!element) return;

            const overText = isTextOrImage(element);
            if (overText !== isOverText) {
                cursor.classList.toggle('expand', overText);
                follower.classList.toggle('expand', overText);
                cursor.classList.toggle('contrast', overText);
                follower.classList.toggle('contrast', overText);
                cursor.style.opacity = overText ? '1' : '';
                isOverText = overText;
            }
        }

        (function tick() {
            cursor.style.transform = `translate3d(${mx - 5}px,${my - 5}px,0)`;
            fx += (mx - fx) * 0.12;
            fy += (my - fy) * 0.12;
            follower.style.transform = `translate3d(${fx - 18}px,${fy - 18}px,0)`;

            const now = performance.now();
            if (now - lastDetect > 80) {
                updateCursorState();
                lastDetect = now;
            }
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

/* ── APPLY PARTICLE EFFECTS TO INTERACTIVE ELEMENTS ── */
addParticleEffect('.nav-logo');            // AS logo
addParticleEffect('.hero-btn');            // Hero buttons
addParticleEffect('.nav-pill-link');       // Navigation links
addParticleEffect('.social-icon-btn');     // Contact social icons
addParticleEffect('.footer-social');       // Footer social icons

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

/* ── LOADER + HERO ENTRANCE (Respects reduced motion) ── */
const animDuration = prefersReducedMotion ? 0.2 : 0.7;
const animStagger = prefersReducedMotion ? 0.02 : 0.12;

const loaderText = document.getElementById('loaderText');
if (loaderText) {
    // Simple text change without TextPlugin
    setTimeout(() => {
        loaderText.textContent = 'SHARMA';
    }, prefersReducedMotion ? 150 : 400);
}

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

/* ── HERO ANIMATED TEXT PULSE (Respects reduced motion) ── */
if (!prefersReducedMotion) {
    gsap.timeline({ repeat: -1, repeatDelay: 2 })
        .to('#heroWord1', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 0)
        .to('#heroWord1', { scale: 1, duration: 0.3, ease: 'power2.in' }, 0.5)
        .to('#heroWord2', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 1)
        .to('#heroWord2', { scale: 1, duration: 0.3, ease: 'power2.in' }, 1.5)
        .to('#heroWord3', { scale: 1.1, color: '#0a0a0a', duration: 0.3, ease: 'power2.out' }, 2)
        .to('#heroWord3', { scale: 1, duration: 0.3, ease: 'power2.in' }, 2.5);
}

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

/* ── SCROLL ANIMATIONS (Respects reduced motion) ── */
if (!prefersReducedMotion) {
    // About
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
    // About video - no animation, show immediately
    // gsap.from('.about-img-box', {
    //     opacity: 0, scale: 0.95, duration: 0.8, ease: 'power2.out',
    //     scrollTrigger: { trigger: '#about', start: 'top 65%', once: true }
    // });

    // Skills
    ScrollTrigger.batch('.skill-item', {
        start: 'top 90%', once: true,
        onEnter: els => gsap.from(els, { opacity: 0, y: 18, duration: 0.45, stagger: 0.04, ease: 'power2.out' })
    });

    // Services
    ScrollTrigger.batch('.service-card', {
        start: 'top 88%', once: true,
        onEnter: els => gsap.from(els, { opacity: 0, y: 44, duration: 0.6, stagger: 0.1, ease: 'power2.out' })
    });

    // Projects
    ScrollTrigger.batch('.project-item', {
        start: 'top 92%', once: true,
        onEnter: els => gsap.from(els, { opacity: 0, x: -20, duration: 0.5, stagger: 0.07, ease: 'power2.out' })
    });

    // Section titles
    ScrollTrigger.batch('.section-title', {
        start: 'top 88%', once: true,
        onEnter: els => gsap.from(els, { opacity: 0, y: 36, duration: 0.6, ease: 'power2.out' })
    });

    // Contact
    gsap.from('.contact-heading', {
        opacity: 0, y: 56, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 76%', once: true }
    });

    // Social buttons
    ScrollTrigger.batch('.social-icon-btn', {
        start: 'top 90%', once: true,
        onEnter: els => gsap.from(els, { opacity: 0, y: 24, scale: 0.9, duration: 0.5, stagger: 0.08, ease: 'power2.out' })
    });
}

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

/* ── 2. MAGNETIC CTA BUTTONS (Optimized) ── */
if (!isTouchDevice && !prefersReducedMotion) {
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

/* ── 3. HERO IMAGE SCROLL PARALLAX (Optimized) ── */
if (!prefersReducedMotion) {
    gsap.to('.hero-image-wrapper', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1, // Smoothing value (was true, now 1 for better performance)
            invalidateOnRefresh: true
        }
    });
}

/* ── 4. STAT COUNTER ANIMATION (Simplified and optimized) ── */
if (!prefersReducedMotion) {
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

        // Initial animation on scroll
        el.textContent = '0' + suffix;
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => animateCounter()
        });

        // Replay animation on hover (debounced)
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

/* ── 6. ABOUT IMAGE CLIP-PATH WIPE REVEAL ── */
// Disabled for video display
/*
if (!prefersReducedMotion) {
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
*/

/* ── 7. SECTION TITLE CHARACTER REVEAL (Optimized - Simplified) ── */
// Simplified version without creating hundreds of span elements
if (!prefersReducedMotion) {
    document.querySelectorAll('.section-title, .skills-title').forEach(el => {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                obs.disconnect();
            }
        }, { threshold: 0.3 });
        // Set initial state
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        obs.observe(el);
    });
}

/* ── PARTICLE BURST ON BUTTON CLICK (Fixed: added timeout fallback) ── */
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
        
        // Cleanup with both event listener and timeout fallback
        let removed = false;
        const cleanup = () => {
            if (!removed) {
                removed = true;
                p.remove();
            }
        };
        p.addEventListener('animationend', cleanup);
        setTimeout(cleanup, 1000); // Fallback timeout
    }

    // Brief scale-down press feel
    btn.style.transform = 'scale(0.94)';
    setTimeout(() => btn.style.transform = '', 120);
}

document.querySelectorAll(
    '.hero-btn, .social-icon-btn'
).forEach(btn => btn.addEventListener('click', burstParticles));

/* ══════════════════════════════════════
   FORM VALIDATION & SUBMISSION
══════════════════════════════════════ */

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const phoneInput = document.getElementById('phone');

if (phoneInput) {
    phoneInput.addEventListener('input', () => {
        const digitsOnly = phoneInput.value.replace(/\D/g, '');
        if (phoneInput.value !== digitsOnly) {
            phoneInput.value = digitsOnly;
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous status
        if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
        }
        
        // Get form data
        const rawPhone = document.getElementById('phone').value.trim();
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: rawPhone,
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
        
        if (!formData.phone) {
            showFormStatus('Please enter a phone number', 'error');
            return;
        }
        
        if (!formData.message || formData.message.length < 10) {
            showFormStatus('Please enter a message (at least 10 characters)', 'error');
            return;
        }
        
        // Disable submit button
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }
        
        try {
            await submitContactForm(formData);

            // Success
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } catch (error) {
            showFormStatus('Oops! Something went wrong. Please try again or email directly.', 'error');
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.error('Form submission error:', error);
            }
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
    if (!formStatus) {
        return;
    }
    formStatus.textContent = message;
    formStatus.className = `form-status form-status-${type}`;
}

async function submitContactForm(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Submission failed: ${response.status} ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(`Request timeout: The server did not respond within ${API_TIMEOUT / 1000} seconds`);
        }

        throw error;
    }
}

}); // End DOMContentLoaded
