
(() => {
  const root = document.documentElement;
  const bgImg = document.querySelector(".background img");

  function updateBackground() {
    if (!bgImg) return;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    const imageHeight = bgImg.getBoundingClientRect().height;
    const maxShift = Math.max(0, imageHeight - window.innerHeight);
    root.style.setProperty("--bg-shift", `${Math.round(maxShift * progress)}px`);
  }

  function updateProgress() {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(100, Math.max(0, (window.scrollY / max) * 100));
    root.style.setProperty("--scroll-progress", `${progress}%`);
  }

  updateBackground();
  updateProgress();

  window.addEventListener("scroll", () => {
    updateBackground();
    updateProgress();
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateBackground();
    updateProgress();
  });

  window.addEventListener("load", () => {
    updateBackground();
    updateProgress();
  });
})();

(() => {
  const reveals = [...document.querySelectorAll(".reveal")];

  if (!("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => observer.observe(el));
})();

(() => {
  const countEl = document.getElementById("followersCount");
  const pill = document.querySelector(".followers-pill");
  const label = document.getElementById("followersLiveLabel");

  if (!countEl) return;

  const WORKER_URL = "https://verkami-7a-counter.laster3000.workers.dev/";

  function normalizeFollowers(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.round(number) : null;
  }

  function setStatus(text) {
    if (label) label.textContent = text;
  }

  function animateNumber(target) {
    const initial = normalizeFollowers(countEl.textContent) || 0;
    const duration = 700;
    let started = null;

    const frame = (timestamp) => {
      if (!started) started = timestamp;
      const progress = Math.min(1, (timestamp - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(initial + (target - initial) * eased);
      countEl.textContent = current.toString();

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        countEl.textContent = target.toString();
      }
    };

    requestAnimationFrame(frame);
  }

  async function loadFollowers() {
    try {
      countEl.textContent = "...";
      setStatus("actualizando...");

      const response = await fetch(`${WORKER_URL}?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "accept": "application/json" }
      });

      if (!response.ok) {
        throw new Error(`El Worker respondió ${response.status}`);
      }

      const data = await response.json();
      const followers = normalizeFollowers(data.followers);

      if (!followers) {
        throw new Error("El Worker no devolvió un número válido");
      }

      animateNumber(followers);
      if (pill) pill.classList.add("is-live");
      setStatus("actualizado al abrir");
    } catch (error) {
      console.error("No se pudo actualizar el contador:", error);
      countEl.textContent = "—";
      setStatus("no disponible");
    }
  }

  loadFollowers();
})();
