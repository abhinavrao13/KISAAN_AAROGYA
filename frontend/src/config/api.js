/**
 * Production API & Static Assets URL Helper
 * Reads VITE_API_URL if configured for remote backend (e.g. on Render / Railway),
 * otherwise defaults to relative root for local Vite dev proxy.
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || '';

// Normalize by stripping trailing slash
export const API_BASE_URL = RAW_API_URL.endsWith('/')
  ? RAW_API_URL.slice(0, -1)
  : RAW_API_URL;

/**
 * Returns full URL for API endpoint
 * @param {string} endpoint - e.g. '/api/analyze/crop'
 */
export function getApiUrl(endpoint) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return cleanEndpoint;
  }
  return `${API_BASE_URL}${cleanEndpoint}`;
}

/**
 * Returns full URL for static assets (samples, uploaded masks, etc.)
 * @param {string} path - e.g. '/static/samples/tomato_early_blight.jpg'
 */
export function getStaticUrl(path) {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('blob:') || path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!API_BASE_URL) {
    return cleanPath;
  }
  return `${API_BASE_URL}${cleanPath}`;
}
