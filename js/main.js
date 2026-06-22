/* =====================================================
   DRA. MARCELA CAMARGO — main.js v2.0
   ===================================================== */

/* ── Header: sticky + glassmorphism ── */
const header    = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const nav       = document.getElementById('nav');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile menu ── */
hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  nav.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  hamburger.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── Scroll animations (Intersection Observer) ── */
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el    = entry.target;
    const delay = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('is-visible'), delay);
    animObserver.unobserve(el);
  });
}, { threshold: 0.14 });

document.querySelectorAll('[data-animate]').forEach(el => animObserver.observe(el));

/* ── Active nav link on scroll ── */
const sections = document.querySelectorAll('section[id], footer[id]');
const navLinks = document.querySelectorAll('.header__nav a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { threshold: 0.35 });

sections.forEach(s => sectionObserver.observe(s));

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 8;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Gallery Lightbox ── */
const galleryItems  = document.querySelectorAll('.gallery__item');
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev  = document.getElementById('lightboxPrev');
const lightboxNext  = document.getElementById('lightboxNext');
const overlay       = document.getElementById('overlay');

let currentIdx = 0;
const galleryImages = Array.from(galleryItems).map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt,
}));

function openLightbox(index) {
  currentIdx = index;
  lightboxImg.src = galleryImages[index].src;
  lightboxImg.alt = galleryImages[index].alt;
  lightbox.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function showImage(index) {
  currentIdx = (index + galleryImages.length) % galleryImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = galleryImages[currentIdx].src;
    lightboxImg.style.opacity = '1';
  }, 180);
}

lightboxImg.style.transition = 'opacity .18s ease';

galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
lightboxClose.addEventListener('click', closeLightbox);
overlay.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showImage(currentIdx - 1));
lightboxNext.addEventListener('click', () => showImage(currentIdx + 1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showImage(currentIdx - 1);
  if (e.key === 'ArrowRight') showImage(currentIdx + 1);
});

/* ── Swipe on lightbox ── */
let lbTouchX = 0;
lightbox.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const diff = lbTouchX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) diff > 0 ? showImage(currentIdx + 1) : showImage(currentIdx - 1);
});

/* ── Counter animation ── */
function animateCounter(el) {
  const target   = parseFloat(el.dataset.count);
  const prefix   = el.dataset.prefix  || '';
  const suffix   = el.dataset.suffix  || '';
  const decimals = parseInt(el.dataset.decimals || 0, 10);
  const duration = 1800;
  const steps    = 60;
  const increment = target / steps;
  let current = 0;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    current = increment * step;
    if (step >= steps) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = prefix + current.toFixed(decimals) + suffix;
  }, duration / steps);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

const statsEl = document.querySelector('.hero__stats');
if (statsEl) counterObserver.observe(statsEl);

/* ── Harmonização Facial: tabs ── */
document.querySelectorAll('.harmonizacao__tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    document.querySelectorAll('.harmonizacao__tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.harmonizacao__panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById('tab-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ── Scroll: hide hero scroll indicator ── */
const scrollIndicator = document.querySelector('.hero__scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.style.opacity = window.scrollY > 80 ? '0' : '1';
  }, { passive: true });
}
