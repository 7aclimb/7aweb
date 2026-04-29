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



// Contador de seguidores usando Cloudflare Worker.
// Funciona con GitHub Pages porque el Worker hace de proxy para leer Verkami.

(() => {
  const countEl = document.getElementById("followersCount");
  const pill = document.querySelector(".followers-pill");
  const label = document.getElementById("followersLiveLabel");

  if (!countEl) return;

  const WORKER_URL = "PEGA_AQUI_TU_URL_DEL_WORKER";

  async function loadFollowers() {
    try {
      countEl.textContent = "...";

      const response = await fetch(`${WORKER_URL}?t=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("No se pudo leer el contador");
      }

      const data = await response.json();
      const followers = Number(data.followers);

      if (Number.isFinite(followers) && followers > 0) {
        countEl.textContent = followers.toString();
        if (pill) pill.classList.add("is-live");
        if (label) label.textContent = "actualizado al abrir";
      } else {
        countEl.textContent = "—";
        if (label) label.textContent = "no disponible";
      }
    } catch (error) {
      countEl.textContent = "—";
      if (label) label.textContent = "no disponible";
      console.error(error);
    }
  }

  loadFollowers();
})();
