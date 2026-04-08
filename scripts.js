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
      // Envia email via EmailJS
      const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim(),
        title: 'Contato do Portfolio' // Título fixo para o assunto
      };

      await sendEmailViaEmailJS(formData);

      formStatus.textContent = 'Mensagem enviada com sucesso! Entrarei em contato em breve.';
      formStatus.className = 'form-status success';
      contactForm.reset();
    } catch (error) {
      // Se o EmailJS não estiver configurado, mostra instrução
      if (error.message === 'EmailJS não configurado') {
        formStatus.textContent = '⚠️ Configuração pendente: siga as instruções no arquivo scripts.js para ativar o envio de emails.';
      } else {
        formStatus.textContent = 'Erro ao enviar mensagem. Por favor, tente novamente ou envie um email direto.';
      }
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').hidden = false;
      submitBtn.querySelector('.btn-loading').hidden = true;
    }
  });

  // Real-time validation
  const setupRealTimeValidation = () => {
    const fields = [
      { id: 'name', errorId: 'name-error' },
      { id: 'email', errorId: 'email-error' },
      { id: 'message', errorId: 'message-error' }
    ];

    fields.forEach(field => {
      const input = document.getElementById(field.id);
      if (input) {
        input.addEventListener('input', () => {
          const errorEl = document.getElementById(field.errorId);
          if (errorEl) {
            errorEl.textContent = '';
          }
          input.classList.remove('error');
        });
      }
    });
  };

  setupRealTimeValidation();
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

// ============================================
// CONFIGURAÇÃO DO EMAILJS
// ============================================
// 1. Crie uma conta gratuita em https://www.emailjs.com/
// 2. Adicione um serviço de email (Gmail, Outlook, etc.)
// 3. Crie um template de email com estas variáveis:
//    - {{name}} - Nome do remetente
//    - {{email}} - Email do remetente
//    - {{message}} - Mensagem enviada
// 4. Copie o Service ID, Template ID e seu User ID
// 5. Substitua as constantes abaixo com seus valores
// ============================================

const EMAILJS_SERVICE_ID = 'service_x8l99cb';
const EMAILJS_TEMPLATE_ID = 'template_66jwlnj';
const EMAILJS_USER_ID = 'OYfCf_MonEEF9WaHN';

// Aguarda a biblioteca EmailJS carregar antes de inicializar
function waitForEmailJS() {
  return new Promise((resolve, reject) => {
    if (typeof emailjs !== 'undefined') {
      emailjs.init(EMAILJS_USER_ID);
      console.log('✅ EmailJS inicializado');
      resolve();
    } else {
      // Espera a biblioteca carregar
      const checkInterval = setInterval(() => {
        if (typeof emailjs !== 'undefined') {
          clearInterval(checkInterval);
          emailjs.init(EMAILJS_USER_ID);
          console.log('✅ EmailJS inicializado (tardia)');
          resolve();
        }
      }, 100);

      // Timeout após 5 segundos
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('EmailJS não carregou em 5 segundos'));
      }, 5000);
    }
  });
}

// Inicializa quando a página carrega
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', waitForEmailJS);
} else {
  waitForEmailJS();
}

function sendEmailViaEmailJS(data) {
  return new Promise((resolve, reject) => {
    console.log('📧 Enviando email via EmailJS...');
    console.log('Service ID:', EMAILJS_SERVICE_ID);
    console.log('Template ID:', EMAILJS_TEMPLATE_ID);
    console.log('User ID:', EMAILJS_USER_ID);
    console.log('Dados:', data);

    // Verifica se o EmailJS está configurado
    if (EMAILJS_SERVICE_ID === 'SEU_SERVICE_ID' ||
        EMAILJS_TEMPLATE_ID === 'SEU_TEMPLATE_ID') {
      console.error('⚠️ EmailJS não configurado! IDs padrão detectados.');
      reject(new Error('EmailJS não configurado'));
      return;
    }

    // Verifica se a biblioteca está disponível
    if (typeof emailjs === 'undefined') {
      console.error('❌ Biblioteca EmailJS não carregada!');
      reject(new Error('EmailJS library not loaded'));
      return;
    }

    console.log('✅ Biblioteca EmailJS encontrada, enviando...');

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data)
      .then((result) => {
        console.log('✅ EmailJS Success:', result);
        resolve(result);
      }, (error) => {
        console.error('❌ EmailJS Error:', error);
        console.error('Detalhes do erro:', JSON.stringify(error));
        reject(error);
      });
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
