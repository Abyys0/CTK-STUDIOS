// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = document.getElementById('particleContainer');
        this.animationId = null;
    }

    createParticle(x, y, options = {}) {
        const particle = {
            x: x || Math.random() * window.innerWidth,
            y: y || Math.random() * window.innerHeight,
            vx: options.vx !== undefined ? options.vx : (Math.random() - 0.5) * 4,
            vy: options.vy !== undefined ? options.vy : (Math.random() - 0.5) * 4,
            size: options.size || Math.random() * 4 + 2,
            color: options.color || ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b'][Math.floor(Math.random() * 4)],
            life: options.life || 1,
            maxLife: options.life || 1,
            gravity: options.gravity !== undefined ? options.gravity : 0.05
        };

        const el = document.createElement('div');
        el.className = 'particle';
        el.style.width = particle.size + 'px';
        el.style.height = particle.size + 'px';
        el.style.color = particle.color;
        el.style.left = particle.x + 'px';
        el.style.top = particle.y + 'px';
        el.style.opacity = particle.life;

        this.container.appendChild(el);
        particle.element = el;
        this.particles.push(particle);

        return particle;
    }

    update() {
        this.particles = this.particles.filter(p => p.life > 0);

        this.particles.forEach(p => {
            p.vx *= 0.98;
            p.vy *= 0.98;
            p.vy += p.gravity;

            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.008;

            if (p.x < 0 || p.x > window.innerWidth) p.vx *= -0.8;
            if (p.y < 0 || p.y > window.innerHeight) p.vy *= -0.8;

            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
            p.element.style.opacity = p.life;
        });

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.update());
        }
    }

    emit(x, y, count = 5, options = {}) {
        for (let i = 0; i < count; i++) {
            this.createParticle(x, y, options);
        }
        this.update();
    }

    clear() {
        this.particles.forEach(p => p.element.remove());
        this.particles = [];
        if (this.animationId) cancelAnimationFrame(this.animationId);
    }
}

// ===== INITIALIZE PARTICLE SYSTEM =====
const particleSystem = new ParticleSystem();

// Create ambient particles
function createAmbientParticles() {
    for (let i = 0; i < 30; i++) {
        particleSystem.createParticle(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            {
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                life: Math.random() * 0.5 + 0.3,
                gravity: 0
            }
        );
    }
    particleSystem.update();
}

createAmbientParticles();

// ===== MENU TOGGLE =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Emit particles on click
    const rect = menuToggle.getBoundingClientRect();
    particleSystem.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, 8, {
        size: Math.random() * 3 + 2,
        color: '#6366f1'
    });
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL WITH PARTICLES =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Emit particles from anchor point
                const rect = this.getBoundingClientRect();
                particleSystem.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, {
                    size: Math.random() * 3 + 2
                });

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        const submitBtn = contactForm.querySelector('.btn');
        const rect = submitBtn.getBoundingClientRect();

        // Emit celebration particles
        for (let i = 0; i < 25; i++) {
            particleSystem.emit(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                1,
                {
                    vx: (Math.random() - 0.5) * 8,
                    vy: (Math.random() - 0.5) * 8 - 2,
                    size: Math.random() * 4 + 2,
                    life: Math.random() * 0.8 + 0.5,
                    gravity: 0.15
                }
            );
        }
        
        showAlert('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        contactForm.reset();
    });
}

// Alert notification function
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Show alert
    setTimeout(() => alertDiv.classList.add('show'), 10);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 300);
    }, 5000);
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Emit particles on reveal
            const rect = entry.target.getBoundingClientRect();
            particleSystem.emit(
                rect.left + rect.width / 2,
                rect.top,
                5,
                { size: Math.random() * 2 + 1 }
            );
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service items and portfolio items
document.querySelectorAll('.service-category, .portfolio-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add active class to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const rect = element.getBoundingClientRect();

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            if (Math.random() > 0.7) {
                particleSystem.emit(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height,
                    1,
                    { size: Math.random() * 1.5 + 1 }
                );
            }
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };

    updateCounter();
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            document.querySelectorAll('.stat h3').forEach(stat => {
                const number = parseInt(stat.textContent);
                animateCounter(stat, number);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ===== INTERACTIVE FLOATING BOXES =====
document.querySelectorAll('.floating-box').forEach((box, index) => {
    box.addEventListener('click', function() {
        const rect = this.getBoundingClientRect();
        particleSystem.emit(rect.left + rect.width / 2, rect.top + rect.height / 2, 20, {
            size: Math.random() * 4 + 2,
            color: this.style.color
        });

        // Pulse animation
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = 'pulse 0.5s ease';
        }, 10);
    });

    box.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                particleSystem.emit(
                    rect.left + Math.random() * rect.width,
                    rect.top + Math.random() * rect.height,
                    2,
                    { size: Math.random() * 2 + 1 }
                );
            }, i * 50);
        }
    });
});

// ===== SERVICE ITEMS INTERACTIVE =====
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const title = this.querySelector('h4');
        if (title) {
            title.style.color = 'var(--primary-color)';
            title.style.transform = 'translateX(10px)';
            
            const rect = this.getBoundingClientRect();
            particleSystem.emit(rect.left + rect.width / 2, rect.top, 5, {
                vy: -1,
                size: Math.random() * 2 + 1
            });
        }
    });

    item.addEventListener('mouseleave', function() {
        const title = this.querySelector('h4');
        if (title) {
            title.style.color = 'var(--text-dark)';
            title.style.transform = 'translateX(0)';
        }
    });
});

// ===== PORTFOLIO ITEMS INTERACTIVE =====
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                particleSystem.emit(
                    rect.left + Math.random() * rect.width,
                    rect.top,
                    3,
                    {
                        vy: Math.random() * 2 + 1,
                        vx: (Math.random() - 0.5) * 3,
                        size: Math.random() * 2 + 1
                    }
                );
            }, i * 30);
        }
    });
});

// ===== MOUSE MOVEMENT PARTICLES =====
document.addEventListener('mousemove', throttle(function(e) {
    if (Math.random() > 0.95) {
        particleSystem.createParticle(
            e.clientX + (Math.random() - 0.5) * 20,
            e.clientY + (Math.random() - 0.5) * 20,
            {
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 1.5 + 0.5,
                life: Math.random() * 0.3 + 0.2,
                gravity: 0.02
            }
        );
        particleSystem.update();
    }
}, 50));

function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// ===== BUTTON INTERACTIONS =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        particleSystem.emit(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            15,
            {
                size: Math.random() * 3 + 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                life: Math.random() * 0.6 + 0.3,
                gravity: 0.1
            }
        );
    });

    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });

    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ===== FORM INPUT FOCUS EFFECTS =====
document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('focus', function() {
        const rect = this.getBoundingClientRect();
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                particleSystem.emit(
                    rect.left + rect.width / 2,
                    rect.top,
                    2,
                    { size: Math.random() * 1.5 + 1 }
                );
            }, i * 30);
        }
    });
});

// ===== CLICK EXPLOSION EFFECT =====
document.addEventListener('click', function(e) {
    // Don't trigger on inputs and buttons
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && 
        !e.target.closest('.btn') && !e.target.closest('a')) {
        particleSystem.emit(e.clientX, e.clientY, 3, {
            size: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: Math.random() * 0.3 + 0.2
        });
    }
});

// ===== RECREATE AMBIENT PARTICLES PERIODICALLY =====
setInterval(() => {
    if (particleSystem.particles.length < 50) {
        createAmbientParticles();
    }
}, 2000);

// Style for alert notifications
const style = document.createElement('style');
style.textContent = `
    .alert {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: #10b981;
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .alert.show {
        opacity: 1;
    }

    .alert.alert-success {
        background: #10b981;
    }

    .alert.alert-error {
        background: #ef4444;
    }

    .alert.alert-warning {
        background: #f59e0b;
    }

    .alert.alert-info {
        background: #3b82f6;
    }

    @keyframes slideIn {
        from {
            transform: translateX(400px);
        }
        to {
            transform: translateX(0);
        }
    }

    @media (max-width: 480px) {
        .alert {
            right: 10px;
            left: 10px;
            top: auto;
            bottom: 20px;
        }
    }
`;
document.head.appendChild(style);

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to elements
    document.querySelectorAll('.service-category, .portfolio-item').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});
