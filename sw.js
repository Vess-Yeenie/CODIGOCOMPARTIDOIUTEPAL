/**
 * @file sw.js
 * @description Service Worker para soporte de Progressive Web App (PWA) del Repositorio IUTEPAL.
 * Gestiona el ciclo de vida del worker en el navegador (instalación, activación y control inmediato de clientes),
 * permitiendo la instalación de la aplicación como aplicación de escritorio o móvil (a través de manifest.json).
 * 
 * Estrategia de Red: Network-First passthrough directo para garantizar que las actualizaciones de documentos
 * y cambios de interfaz en caliente no queden bloqueados por caché obsoleta durante el desarrollo y producción.
 * 
 * @module Client/ServiceWorker
 * @author IUTEPAL - División de Sistemas
 * @version 1.0.0
 */

/**
 * Evento 'install':
 * Fuerza al nuevo Service Worker a pasar inmediatamente al estado activo sin esperar a que
 * las pestañas abiertas existentes sean cerradas.
 */
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

/**
 * Evento 'activate':
 * Reclama inmediatamente el control de todos los clientes/pestañas abiertos bajo el alcance (scope)
 * del Service Worker actual.
 */
self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

/**
 * Evento 'fetch':
 * Intercepta las solicitudes de red salientes y las resuelve directamente contra el servidor
 * sin interposición de caché estática agresiva.
 */
self.addEventListener('fetch', (e) => {
  // Despacho directo hacia la red
  e.respondWith(fetch(e.request));
});
