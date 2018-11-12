// Version 0.2.1

var cacheName = "little-address-book";
var filesToCache = [
	"/",
	"index.html",
	"style.css",
	"app.js",
	"logo.png"
];


// All the resources are transient. Let's cache them.
self.addEventListener('install', function(e){
	console.log('[ServiceWorker] Install');

	e.waitUntil(
		caches.open(cacheName).then(function(cache){
			console.log('[ServiceWorker] Install');
			return cache.addAll(filesToCache);
		})
	);
});




// This what happens when the newest version of the app activates. Obviously.
self.addEventListener('activate', event => {
	event.waitUntil(self.clients.claim());	
});



// Looking for a resource? Let's check the store first.
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request, {ignoreSearch:true}).then(response => {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('message', function(event){
	console.log(event.data.action);
	if(event.data.action == 'skipWaiting') {
		console.log("Should skip?");
		self.skipWaiting();
	}
});