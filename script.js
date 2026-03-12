const body = document.body;
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.16,
  rootMargin: '0px 0px -40px 0px'
});

revealItems.forEach((item) => revealObserver.observe(item));

const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const el = entry.target;
    const end = Number(el.dataset.counter || 0);
    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * end);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = String(end);
      }
    };

    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, {
  threshold: 0.5
});

counters.forEach((counter) => counterObserver.observe(counter));

const heroImage = document.querySelector('.hero-bg img');
window.addEventListener('scroll', () => {
  if (!heroImage || window.innerWidth < 900) return;
  const offset = Math.min(window.scrollY * 0.08, 24);
  heroImage.style.transform = `scale(1.03) translateY(${offset}px)`;
}, { passive: true });

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const triggerButtons = document.querySelectorAll('.js-open-lightbox');

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  body.style.overflow = '';
};

triggerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImg || !lightboxCaption) return;

    lightboxImg.src = button.dataset.image || '';
    lightboxImg.alt = button.dataset.title || 'Vista ampliada';
    lightboxCaption.textContent = button.dataset.title || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
  });
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightboxClose?.addEventListener('click', closeLightbox);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
