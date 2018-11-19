// Version 0.2.3

var cacheName = "little-address-book";
var filesToCache = [
	"/",
	"index.html",
	"style.css",
	"app.js"
];


self.addEventListener('message', function(event){	
	console.log(event.data);
});

self.addEventListener('install', function(e){
	e.waitUntil(
		caches.open(cacheName).then(function(cache){
			console.log('[ServiceWorker] Install');
			return cache.addAll(filesToCache);
		})
	);
	e.waitUntil(self.skipWaiting());
});


self.addEventListener('activate', function(event) {
	event.waitUntil(self.clients.claim());
	console.log("Claimed");
});


self.addEventListener('fetch', function(event) {

	event.respondWith(
		caches.open(cacheName).then(function(cache) {
			return cache.match(event.request, {ignoreSearch:true}).then(function (response) {
				return response || fetch(event.request).then(function(response) {
					navigator.serviceWorker.controller.postMessage({action: response});
					cache.put(event.request, response.clone());
					return response;
				});
			});
		})
	);
});