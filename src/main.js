import './styles.css';
import { EVENT } from './config.js';

const app = document.querySelector('#app');
const mapsUrl = EVENT.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(EVENT.locationQuery)}`;
const storageKey = 'megan-80s-rsvps-v1';
const adminSessionKey = 'megan-80s-admin-auth';

const icon = {
  calendar: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="4" d="M12 9v8M36 9v8M8 18h32M10 12h28a4 4 0 0 1 4 4v23a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V16a4 4 0 0 1 4-4Z"/><path fill="currentColor" d="M14 24h6v6h-6zm10 0h6v6h-6zm10 0h6v6h-6zM14 34h6v6h-6zm10 0h6v6h-6z"/></svg>`,
  clock: `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="4"/><path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" d="M24 13v12l9 6"/></svg>`,
  pin: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="M24 4C15.7 4 9 10.7 9 19c0 10.7 15 25 15 25s15-14.3 15-25C39 10.7 32.3 4 24 4Zm0 21a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"/></svg>`,
  shirt: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round" d="m16 7 8 5 8-5 10 8-6 8-4-3v21H16V20l-4 3-6-8 10-8Z"/></svg>`,
  music: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M19 34V10l20-4v24"/><circle cx="13" cy="36" r="6" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="33" cy="32" r="6" fill="none" stroke="currentColor" stroke-width="4"/></svg>`,
  share: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M34 18 24 8 14 18M24 8v27M10 30v8a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4v-8"/></svg>`,
  phone: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" d="M16 8h16a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Zm5 26h6"/></svg>`,
  sparkle: `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="currentColor" d="m24 3 5.7 14.3L45 23l-15.3 5.7L24 45l-5.7-16.3L3 23l15.3-5.7L24 3Z"/></svg>`
};

boot();
registerServiceWorker();

window.addEventListener('hashchange', boot);

function boot() {
  if (window.location.hash === '#admin') {
    renderAdminRoute();
    return;
  }

  document.body.classList.remove('admin-view');
  renderApp();
  removeLegacyWazeLinks();
  initFloatingStickers();
  initCountdown();
  initActions();
  initBackgroundMusic();
  initRsvp();
  initPuzzles();
  initScrollReveal();
}

function renderApp() {
  app.innerHTML = `
    <div class="app-shell">
      <div class="floating-stickers" id="floatingStickers" aria-hidden="true"></div>
      <div class="confetti-layer" id="confettiLayer" aria-hidden="true"></div>
      <main class="page">
        <nav class="topbar" aria-label="Navegación principal">
          <a class="brand" href="#inicio" aria-label="Volver al inicio">
            <span class="brand__mark">M</span>
            <span class="brand__text"><strong>Megan 80s</strong><span>Invitación web</span></span>
          </a>
          <div class="nav-actions">
            <a class="pill" href="#contador">Contador</a>
            <a class="pill" href="#ubicación">Ubicación</a>
            <a class="btn btn--primary" href="#confirmar">Confirmar</a>
            <button class="icon-btn" type="button" id="partyModeBtn" aria-label="Activar modo fiesta">${icon.sparkle}</button>
          </div>
        </nav>

        <section class="hero" id="inicio" aria-labelledby="hero-title">
          <div class="hero__copy">
            <p class="hero__kicker">Estás invitado a la</p>
            <span class="hero__subkicker">${EVENT.themeTitle}</span>
            <h1 class="hero__name" id="hero-title">${EVENT.guestOfHonor}</h1>
            <span class="hero__caption">Está cumpliendo</span>
            <div class="age-row" aria-label="Cumple ${EVENT.age} años">
              <span class="age-number">${EVENT.age}</span>
              <span class="age-label">Años</span>
            </div>
            <p class="section__copy">${EVENT.hostLine} Confirma tu asistencia, guarda la fecha, resuelve los mini juegos retro y abre la ruta directo desde tu celular.</p>
            <div class="hero__cta">
              <a class="btn btn--primary" href="#confirmar">Confirmar asistencia</a>
              <a class="btn btn--ghost" href="${mapsUrl}" target="_blank" rel="noopener">Abrir ubicación en Google Maps</a>
            </div>
            <div class="quick-info" aria-label="Datos rápidos de la fiesta">
              <article class="info-tile">
                <p class="info-tile__label">Fecha</p>
                <p class="info-tile__value">${EVENT.dateLabel}</p>
                <p class="info-tile__small">${EVENT.timeLabel}</p>
              </article>
              <article class="info-tile">
                <p class="info-tile__label">Lugar</p>
                <p class="info-tile__value">${EVENT.venue}</p>
                <p class="info-tile__small">Cuautepec, Hgo.</p>
              </article>
              <article class="info-tile">
                <p class="info-tile__label">Código</p>
                <p class="info-tile__value">${EVENT.dressCode}</p>
                <p class="info-tile__small">Looks neon, mezclilla, tenis y mucho color.</p>
              </article>
            </div>
          </div>
        </section>

        <section class="section" id="contador" aria-labelledby="countdown-title">
          <h2 class="section__title" id="countdown-title">Cuenta regresiva neon</h2>
          <p class="section__copy" id="countdownPhrase">Cada segundo nos acerca.</p>
          <div class="countdown-grid" id="countdownGrid" aria-live="polite">
            ${[
      { key: 'dias', label: 'Días' },
      { key: 'horas', label: 'Horas' },
      { key: 'min', label: 'Min' },
      { key: 'seg', label: 'Seg' }
    ].map(({ key, label }) => `<div class="count-box"><strong data-count="${key}">00</strong><span>${label}</span></div>`).join('')}
          </div>
        </section>

        <section class="section split-grid" aria-label="Detalles de la fiesta">
          <article class="card card--accent">
            <p class="section__eyebrow">Dress code</p>
            <h2 class="card__title">${EVENT.dressCode}</h2>
            <p class="card__copy">La idea es que todos lleguen con energía de video músical retro: colores neon, chamarras, lentes, mezclilla, tenis altos, estampados y peinados divertidos.</p>
            <div class="dress-sign">
              <span class="dress-sign__top">CÓDIGO DE VESTIMENTA</span>
              <strong class="dress-sign__main">LOOK 80s OBLIGATORIO</strong>
              <span class="dress-sign__bottom">Para niños, adultos y acompañantes</span>
            </div>
            

          

        <section class="section" id="ubicación" aria-labelledby="location-title">
          <p class="section__eyebrow">Ubicación </p>
          <h2 class="section__title" id="location-title">${EVENT.venue}</h2>
          <p class="section__copy">Abre la ruta en Google Maps. También puedes copiar la dirección para enviarla a alguien más.</p>
          <div class="card location-card">
            <div class="location-visual" aria-hidden="true">
              <svg class="location-pin" viewBox="0 0 110 140" role="img" aria-label="Pin de ubicación">
                <path d="M55 5C27 5 8 26 8 54c0 39 47 81 47 81s47-42 47-81C102 26 83 5 55 5Z" fill="#ff2dbd" stroke="#ffe93b" stroke-width="6"/>
                <circle cx="55" cy="54" r="20" fill="#080015" stroke="#00eaff" stroke-width="6"/>
              </svg>
            </div>
            <div class="location-panel">
              <p class="section__eyebrow">Dirección</p>
              <p class="big-address">${EVENT.address}</p>
              <div class="action-row">
                <a class="btn btn--primary" href="${mapsUrl}" target="_blank" rel="noopener">Abrir en Google Maps</a>
                <button class="btn btn--yellow" type="button" id="copyAddressBtn">Copiar dirección</button>
              </div>
            </div>
          </div>
        </section>

        <section class="section" id="confirmar" aria-labelledby="rsvp-title">
          <p class="section__eyebrow">Confirmar asistencia</p>
          <h2 class="section__title" id="rsvp-title">Confirma tu asistencia</h2>
          <p class="section__copy">Llena el formulario. Al enviarlo nos ayudas a contemplarte para esta gran cita, y esperarte con más emoción</p>
          <div class="rsvp-layout">
            <form class="card card--accent" id="rsvpForm" novalidate>
              <div class="form-grid">
                <div class="form-field form-field--full">
                  <label for="guestName">Nombre de quien confirma</label>
                  <input id="guestName" name="guestName" autocomplete="name" placeholder="Ej. Familia Hernandez" required />
                </div>
                <div class="form-field">
                  <label for="attendance">Asistencia</label>
                  <select id="attendance" name="attendance" required>
                    <option value="si">Sí asistiremos</option>
                    <option value="no">No podremos asistir</option>
                  </select>
                </div>
                <div class="form-field">
                  <label for="adults">Adultos</label>
                  <input id="adults" name="adults" type="number" inputmode="numeric" min="0" max="20" value="1" required />
                </div>
                <div class="form-field">
                  <label for="kids">Niños</label>
                  <input id="kids" name="kids" type="number" inputmode="numeric" min="0" max="20" value="1" required />
                </div>
                <div class="form-field">
                  <label for="phone">Teléfono</label>
                  <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Ej. 775 137 2847" />
                </div>
                <div class="form-field">
                  <label for="song">Canción 80s sugerida</label>
                  <input id="song" name="song" placeholder="Opcional" />
                </div>
                <div class="form-field form-field--full">
                  <label for="message">Mensaje para Megan</label>
                  <textarea id="message" name="message" placeholder="Opcional: deja un mensaje bonito o una nota para la anfitriona."></textarea>
                </div>
              </div>
              <p class="form-help">Tus datos se guardarán en la lista de confirmaciones de la fiesta.</p>
              <button class="btn btn--primary btn--wide" type="submit" id="rsvpSubmitBtn">Enviar confirmación</button>
              <p class="status-message" id="rsvpStatus" aria-live="polite"></p>
            </form>
          </div>
        </section>

        <section class="section" id="puzzles" aria-labelledby="puzzle-title">
          <p class="section__eyebrow">Puzles interactivos</p>
          <h2 class="section__title" id="puzzle-title">Zona arcade</h2>
          <p class="section__copy">Dos mini juegos ligeros, hechos para tocar en celular: memoria retro y rompecabezas deslizante.</p>
          <div class="card">
            <div class="puzzle-tabs" role="tablist" aria-label="Juegos disponibles">
              <button class="pill tab-btn" id="tab-memory" type="button" role="tab" aria-selected="true" aria-controls="panel-memory">Memoria 80s</button>
              <button class="pill tab-btn" id="tab-slide" type="button" role="tab" aria-selected="false" aria-controls="panel-slide">Rompecabezas</button>
            </div>
            <div class="puzzle-panel is-active" id="panel-memory" role="tabpanel" aria-labelledby="tab-memory">
              <h3 class="card__title">Encuentra las parejas</h3>
              <p class="card__copy">Toca las tarjetas y junta los stickers iguales. Al completar el reto se desbloquea una frase especial.</p>
              <div class="memory-game" id="memoryGame"></div>
              <div class="action-row">
                <button class="btn btn--yellow" type="button" id="resetMemoryBtn">Mezclar memoria</button>
                <p class="game-status" id="memoryStatus" aria-live="polite">0 parejas encontradas.</p>
              </div>
            </div>
            <div class="puzzle-panel" id="panel-slide" role="tabpanel" aria-labelledby="tab-slide" hidden>
              <h3 class="card__title">Arma el poster neon</h3>
              <p class="card__copy">Mueve las piezas vecinas al espacio vacío hasta reconstruir la imagen.</p>
              <div class="slide-wrap">
                <div class="slide-board" id="slideBoard" aria-label="Rompecabezas deslizante 3 por 3"></div>
                <div class="slide-info">
                  <p class="game-status" id="slideStatus" aria-live="polite">Movimientos: 0</p>
                  <button class="btn btn--yellow" type="button" id="shuffleSlideBtn">Mezclar rompecabezas</button>
                  <button class="btn btn--ghost" type="button" id="solveSlideBtn">Ver solucion</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer class="footer">
          <p><strong>${EVENT.guestOfHonor} ${EVENT.age}</strong> - ${EVENT.themeTitle} - ${EVENT.dateLabel} ${EVENT.timeLabel}</p>
          <p class="footer__note">Detalles preparados para <button class="admin-secret-link" type="button" id="adminSecretLink">MEGAN</button>.</p>
          <div class="neon-divider" aria-hidden="true"></div>
        </footer>
      </main>
      <button class="music-toggle" type="button" id="musicToggle" aria-label="Reanudar música" aria-pressed="false">
        <span class="music-toggle__icon">${icon.music}</span>
        <span class="music-toggle__text">Reanudar música</span>
      </button>
      <audio id="backgroundMusic" src="${EVENT.backgroundMusic.src}" loop preload="auto" autoplay playsinline></audio>
      <div class="toast" id="toast" role="status" aria-live="polite"></div>
    </div>
  `;
}

function removeLegacyWazeLinks() {
  document.querySelectorAll('a, button').forEach((element) => {
    const href = element.getAttribute('href') || '';
    const text = element.textContent || '';
    if (/waze/i.test(href) || /waze/i.test(text)) {
      element.remove();
    }
  });
}

function initFloatingStickers() {
  const container = document.querySelector('#floatingStickers');
  if (!container) return;

  const placements = [
    { top: '6%', left: '2%', size: '9vw', duration: '6.5s', delay: '-1s', rotate: '-12deg', drift: '-22px' },
    { top: '8%', left: '82%', size: '10vw', duration: '7.2s', delay: '-2s', rotate: '14deg', drift: '26px' },
    { top: '34%', left: '88%', size: '8vw', duration: '6.1s', delay: '-4s', rotate: '-10deg', drift: '-18px' },
    { top: '68%', left: '2%', size: '12vw', duration: '7.5s', delay: '-3s', rotate: '12deg', drift: '26px' },
    { top: '76%', left: '78%', size: '12vw', duration: '6.8s', delay: '-1.6s', rotate: '-8deg', drift: '-28px' },
    { top: '19%', left: '6%', size: '7vw', duration: '8s', delay: '-5s', rotate: '20deg', drift: '30px' },
    { top: '48%', left: '1%', size: '7vw', duration: '6.3s', delay: '-2.4s', rotate: '-20deg', drift: '-20px' },
    { top: '50%', left: '86%', size: '8vw', duration: '7.8s', delay: '-3.3s', rotate: '18deg', drift: '28px' }
  ];

  container.innerHTML = placements.map((placement, index) => {
    const src = EVENT.stickers[index % EVENT.stickers.length];
    return `<img class="floating-sticker" src="${src}" alt="" aria-hidden="true" style="--top:${placement.top};--left:${placement.left};--size:${placement.size};--duration:${placement.duration};--delay:${placement.delay};--rotate:${placement.rotate};--drift:${placement.drift};" />`;
  }).join('');
}

function initCountdown() {
  const target = new Date(EVENT.dateTime).getTime();
  const phrase = document.querySelector('#countdownPhrase');
  const nodes = {
    dias: document.querySelector('[data-count="dias"]'),
    horas: document.querySelector('[data-count="horas"]'),
    min: document.querySelector('[data-count="min"]'),
    seg: document.querySelector('[data-count="seg"]')
  };

  const update = () => {
    const now = Date.now();
    const diff = Math.max(target - now, 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    nodes.dias.textContent = String(days).padStart(2, '0');
    nodes.horas.textContent = String(hours).padStart(2, '0');
    nodes.min.textContent = String(minutes).padStart(2, '0');
    nodes.seg.textContent = String(seconds).padStart(2, '0');

    if (diff === 0 && phrase) {
      phrase.textContent = 'La fiesta ya comenzó. Es momento de prender el modo 80s.';
    }
  };

  update();
  window.setInterval(update, 1000);
}

function initActions() {
  document.querySelector('#partyModeBtn')?.addEventListener('click', () => {
    document.body.classList.toggle('party-mode');
    spawnConfetti(70);
    showToast(document.body.classList.contains('party-mode') ? 'Modo fiesta activado.' : 'Modo fiesta desactivado.');
  });

  document.querySelector('#copyAddressBtn')?.addEventListener('click', async () => {
    const copied = await copyText(`${EVENT.venue}\n${EVENT.address}\n${mapsUrl}`);
    showToast(copied ? 'Ubicación copiada.' : 'No se pudo copiar la ubicación.');
  });

  document.querySelector('#adminSecretLink')?.addEventListener('click', openAdminWithPassword);
  document.querySelector('#musicToggle')?.addEventListener('click', toggleBackgroundMusic);

  document.querySelector('#shareBtn')?.addEventListener('click', shareInvitation);
  document.querySelector('#downloadIcsBtn')?.addEventListener('click', downloadCalendarFile);
  document.querySelector('#addCalendarHero')?.addEventListener('click', downloadCalendarFile);
}

function setMusicButtonState(isPlaying) {
  const button = document.querySelector('#musicToggle');
  const label = document.querySelector('.music-toggle__text');

  if (!button) return;

  button.classList.toggle('is-playing', isPlaying);
  button.classList.toggle('needs-interaction', !isPlaying);

  if (label) {
    label.textContent = isPlaying ? 'Parar música' : 'Reanudar música';
  }

  button.setAttribute('aria-pressed', String(isPlaying));
  button.setAttribute(
    'aria-label',
    isPlaying ? 'Parar música de fondo' : 'Reanudar música de fondo'
  );
}

function toggleBackgroundMusic() {
  const audio = document.querySelector('#backgroundMusic');

  if (!audio) return;

  if (!audio.paused) {
    audio.pause();
    setMusicButtonState(false);
    showToast('Música pausada.');
    return;
  }

  audio.volume = 0.72;

  audio.play()
    .then(() => {
      setMusicButtonState(true);
      showToast('Música activada.');
    })
    .catch(() => {
      setMusicButtonState(false);
      showToast('Toca la pantalla para activar la música.');
    });
}

function initBackgroundMusic() {
  const audio = document.querySelector('#backgroundMusic');

  if (!audio) return;

  audio.volume = 0.72;
  audio.load();

  let interactionHandled = false;

  const tryPlayMusic = (showMessage = false) => {
    audio.play()
      .then(() => {
        setMusicButtonState(true);

        if (showMessage) {
          showToast('Música activada.');
        }
      })
      .catch(() => {
        setMusicButtonState(false);
      });
  };

  const unlockOnFirstInteraction = (event) => {
    if (interactionHandled) return;

    const clickedMusicButton = event.target.closest?.('#musicToggle');

    if (clickedMusicButton) {
      return;
    }

    interactionHandled = true;
    tryPlayMusic(true);

    window.removeEventListener('pointerdown', unlockOnFirstInteraction);
    window.removeEventListener('touchstart', unlockOnFirstInteraction);
    window.removeEventListener('keydown', unlockOnFirstInteraction);
  };

  setTimeout(() => {
    tryPlayMusic(false);
  }, 500);

  window.addEventListener('pointerdown', unlockOnFirstInteraction, { passive: true });
  window.addEventListener('touchstart', unlockOnFirstInteraction, { passive: true });
  window.addEventListener('keydown', unlockOnFirstInteraction);
}

function initRsvp() {
  const form = document.querySelector('#rsvpForm');
  const status = document.querySelector('#rsvpStatus');
  const submit = document.querySelector('#rsvpSubmitBtn');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const record = normalizeRsvp(data);

    if (!record.guestName) {
      setStatus(status, 'Escribe el nombre de quien confirma.', 'error');
      document.querySelector('#guestName')?.focus();
      return;
    }

    if (record.attendance === 'si' && record.adults + record.kids < 1) {
      setStatus(status, 'Indica al menos un adulto o un nino.', 'error');
      return;
    }

    if (!hasSupabaseConfig() && !EVENT.rsvpWebhookUrl) {
      setStatus(status, 'Falta configurar la base de datos en .env.local.', 'error');
      return;
    }

    setButtonLoading(submit, true);
    setStatus(status, 'Enviando confirmación...', 'ok');

    try {
      await sendConfirmation(record);
      saveLocalRsvp(record);
      form.reset();
      document.querySelector('#adults').value = 1;
      document.querySelector('#kids').value = 1;
      setStatus(status, 'Confirmación enviada. Gracias por responder.', 'ok');
      showToast('Confirmación guardada.');
    } catch {
      setStatus(status, 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.', 'error');
    } finally {
      setButtonLoading(submit, false);
    }
  });
}

function normalizeRsvp(data) {
  return {
    guestName: String(data.guestName || '').trim(),
    attendance: data.attendance === 'no' ? 'no' : 'si',
    adults: clampNumber(data.adults, 0, 20),
    kids: clampNumber(data.kids, 0, 20),
    phone: String(data.phone || '').trim(),
    song: String(data.song || '').trim(),
    message: String(data.message || '').trim(),
    createdAt: new Date().toISOString(),
    event: `${EVENT.guestOfHonor} ${EVENT.age} - ${EVENT.themeTitle}`
  };
}

function clampNumber(value, min, max) {
  const number = Number.parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
}

function saveLocalRsvp(record) {
  const current = readLocalRsvps();
  current.unshift(record);
  window.localStorage.setItem(storageKey, JSON.stringify(current.slice(0, 8)));
}

function readLocalRsvps() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey) || '[]');
  } catch {
    return [];
  }
}

async function sendWebhook(record) {
  const payload = {
    ...record,
    eventName: `${EVENT.guestOfHonor} ${EVENT.age} - ${EVENT.themeTitle}`,
    eventDate: `${EVENT.dateLabel}, ${EVENT.timeLabel}`,
    venue: EVENT.venue,
    address: EVENT.address,
    submittedAt: new Date().toISOString()
  };

  await fetch(EVENT.rsvpWebhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload)
  });
}

async function sendConfirmation(record) {
  if (hasSupabaseConfig()) {
    await insertSupabaseRsvp(record);
    return;
  }

  await sendWebhook(record);
}

function hasSupabaseConfig() {
  return Boolean(EVENT.supabase?.url && EVENT.supabase?.anonKey && EVENT.supabase?.table);
}

function getSupabaseRestUrl(path = '') {
  return `${EVENT.supabase.url.replace(/\/$/, '')}/rest/v1/${EVENT.supabase.table}${path}`;
}

function getSupabaseHeaders(extra = {}) {
  return {
    apikey: EVENT.supabase.anonKey,
    Authorization: `Bearer ${EVENT.supabase.anonKey}`,
    ...extra
  };
}

async function insertSupabaseRsvp(record) {
  const payload = {
    guest_name: record.guestName,
    attendance: record.attendance,
    adults: record.adults,
    kids: record.kids,
    phone: record.phone,
    song: record.song,
    message: record.message,
    event_name: `${EVENT.guestOfHonor} ${EVENT.age} - ${EVENT.themeTitle}`,
    event_date: `${EVENT.dateLabel}, ${EVENT.timeLabel}`,
    venue: EVENT.venue,
    address: EVENT.address
  };

  const response = await fetch(getSupabaseRestUrl(), {
    method: 'POST',
    headers: getSupabaseHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    }),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Supabase insert failed');
  }
}

async function fetchSupabaseRsvps() {
  if (!hasSupabaseConfig()) {
    return readLocalRsvps().map((item) => ({
      guest_name: item.guestName,
      attendance: item.attendance,
      adults: item.adults,
      kids: item.kids,
      phone: item.phone,
      song: item.song,
      message: item.message,
      created_at: item.createdAt
    }));
  }

  const response = await fetch(getSupabaseRestUrl('?select=*&order=created_at.desc'), {
    headers: getSupabaseHeaders()
  });

  if (!response.ok) {
    throw new Error('Supabase fetch failed');
  }

  return response.json();
}

function setStatus(node, message, type) {
  if (!node) return;
  node.textContent = message;
  node.dataset.type = type;
}

function setButtonLoading(button, isLoading) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Enviando...' : 'Enviar confirmación';
}

function openAdminWithPassword() {
  if (!EVENT.adminPassword) {
    showToast('Configura la contraseña de admin en .env.local.');
    return;
  }

  const password = window.prompt('Contraseña de administrador');
  if (password !== EVENT.adminPassword) {
    showToast('Contraseña incorrecta.');
    return;
  }

  sessionStorage.setItem(adminSessionKey, 'true');
  window.location.hash = 'admin';
}

function renderAdminRoute() {
  if (sessionStorage.getItem(adminSessionKey) !== 'true') {
    renderAdminLogin();
    return;
  }

  renderAdminDashboard();
}

function renderAdminLogin() {
  document.body.classList.add('admin-view');
  const passwordMissing = !EVENT.adminPassword;
  app.innerHTML = `
    <main class="admin-shell admin-login-shell">
      <section class="admin-login-panel">
        <p class="section__eyebrow">Acceso privado</p>
        <h1 class="admin-login-title">${EVENT.guestOfHonor}'s dashboard</h1>
        <p class="admin-muted">${passwordMissing ? 'Falta configurar VITE_ADMIN_PASSWORD en .env.local.' : 'Ingresa la contraseña para revisar confirmaciones.'}</p>
        <form id="adminLoginForm" class="admin-login-form">
          <input id="adminPasswordInput" type="password" autocomplete="current-password" placeholder="Contraseña" required ${passwordMissing ? 'disabled' : ''} />
          <button class="admin-neon-btn" type="submit" ${passwordMissing ? 'disabled' : ''}>Entrar</button>
          <button class="admin-link-btn" type="button" id="backToInviteBtn">Volver a la invitación</button>
          <p class="status-message" id="adminLoginStatus" aria-live="polite"></p>
        </form>
      </section>
    </main>
  `;

  document.querySelector('#adminLoginForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!EVENT.adminPassword) {
      setStatus(document.querySelector('#adminLoginStatus'), 'Configura VITE_ADMIN_PASSWORD en .env.local.', 'error');
      return;
    }

    const value = document.querySelector('#adminPasswordInput')?.value;
    if (value !== EVENT.adminPassword) {
      setStatus(document.querySelector('#adminLoginStatus'), 'Contraseña incorrecta.', 'error');
      return;
    }

    sessionStorage.setItem(adminSessionKey, 'true');
    renderAdminDashboard();
  });

  document.querySelector('#backToInviteBtn')?.addEventListener('click', () => {
    window.location.hash = '';
  });
}

async function renderAdminDashboard() {
  document.body.classList.add('admin-view');
  app.innerHTML = `
    <main class="admin-shell">
      <div class="admin-bg-stickers" aria-hidden="true">
        <img src="/stickers/rubik.svg" alt="" />
        <img src="/stickers/lightning.svg" alt="" />
        <img src="/stickers/boombox.svg" alt="" />
      </div>
      <header class="admin-hero">
        <div>
          <p class="admin-kicker">${EVENT.guestOfHonor}'s ${EVENT.age}th birthday</p>
          <h1>Admin dashboard</h1>
        </div>
        <button class="admin-logout" id="adminLogoutBtn" type="button">Logout</button>
      </header>

      <section class="admin-stats" id="adminStats" aria-live="polite">
        ${renderAdminStatSkeleton('Total familias')}
        ${renderAdminStatSkeleton('Total adultos')}
        ${renderAdminStatSkeleton('Total niños')}
      </section>

      <section class="admin-table-section">
        <label class="admin-search">
          <span class="sr-only">Buscar invitado</span>
          <input id="adminSearchInput" placeholder="Buscar invitado..." />
          <span aria-hidden="true">${icon.sparkle}</span>
        </label>
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Asistencia</th>
                <th>Adultos</th>
                <th>Niños</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody id="adminTableBody">
              <tr><td colspan="5">Cargando confirmaciones...</td></tr>
            </tbody>
          </table>
        </div>
        <p class="admin-muted" id="adminDataStatus"></p>
      </section>
    </main>
  `;

  document.querySelector('#adminLogoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem(adminSessionKey);
    window.location.hash = '';
  });

  try {
    const rows = (await fetchSupabaseRsvps()).map(normalizeAdminRow);
    renderAdminData(rows);
  } catch {
    document.querySelector('#adminTableBody').innerHTML = '<tr><td colspan="5">No se pudieron cargar las confirmaciones.</td></tr>';
    document.querySelector('#adminDataStatus').textContent = 'Revisa la configuración de Supabase en .env.local.';
  }
}

function renderAdminStatSkeleton(label) {
  return `
    <article class="admin-stat-card">
      <span>${label}</span>
      <strong>--</strong>
      <img src="/stickers/arcade.svg" alt="" />
    </article>
  `;
}

function renderAdminData(rows) {
  const search = document.querySelector('#adminSearchInput');
  const status = document.querySelector('#adminDataStatus');

  const paint = () => {
    const query = String(search?.value || '').trim().toLowerCase();
    const filtered = rows.filter((row) => row.name.toLowerCase().includes(query) || row.phone.includes(query));
    renderAdminStats(filtered);
    renderAdminRows(filtered);
    if (status) status.textContent = hasSupabaseConfig() ? `${filtered.length} registros desde Supabase.` : `${filtered.length} registros locales de prueba.`;
  };

  search?.addEventListener('input', paint);
  paint();
}

function renderAdminStats(rows) {
  const families = rows.filter((row) => row.attendance !== 'no').length;
  const adults = rows.reduce((total, row) => total + row.adults, 0);
  const kids = rows.reduce((total, row) => total + row.kids, 0);

  document.querySelector('#adminStats').innerHTML = [
    ['Total familias', families],
    ['Total adultos', adults],
    ['Total niños', kids]
  ].map(([label, value]) => `
    <article class="admin-stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
      <img src="/stickers/arcade.svg" alt="" />
    </article>
  `).join('');
}

function renderAdminRows(rows) {
  const body = document.querySelector('#adminTableBody');
  if (!body) return;
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="5">Sin confirmaciones encontradas.</td></tr>';
    return;
  }

  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.name)}</td>
      <td>${row.attendance === 'no' ? 'No asistirán' : 'Sí asistirán'}</td>
      <td>${row.adults}</td>
      <td>${row.kids}</td>
      <td>${escapeHtml(row.phone || '-')}</td>
    </tr>
  `).join('');
}

function normalizeAdminRow(row) {
  return {
    name: String(row.guest_name || row.guestName || row.name || 'Sin nombre'),
    attendance: row.attendance === 'no' ? 'no' : 'si',
    adults: clampNumber(row.adults, 0, 999),
    kids: clampNumber(row.kids ?? row.children, 0, 999),
    phone: String(row.phone || row.telefono || row.whatsapp || '')
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function initPuzzles() {
  initTabs();
  initMemoryGame();
  initSlidePuzzle();
}

function initTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => {
        const panel = document.querySelector(`#${item.getAttribute('aria-controls')}`);
        const isActive = item === tab;
        item.setAttribute('aria-selected', String(isActive));
        panel?.classList.toggle('is-active', isActive);
        if (panel) panel.hidden = !isActive;
      });
    });
  });
}

function initMemoryGame() {
  const game = document.querySelector('#memoryGame');
  const status = document.querySelector('#memoryStatus');
  const reset = document.querySelector('#resetMemoryBtn');
  const cardsBase = EVENT.stickers.slice(0, 6).map((src, index) => ({ id: `pair-${index}`, src }));
  let cards = [];
  let first = null;
  let second = null;
  let lock = false;
  let matched = 0;

  const start = () => {
    cards = shuffle([...cardsBase, ...cardsBase].map((card, index) => ({ ...card, uid: `${card.id}-${index}`, flipped: false, matched: false })));
    first = null;
    second = null;
    lock = false;
    matched = 0;
    render();
    updateStatus();
  };

  const render = () => {
    game.innerHTML = cards.map((card, index) => `
      <button class="memory-card ${card.flipped ? 'is-flipped' : ''} ${card.matched ? 'is-matched' : ''}" type="button" data-index="${index}" aria-label="Tarjeta de memoria ${index + 1}">
        <img src="${card.src}" alt="Sticker retro" draggable="false" />
      </button>
    `).join('');
  };

  const updateStatus = () => {
    if (!status) return;
    if (matched === cardsBase.length) {
      status.textContent = `Reto completado. Clave retro desbloqueada: MEGAN${EVENT.age}.`;
      spawnConfetti(90);
      showToast('Memoria completada.');
    } else {
      status.textContent = `${matched} parejas encontradas.`;
    }
  };

  game?.addEventListener('click', (event) => {
    const button = event.target.closest('.memory-card');
    if (!button || lock) return;
    const index = Number(button.dataset.index);
    const card = cards[index];
    if (!card || card.flipped || card.matched) return;

    card.flipped = true;
    if (!first) {
      first = { card, index };
      render();
      return;
    }

    second = { card, index };
    render();

    if (first.card.id === second.card.id) {
      first.card.matched = true;
      second.card.matched = true;
      matched += 1;
      first = null;
      second = null;
      window.setTimeout(() => {
        render();
        updateStatus();
      }, 240);
      return;
    }

    lock = true;
    window.setTimeout(() => {
      first.card.flipped = false;
      second.card.flipped = false;
      first = null;
      second = null;
      lock = false;
      render();
    }, 760);
  });

  reset?.addEventListener('click', start);
  start();
}

function initSlidePuzzle() {
  const board = document.querySelector('#slideBoard');
  const status = document.querySelector('#slideStatus');
  const shuffleBtn = document.querySelector('#shuffleSlideBtn');
  const solveBtn = document.querySelector('#solveSlideBtn');
  const solved = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  let tiles = [...solved];
  let moves = 0;

  const render = () => {
    const emptyIndex = tiles.indexOf(8);
    board.innerHTML = tiles.map((piece, index) => {
      const empty = piece === 8;
      const row = Math.floor(piece / 3);
      const col = piece % 3;
      const canMove = !empty && areAdjacent(index, emptyIndex);
      const posX = col * 50;
      const posY = row * 50;
      return `
        <button class="slide-tile ${empty ? 'is-empty' : ''} ${canMove ? 'can-move' : ''}" type="button" data-index="${index}" ${empty ? 'disabled aria-label="Espacio vacío"' : `aria-label="Pieza ${piece + 1}"`} style="--bg-image:url('${EVENT.puzzleImage}');--tile-pos:${posX}% ${posY}%"></button>
      `;
    }).join('');
    if (status) status.textContent = isSolved() ? `Completado en ${moves} movimientos.` : `Movimientos: ${moves}`;
  };

  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(8);
    if (!areAdjacent(index, emptyIndex)) return false;
    [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
    moves += 1;
    render();
    if (isSolved()) {
      spawnConfetti(90);
      showToast('Rompecabezas completado.');
    }
    return true;
  };

  const shufflePuzzle = () => {
    tiles = [...solved];
    moves = 0;
    let lastEmpty = -1;
    for (let i = 0; i < 90; i += 1) {
      const empty = tiles.indexOf(8);
      const options = getAdjacentIndexes(empty).filter((index) => index !== lastEmpty);
      const pick = options[Math.floor(Math.random() * options.length)];
      [tiles[pick], tiles[empty]] = [tiles[empty], tiles[pick]];
      lastEmpty = empty;
    }
    if (isSolved()) [tiles[7], tiles[8]] = [tiles[8], tiles[7]];
    render();
  };

  board?.addEventListener('click', (event) => {
    const button = event.target.closest('.slide-tile');
    if (!button) return;
    moveTile(Number(button.dataset.index));
  });

  shuffleBtn?.addEventListener('click', shufflePuzzle);
  solveBtn?.addEventListener('click', () => {
    tiles = [...solved];
    moves = 0;
    render();
    showToast('Solucion visible. Mezcla otra vez para jugar.');
  });

  shufflePuzzle();

  function isSolved() {
    return tiles.every((tile, index) => tile === index);
  }
}

function areAdjacent(a, b) {
  const ar = Math.floor(a / 3);
  const ac = a % 3;
  const br = Math.floor(b / 3);
  const bc = b % 3;
  return Math.abs(ar - br) + Math.abs(ac - bc) === 1;
}

function getAdjacentIndexes(index) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  return [
    row > 0 ? index - 3 : null,
    row < 2 ? index + 3 : null,
    col > 0 ? index - 1 : null,
    col < 2 ? index + 1 : null
  ].filter((value) => value !== null);
}

function shuffle(array) {
  const clone = [...array];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function spawnConfetti(count = 50) {
  const layer = document.querySelector('#confettiLayer');
  if (!layer) return;
  const colors = ['#ff2dbd', '#00eaff', '#ffe93b', '#44ff69', '#721bff'];
  const pieces = Array.from({ length: count }, () => {
    const c = colors[Math.floor(Math.random() * colors.length)];
    const x = `${Math.random() * 100}%`;
    const dx = `${(Math.random() - 0.5) * 260}px`;
    const w = `${Math.random() * 9 + 6}px`;
    const h = `${Math.random() * 17 + 9}px`;
    const t = `${Math.random() * 1.6 + 2.2}s`;
    const r = `${Math.random() * 180}deg`;
    return `<span class="confetti-piece" style="--c:${c};--x:${x};--dx:${dx};--w:${w};--h:${h};--t:${t};--r:${r}"></span>`;
  }).join('');
  layer.insertAdjacentHTML('beforeend', pieces);
  window.setTimeout(() => {
    [...layer.querySelectorAll('.confetti-piece')].slice(0, count).forEach((node) => node.remove());
  }, 4200);
}

async function shareInvitation() {
  const shareData = {
    title: `Fiesta 80s de ${EVENT.guestOfHonor}`,
    text: `${EVENT.guestOfHonor} cumple ${EVENT.age}. ${EVENT.dateLabel}, ${EVENT.timeLabel} en ${EVENT.venue}.`,
    url: window.location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      showToast('Invitación compartida.');
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  await copyText(window.location.href);
  showToast('Enlace copiado.');
}

function downloadCalendarFile() {
  const ics = buildIcsFile();
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'fiesta-megan-80s.ics';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast('Archivo de calendario descargado.');
}

function buildIcsFile() {
  const start = toIcsDate(new Date(EVENT.dateTime));
  const end = toIcsDate(new Date(EVENT.endDateTime));
  const created = toIcsDate(new Date());
  const description = `Fiesta más 80s de ${EVENT.guestOfHonor}. Código de vestimenta: ${EVENT.dressCode}. Confirmar asistencia desde la invitación web.`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Megan 80s//Invitación//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${cryptoRandom()}@megan-80s`,
    `DTSTAMP:${created}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Fiesta 80s de ${EVENT.guestOfHonor}`,
    `LOCATION:${escapeIcs(`${EVENT.venue}, ${EVENT.address}`)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

function toIcsDate(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcs(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function cryptoRandom() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below.
    }
  }
  const input = document.createElement('textarea');
  input.value = text;
  input.setAttribute('readonly', '');
  input.style.position = 'fixed';
  input.style.opacity = '0';
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand('copy');
  input.remove();
  return copied;
}

function showToast(message) {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (window.location.protocol === 'file:') return;
  if (['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    window.addEventListener('load', async () => {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
      if (window.caches) {
        const keys = await window.caches.keys();
        await Promise.all(keys.map((key) => window.caches.delete(key)));
      }
    });
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { });
  });
}
function initScrollReveal() {
  const selectors = [
    '.hero',
    '.hero__copy',
    '.quick-info .info-tile',
    '.section',
    '.count-box',
    '.split-grid > .card',
    '.location-card',
    '.location-visual',
    '.location-panel',
    '.rsvp-layout > *',
    '.puzzle-tabs',
    '.puzzle-panel.is-active',
    '.footer'
  ];

  const elements = [...new Set(document.querySelectorAll(selectors.join(',')))];

  if (!elements.length) return;

  elements.forEach((element, index) => {
    element.classList.add('reveal-on-scroll');
    element.style.setProperty('--reveal-delay', `${Math.min((index % 5) * 80, 320)}ms`);
  });

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    }
  );

  elements.forEach((element) => observer.observe(element));
}
