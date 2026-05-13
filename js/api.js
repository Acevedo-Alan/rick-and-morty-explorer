/**
 * api.js — Capa de acceso a datos
 * Responsabilidad única: comunicación con la Rick & Morty API.
 * No toca el DOM. No conoce la UI. Solo fetch y transform.
 */

const API_BASE = 'https://rickandmortyapi.com/api/character';

/**
 * Obtiene una página de personajes de la API.
 * @param {number} page - Número de página (base 1)
 * @returns {Promise<{ info: Object, results: Array }>}
 * @throws {Error} Si la respuesta HTTP no es 2xx
 */
async function fetchCharacters(page) {
  const url = `${API_BASE}?page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — No se pudo cargar la página ${page}`);
  }

  return response.json();
}