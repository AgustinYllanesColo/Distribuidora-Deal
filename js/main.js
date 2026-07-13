// Distribuidora DEAL — interacciones

const WA_NUMBER = '5491176135386';
const MAIL_TO = 'ventas@distribuidoradeal.com';

// --- Header compacto al scrollear ---
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Menú mobile ---
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});

nav.addEventListener('click', (e) => {
  if (e.target.closest('a')) {
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// --- Animaciones de entrada ---
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// --- Formulario → WhatsApp / email ---
const form = document.getElementById('waForm');
const mailAlt = document.getElementById('mailAlt');

function buildMessage() {
  const nombre = form.nombre.value.trim();
  const negocio = form.negocio.value.trim();
  const mensaje = form.mensaje.value.trim();
  let text = '¡Hola! Soy ' + (nombre || 'un interesado');
  if (negocio) text += ', de ' + negocio;
  text += '. Vengo del sitio web de Distribuidora DEAL. ' + mensaje;
  return text;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;
  const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
  window.open(url, '_blank', 'noopener');
  const btn = form.querySelector('button[type="submit"]');
  if (!btn.dataset.original) btn.dataset.original = btn.innerHTML;
  btn.classList.add('is-sent');
  btn.innerHTML = '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11"/></svg> Abriendo WhatsApp…';
  clearTimeout(btn.resetTimer);
  btn.resetTimer = setTimeout(() => {
    btn.classList.remove('is-sent');
    btn.innerHTML = btn.dataset.original;
  }, 2600);
});

mailAlt.addEventListener('click', () => {
  if (!form.reportValidity()) return;
  const subject = 'Consulta desde el sitio web';
  const url = 'mailto:' + MAIL_TO +
    '?subject=' + encodeURIComponent(subject) +
    '&body=' + encodeURIComponent(buildMessage());
  window.location.href = url;
});

// --- Mapa diferido: carga recién cuando la sección de contacto se acerca ---
const mapWrap = document.querySelector('.contact__map');
const mapFrame = mapWrap ? mapWrap.querySelector('iframe[data-src]') : null;
if (mapFrame) {
  if ('IntersectionObserver' in window) {
    const mapIO = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        mapFrame.src = mapFrame.dataset.src;
        mapIO.disconnect();
      }
    }, { rootMargin: '400px 0px' });
    mapIO.observe(mapWrap);
  } else {
    mapFrame.src = mapFrame.dataset.src;
  }
}

// --- Año del footer ---
document.getElementById('year').textContent = new Date().getFullYear();
