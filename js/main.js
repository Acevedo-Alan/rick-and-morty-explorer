/**
 * main.js — Orquestador principal
 * Responsabilidad única: estado de la app, binding de eventos y controlador de páginas.
 * Depende de: api.js (fetchCharacters) y ui.js (renderCharacters, updatePagination, etc.)
 * Ambos deben cargarse antes en el HTML.
 */

/* ──────────────────────────────────────────────────────────
   ESTADO GLOBAL DE LA APP
   (único lugar donde vive el estado — no se filtra a api.js ni ui.js)
────────────────────────────────────────────────────────── */
const state = {
  currentPage: 1,
  totalPages:  1,
  isLoading:   false, // Loading Lock — evita requests concurrentes
};

/* ──────────────────────────────────────────────────────────
   REFERENCIAS DOM
   Resueltas una sola vez en init() y pasadas por inyección
────────────────────────────────────────────────────────── */
let dom = null;

/* ──────────────────────────────────────────────────────────
   CONTROLADOR DE PÁGINA
────────────────────────────────────────────────────────── */

/**
 * Carga y renderiza una página de personajes.
 * El Loading Lock (state.isLoading) impide requests paralelos
 * si el usuario hace click rápido en los botones de paginación.
 *
 * @param {number} page - Número de página a cargar (base 1)
 */
async function loadPage(page) {
  // Loading Lock — abortar si ya hay un fetch activo
  if (state.isLoading) return;

  setLoading(dom, state, true);
  setError(dom, null);

  try {
    const data = await fetchCharacters(page);         // api.js
    renderCharacters(dom.container, data.results);    // ui.js
    updatePagination(dom, data.info, state);          // ui.js
    state.currentPage = page;

    // Scroll suave al cambiar de página (no en la carga inicial)
    if (page !== 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } catch (err) {
    setError(dom, `ERROR DE CONEXIÓN: ${err.message}`);
    console.error('[Rick & Morty SPA]', err);
  } finally {
    setLoading(dom, state, false);
  }
}

/* ──────────────────────────────────────────────────────────
   BINDING DE EVENTOS
────────────────────────────────────────────────────────── */

/**
 * Registra todos los event listeners de la aplicación.
 * Solo se llama una vez en init().
 */
function bindEvents() {
  dom.btnPrev.addEventListener('click', () => {
    if (!state.isLoading && state.currentPage > 1) {
      loadPage(state.currentPage - 1);
    }
  });

  dom.btnNext.addEventListener('click', () => {
    if (!state.isLoading && state.currentPage < state.totalPages) {
      loadPage(state.currentPage + 1);
    }
  });

  dom.btnRetry.addEventListener('click', () => {
    loadPage(state.currentPage);
  });
}

/* ──────────────────────────────────────────────────────────
   BOOTSTRAP
────────────────────────────────────────────────────────── */

/**
 * Punto de entrada de la aplicación.
 * Orden: DOM → eventos → primera carga.
 */
function init() {
  dom = resolveDOM(); // ui.js
  bindEvents();
  loadPage(1);
}

// Esperar al DOM antes de inicializar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}