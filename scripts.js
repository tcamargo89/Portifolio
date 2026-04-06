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

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
    document.querySelector('.hamburger').classList.remove('active');
  });
});

// Hamburger toggle
document.querySelectorAll('.hamburger').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('open');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if (nav && nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('active');
  }
});

// Nav shrink on scroll + back to top visibility
const backTop = document.querySelector('.back-top');
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const nav = document.querySelector('nav');
      const scrollY = window.scrollY;
      nav.classList.toggle('scrolled', scrollY > 48);
      if (backTop) backTop.classList.toggle('visible', scrollY > 400);
      ticking = false;
    });
    ticking = true;
  }
});
