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
// Para actualizarse necesita un pequeño proxy/backend, porque el navegador no puede leer Verkami directamente por CORS.
(() => {
  const countEl = document.getElementById('followersCount');
  const pill = document.querySelector('.followers-pill');
  if (!countEl) return;

  const fallback = Number(countEl.dataset.followers || countEl.textContent || 0);

  function animateTo(target) {
    if (!Number.isFinite(target) || target <= 0) return;
    let start = null;
    const initial = Number(countEl.textContent || 0) || 0;
    const duration = 850;
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
    const endpoints = [
      '/api/verkami-followers',
      '/.netlify/functions/verkami-followers'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${endpoint}?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = await response.json();
        const followers = Number(data.followers);
        if (Number.isFinite(followers) && followers > 0) {
          countEl.dataset.followers = String(followers);
          animateTo(followers);
          if (pill) pill.classList.add('is-live');
          return;
        }
      } catch (error) {
        // Si no hay backend, mantiene el último valor manual.
      }
    }
    animateTo(fallback);
  }

  fetchFollowers();
  setInterval(fetchFollowers, 10 * 60 * 1000);
})();
