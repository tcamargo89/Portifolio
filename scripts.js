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
