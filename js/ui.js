/**
 * ui.js — Capa de presentación
 * Responsabilidad única: manipulación del DOM.
 * No hace fetch. No maneja eventos de página. Solo renderiza.
 *
 * Depende de: api.js (debe cargarse antes en el HTML)
 * Expone: createCard, renderCharacters, updatePagination, setLoading, setError
 */

/* ──────────────────────────────────────────────────────────
   CONSTANTES DE PRESENTACIÓN
────────────────────────────────────────────────────────── */

// Etiquetas del grid de stats — orden: fila 1 [AGI, WPN, IQ] / fila 2 [TEC, DEF, STM]
const STAT_LABELS = ['AGI', 'WPN', 'IQ', 'TEC', 'DEF', 'STM'];

/* ──────────────────────────────────────────────────────────
   REFS DOM — se resuelven una sola vez en main.js via initDOM()
   ui.js las recibe como objeto `dom` inyectado desde main.js
────────────────────────────────────────────────────────── */

/**
 * Retorna todas las referencias DOM necesarias.
 * Llamado una vez en main.js al arrancar.
 * @returns {Object}
 */
function resolveDOM() {
  return {
    container:   document.getElementById('cards-container'),
    loading:     document.getElementById('loading-screen'),
    error:       document.getElementById('error-screen'),
    errorMsg:    document.getElementById('error-message-text'),
    btnRetry:    document.getElementById('btn-retry'),
    btnPrev:     document.getElementById('btn-prev'),
    btnNext:     document.getElementById('btn-next'),
    pageCurrent: document.getElementById('page-current'),
    pageTotal:   document.getElementById('page-total'),
  };
}

/* ──────────────────────────────────────────────────────────
   MOTOR DE STATS — Determinístico, sin random
────────────────────────────────────────────────────────── */

/**
 * Genera estadísticas determinísticas a partir de los datos del personaje.
 * Todas las fórmulas usan propiedades estables del personaje como semilla.
 * @param {Object} character
 * @returns {{ ovr, pos, agi, wpn, iq, tec, def, stm }}
 */
function generateStats(character) {
  const { id, name, species, status } = character;
  const eps = character.episode; // Array — usar .length

  const clamp = v => Math.min(99, Math.max(1, v));

  const ovr = clamp(70 + (id % 30));
  const pos = species.slice(0, 3).toUpperCase();
  const agi = clamp(60 + name.length * 2);
  const wpn = clamp(ovr - 5);
  const iq  = clamp(ovr + 2);
  const tec = clamp(eps.length > 20 ? 99 : 75 + eps.length);
  const def = clamp(status === 'Alive' ? 85 : 40);
  const stm = clamp(80 + (id % 15));

  return { ovr, pos, agi, wpn, iq, tec, def, stm };
}

/* ──────────────────────────────────────────────────────────
   SISTEMA DE RAREZA
────────────────────────────────────────────────────────── */

/**
 * Devuelve la clase CSS de rareza según el origen del personaje.
 * @param {string} originName
 * @returns {'rarity-earth'|'rarity-unknown'|'rarity-alien'}
 */
function getRarityClass(originName) {
  const o = originName.toLowerCase();
  if (o.includes('earth')) return 'rarity-earth';
  if (o === 'unknown')     return 'rarity-unknown';
  return 'rarity-alien';
}

/**
 * Devuelve la clase CSS del badge de estado.
 * @param {string} status
 * @returns {string}
 */
function getStatusClass(status) {
  const map = { Alive: 'status-alive', Dead: 'status-dead' };
  return map[status] ?? 'status-unknown';
}

/* ──────────────────────────────────────────────────────────
   FÁBRICA DE TARJETAS
────────────────────────────────────────────────────────── */

/**
 * Crea un elemento <article> con la tarjeta completa del personaje.
 * La imagen usa position:absolute con z-index alto para el efecto
 * Out-of-Bounds 3D (sale por encima del borde de la carta).
 *
 * @param {Object} character - Objeto personaje de la API
 * @param {number} index     - Posición 0-based para stagger de animación
 * @returns {HTMLElement}
 */
function createCard(character, index) {
  const stats       = generateStats(character);
  const rarityClass = getRarityClass(character.origin.name);
  const statusClass = getStatusClass(character.status);

  // Origen — si es "unknown" muestra símbolo especial
  const originDisplay = character.origin.name === 'unknown'
    ? '∅ DESCONOCIDO'
    : character.origin.name.toUpperCase();

  // Celdas de stats en orden de grid 2×3
  const statValues = [stats.agi, stats.wpn, stats.iq, stats.tec, stats.def, stats.stm];
  const statCells  = statValues
    .map((val, i) => `
      <div class="stat-cell">
        <span class="stat-lbl">${STAT_LABELS[i]}</span>
        <span class="stat-val">${val}</span>
      </div>
    `)
    .join('');

  const article = document.createElement('article');
  article.className = `character-card ${rarityClass}`;
  // Delay escalonado via CSS variable custom property
  article.style.setProperty('--anim-delay', `${index * 0.04}s`);
  article.setAttribute('role', 'listitem');

  // Badge de estrellas según OVR
  const starRating = stats.ovr >= 95 ? '5★5' : stats.ovr >= 88 ? '4★5' : '3★5';

  article.innerHTML = `
    <div class="card-shield-bg"     aria-hidden="true"></div>
    <div class="card-shield-border" aria-hidden="true"></div>

    <div class="card-image-wrap">
      <img
        src="${character.image}"
        alt="Retrato de ${character.name}"
        loading="lazy"
        decoding="async"
        width="190"
        height="190"
      />
    </div>

    <div class="card-stars" aria-hidden="true">${starRating}</div>

    <div class="card-inner">
      <div class="card-ovr-block" aria-label="Valoración ${stats.ovr}, posición ${stats.pos}">
        <span class="card-ovr">${stats.ovr}</span>
        <span class="card-pos">${stats.pos}</span>
      </div>

      <div class="card-info">
        <h2 class="card-name">${character.name}</h2>
        <div class="card-meta">
          <span class="card-species">${character.species.toUpperCase()}</span>
          <span class="card-origin">${originDisplay}</span>
        </div>
        <div class="card-status-badge ${statusClass}" aria-label="Estado: ${character.status}">
          ${character.status.toUpperCase()}
        </div>
        <div class="card-divider" aria-hidden="true"></div>

        <div class="card-stats" role="list" aria-label="Estadísticas de ${character.name}">
          ${statCells}
        </div>
      </div>
    </div>
  `;

  return article;
}

/* ──────────────────────────────────────────────────────────
   RENDER
────────────────────────────────────────────────────────── */

/**
 * Renderiza todas las tarjetas en el grid usando un DocumentFragment
 * para minimizar reflows (una sola inserción al DOM).
 * @param {HTMLElement} container - El elemento #cards-container
 * @param {Array}       characters
 */
function renderCharacters(container, characters) {
  const fragment = document.createDocumentFragment();
  characters.forEach((char, i) => fragment.appendChild(createCard(char, i)));

  container.innerHTML = '';
  container.appendChild(fragment);
  container.setAttribute('aria-label', `${characters.length} personajes cargados`);
}

/**
 * Actualiza los controles de paginación y los labels de página.
 * @param {Object} dom       - Referencias DOM
 * @param {Object} info      - Objeto info de la API { count, pages, next, prev }
 * @param {Object} state     - Estado de la app { currentPage, totalPages, isLoading }
 */
function updatePagination(dom, info, state) {
  state.totalPages = info.pages;

  dom.pageCurrent.textContent = state.currentPage;
  dom.pageTotal.textContent   = info.pages;

  dom.btnPrev.disabled = !info.prev  || state.isLoading;
  dom.btnNext.disabled = !info.next  || state.isLoading;

  dom.btnPrev.setAttribute('aria-disabled', String(!info.prev  || state.isLoading));
  dom.btnNext.setAttribute('aria-disabled', String(!info.next  || state.isLoading));
}

/* ──────────────────────────────────────────────────────────
   GESTORES DE ESTADO UI
────────────────────────────────────────────────────────── */

/**
 * Activa/desactiva el estado de carga.
 * Bloquea paginación mientras dura el fetch (Loading Lock).
 * @param {HTMLElement} dom
 * @param {Object}      state
 * @param {boolean}     active
 */
function setLoading(dom, state, active) {
  state.isLoading = active;

  dom.loading.classList.toggle('hidden', !active);
  dom.container.style.visibility = active ? 'hidden' : 'visible';

  // Lock de paginación — previene múltiples requests por clicks rápidos
  dom.btnPrev.disabled = active || state.currentPage <= 1;
  dom.btnNext.disabled = active || state.currentPage >= state.totalPages;
}

/**
 * Muestra u oculta el estado de error con un mensaje.
 * @param {Object}      dom
 * @param {string|null} message - null para ocultar
 */
function setError(dom, message) {
  if (message) {
    dom.error.classList.remove('hidden');
    dom.errorMsg.textContent = message;
    dom.container.style.visibility = 'hidden';
  } else {
    dom.error.classList.add('hidden');
  }
}