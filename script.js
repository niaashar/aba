// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === currentPage) {
        link.classList.add('active');
    }
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Animate elements on scroll
document.querySelectorAll('.service-card, .start-step, .path-step-home, .myth-card-home, .audience-card-home, .microtext-item, .process-step, .faq-item, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(74, 85, 104, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(74, 85, 104, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// ===== CONTACT FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                contactForm.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                errorMessage.textContent = result.error || 'Произошла ошибка. Попробуйте позже.';
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            errorMessage.textContent = 'Ошибка соединения. Попробуйте позже или свяжитесь напрямую.';
            errorMessage.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            console.error('Error:', error);
        }
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ 
                    top: offsetTop, 
                    behavior: 'smooth' 
                });
            }
        }
    });
});

// ===== FORM VALIDATION ENHANCEMENT =====
if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.style.borderColor = 'var(--color-bg)';
            }
        });
        
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-blue)';
        });
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 8px;
        background: ${type === 'success' ? 'var(--color-success)' : type === 'error' ? 'var(--color-error)' : 'var(--color-blue)'};
        color: white;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ===== BACK TO TOP BUTTON =====
function createBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '↑';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--color-blue);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 999;
    `;
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    document.body.appendChild(btn);
    
    window.addEventListener('scroll', () => {
        btn.style.opacity = window.pageYOffset > 500 ? '1' : '0';
    });
}

createBackToTop();

// ===== LOGGING =====
console.log('ABA_pro website loaded successfully 🧩');
console.log('Пазлы начинают собираться...');
// ===== АККОРДЕОН УСЛУГ НА ГЛАВНОЙ =====
function toggleServiceAccordion(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Закрываем все элементы
    document.querySelectorAll('.service-accordion-item .accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    document.querySelectorAll('.service-accordion-item .accordion-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}
// ===== АККОРДЕОН УСЛУГ НА ГЛАВНОЙ =====
function toggleServiceAccordion(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Закрываем все элементы
    document.querySelectorAll('.service-accordion-item .accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    document.querySelectorAll('.service-accordion-item .accordion-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}
// ===== АККОРДЕОН УСЛУГ НА ГЛАВНОЙ =====
function toggleServiceAccordion(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Закрываем все элементы
    document.querySelectorAll('.service-accordion-item .accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    document.querySelectorAll('.service-accordion-item .accordion-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}
// ===== АККОРДЕОН УСЛУГ НА ГЛАВНОЙ =====
function toggleServiceAccordion(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Закрываем все элементы
    document.querySelectorAll('.service-accordion-item .accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    document.querySelectorAll('.service-accordion-item .accordion-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}
// ===== АККОРДЕОН УСЛУГ НА ГЛАВНОЙ =====
function toggleServiceAccordion(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = header.classList.contains('active');
    
    // Закрываем все элементы
    document.querySelectorAll('.service-accordion-item .accordion-header').forEach(h => {
        h.classList.remove('active');
    });
    document.querySelectorAll('.service-accordion-item .accordion-content').forEach(c => {
        c.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        header.classList.add('active');
        content.classList.add('active');
    }
}
// ===== АККОРДЕОН ДЛЯ МИФОВ =====
function toggleMyth(header) {
    const item = header.parentElement;
    const content = header.nextElementSibling;
    const isActive = item.classList.contains('active');
    
    // Закрываем все мифы
    document.querySelectorAll('.myth-item').forEach(myth => {
        myth.classList.remove('active');
    });
    
    // Открываем текущий, если он был закрыт
    if (!isActive) {
        item.classList.add('active');
    }
}
// ===== ПРОСМОТР СЕРТИФИКАТОВ =====
function viewCertificate(certId) {
    // Здесь можно открыть модальное окно с изображением сертификата
    // Или перейти на страницу с документами
    alert('📄 Просмотр сертификата: ' + certId + '\n\nВ реальной версии здесь откроется изображение сертификата в полном размере.');
    
    // Пример открытия модального окна:
    // const modal = document.createElement('div');
    // modal.className = 'modal';
    // modal.innerHTML = `
    //     <div class="modal-content" style="max-width: 800px;">
    //         <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
    //         <img src="images/certificates/${certId}.jpg" alt="Сертификат" style="width: 100%; border-radius: 8px;">
    //     </div>
    // `;
    // document.body.appendChild(modal);
    // modal.style.display = 'block';
}