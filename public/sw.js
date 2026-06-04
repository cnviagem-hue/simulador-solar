// Motor PWA - Este ficheiro permite que o navegador reconheça o site como App
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Instalado com sucesso.');
});

self.addEventListener('fetch', (e) => {
  // Deixa os pedidos normais passarem
});
