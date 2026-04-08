// Smooth scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Nav shrink on scroll + back to top visibility
const backTop = document.querySelector('.back-top');
const nav = document.querySelector('nav');
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 48);
      if (backTop) backTop.classList.toggle('visible', scrollY > 400);
      ticking = false;
    });
    ticking = true;
  }
});

// Back to top button
if (backTop) {
  backTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
let mobileMenuCreated = false;

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    toggleMobileMenu(!isExpanded);
  });
}

function toggleMobileMenu(show) {
  if (!mobileMenuCreated) {
    createMobileMenu();
  }
  const mobileMenu = document.querySelector('.nav-links-mobile');
  if (mobileMenu) {
    mobileMenu.classList.toggle('visible', show);
    document.body.style.overflow = show ? 'hidden' : '';
  }
}

function createMobileMenu() {
  const existing = document.querySelector('.nav-links-mobile');
  if (existing) return;

  mobileMenuCreated = true;
  const mobileMenu = document.createElement('ul');
  mobileMenu.className = 'nav-links-mobile';
  mobileMenu.setAttribute('role', 'menubar');
  mobileMenu.setAttribute('aria-label', 'Menu principal');

  const links = ['#sobre', '#habilidades', '#experiencia', '#projetos', '#certificacoes', '#contato'];
  const labels = ['Sobre', 'Skills', 'Experiência', 'Projetos', 'Certificações', 'Contato'];

  links.forEach((href, index) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'none');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = labels[index];
    a.setAttribute('role', 'menuitem');
    a.addEventListener('click', () => {
      toggleMobileMenu(false);
      navToggle.setAttribute('aria-expanded', 'false');
    });
    li.appendChild(a);
    mobileMenu.appendChild(li);
  });

  document.body.appendChild(mobileMenu);
}

// Form validation and submission
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const formStatus = contactForm.querySelector('.form-status');

    // Clear previous errors
    clearErrors();

    // Validate
    let isValid = true;

    if (!nameInput.value.trim()) {
      showError('name-error', 'Nome é obrigatório');
      nameInput.classList.add('error');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError('name-error', 'Nome deve ter pelo menos 2 caracteres');
      nameInput.classList.add('error');
      isValid = false;
    }

    if (!emailInput.value.trim()) {
      showError('email-error', 'Email é obrigatório');
      emailInput.classList.add('error');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError('email-error', 'Email inválido');
      emailInput.classList.add('error');
      isValid = false;
    }

    if (!messageInput.value.trim()) {
      showError('message-error', 'Mensagem é obrigatória');
      messageInput.classList.add('error');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError('message-error', 'Mensagem deve ter pelo menos 10 caracteres');
      messageInput.classList.add('error');
      isValid = false;
    }

    if (!isValid) {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden = true;
    submitBtn.querySelector('.btn-loading').hidden = false;
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      // Simulate form submission (replace with actual backend or EmailJS)
      await simulateFormSubmission({ name: nameInput.value, email: emailInput.value, message: messageInput.value });

      formStatus.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente ou envie um email direto.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
    }
  });

  // Real-time validation
  [nameInput, emailInput, messageInput].forEach(field => {
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        field.classList.remove('error');
        const errorEl = document.getElementById(`${field.id}-error`);
        if (errorEl) errorEl.textContent = '';
      }
    });
  });
}

function showError(elementId, message) {
  const errorEl = document.getElementById(elementId);
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.fg input, .fg textarea').forEach(el => el.classList.remove('error'));
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function simulateFormSubmission(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate network delay
      console.log('Form submitted:', data);
      resolve({ success: true });
    }, 1500);
  });
}

// Keyboard navigation enhancement
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    toggleMobileMenu(false);
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});
