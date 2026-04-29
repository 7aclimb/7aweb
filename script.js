(() => {
  const root = document.documentElement;
  const bgImg = document.querySelector('.parallax-bg img');

  function updateBackground() {
    if (!bgImg) return;

    const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / scrollMax));
    const imageHeight = bgImg.getBoundingClientRect().height;
    const maxShift = Math.max(0, imageHeight - window.innerHeight);

    root.style.setProperty('--bg-shift', `${Math.round(maxShift * progress)}px`);
  }

  updateBackground();
  window.addEventListener('scroll', updateBackground, { passive: true });
  window.addEventListener('resize', updateBackground);
  window.addEventListener('load', updateBackground);
})();


// Barra de progreso, revelado de secciones y pequeños efectos de movimiento.
(() => {
  const root = document.documentElement;
  const reveals = [...document.querySelectorAll('.reveal')];

  const updateProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    root.style.setProperty('--scroll-progress', `${progress}%`);
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  reveals.forEach((el) => revealObserver.observe(el));

  let mouseX = 0;
  let mouseY = 0;
  const layer = document.querySelector('.parallax-layer');

  window.addEventListener('pointermove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 18;
    mouseY = (event.clientY / window.innerHeight - 0.5) * 18;
    if (layer) layer.style.setProperty('transform', `translate(${mouseX}px, ${mouseY}px)`);
  }, { passive: true });

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
})();



// Contador superior de seguidores en Verkami.
// Se actualiza al abrir la página usando una función Netlify/Vercel/local.
// Importante: una web estática no puede leer Verkami directamente por CORS.
(() => {
  const countEl = document.getElementById('followersCount');
  const pill = document.querySelector('.followers-pill');
  const label = document.getElementById('followersLiveLabel');
  if (!countEl) return;

  const endpoints = [
    '/.netlify/functions/verkami-followers',
    '/api/verkami-followers'
  ];

  function setStatus(text, live = false) {
    if (label) label.textContent = text;
    if (pill) pill.classList.toggle('is-live', live);
  }

  function animateTo(target) {
    if (!Number.isFinite(target) || target <= 0) return;
    countEl.classList.remove('is-loading');
    const initial = Number(countEl.textContent) || 0;
    const duration = 850;
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      countEl.textContent = Math.round(initial + (target - initial) * eased).toString();
      if (progress < 1) requestAnimationFrame(animate);
      else countEl.textContent = target.toString();
    };
    requestAnimationFrame(animate);
  }

  async function fetchFollowers() {
    countEl.textContent = countEl.textContent && countEl.textContent !== '...' ? countEl.textContent : '...';
    countEl.classList.add('is-loading');
    setStatus('actualizando...', false);

    for (const endpoint of endpoints) {
      try {
        const url = `${endpoint}?t=${Date.now()}`;
        const response = await fetch(url, { cache: 'no-store', headers: { 'accept': 'application/json' } });
        if (!response.ok) continue;
        const data = await response.json();
        const followers = Number(data.followers);
        if (Number.isFinite(followers) && followers > 0) {
          countEl.dataset.followers = String(followers);
          animateTo(followers);
          setStatus('actualizado al abrir', true);
          return;
        }
      } catch (error) {
        // Sigue probando con el siguiente endpoint.
      }
    }

    countEl.textContent = '—';
    countEl.classList.remove('is-loading');
    setStatus('ver en Verkami', false);
  }

  fetchFollowers();
  setInterval(fetchFollowers, 10 * 60 * 1000);
})();
