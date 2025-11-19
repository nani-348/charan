document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                const icon = mobileBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Active Link Highlighting
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Form Submission with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Replace these with your actual Service ID and Template ID from EmailJS
            const serviceID = 'service_d56n9km';
            const templateID = 'template_mpencfi';

            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                to_name: "E Charan Kumar Reddy" // Optional: Add if your template uses it
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, (err) => {
                    alert('Failed to send message. Please try again later.');
                    console.error('EmailJS Error:', err);
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Background Animation
    initBackgroundAnimation();
});

function initBackgroundAnimation() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let orbs = [];

    window.addEventListener('resize', resize);

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initOrbs();
    }

    class Orb {
        constructor() {
            this.radius = Math.random() * 200 + 100;
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;

            // Randomize between Light Dim Green variations
            const type = Math.random();
            if (type < 0.4) {
                this.r = 144; this.g = 238; this.b = 144; // Light Green
            } else if (type < 0.8) {
                this.r = 152; this.g = 251; this.b = 152; // Pale Green
            } else {
                this.r = 160; this.g = 220; this.b = 160; // Dimmer Green
            }
            this.alpha = Math.random() * 0.15 + 0.05;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Soft bounce/wrap
            if (this.x < -this.radius) this.x = width + this.radius;
            if (this.x > width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = height + this.radius;
            if (this.y > height + this.radius) this.y = -this.radius;
        }

        draw() {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, `rgba(${this.r}, ${this.g}, ${this.b}, ${this.alpha})`);
            gradient.addColorStop(1, `rgba(${this.r}, ${this.g}, ${this.b}, 0)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initOrbs() {
        orbs = [];
        const orbCount = 12; // Number of orbs
        for (let i = 0; i < orbCount; i++) {
            orbs.push(new Orb());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        orbs.forEach(orb => {
            orb.update();
            orb.draw();
        });

        requestAnimationFrame(animate);
    }

    resize();
    animate();
}
