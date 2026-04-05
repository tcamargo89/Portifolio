// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// Hamburger toggle
document.querySelectorAll('.hamburger').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });
});

// Close mobile nav on outside click
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if (nav && !nav.contains(e.target) && !hamburger.contains(e.target)) {
    nav.classList.remove('open');
  }
});
