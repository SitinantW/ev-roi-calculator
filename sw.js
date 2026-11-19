const CACHE_NAME = 'ev-roi-pwa-v31';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// ติดตั้ง Service Worker และเก็บไฟล์ลง Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// ลบ Cache เก่าเมื่อมีการอัปเดตเวอร์ชันใหม่
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// ดึงข้อมูลจาก Cache ก่อน หากไม่มีค่อยโหลดจากเครือข่าย
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
