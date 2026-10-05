const cacheName = 'crud-jwt-v2'
const arquivos = [
  '/',
  '/index.html',
  '/usuarios.html',
  '/style.css',
  '/auth.js',
  '/usuarios.js',
  '/manifest.json'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(arquivos))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resposta => resposta || fetch(event.request))
  )
})