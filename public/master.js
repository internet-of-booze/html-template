//This is the service worker with the Cache-first network

var CACHE = 'iob-precache'
, settings = {
	namespace : '[IoB - PWA]'
}
, precacheFiles = [
      /* Add an array of files to precache for your app */
    ];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function(evt) {
  console.log(settings.namespace, 'The service worker is being installed.');
  evt.waitUntil(precache().then(function() {
    console.log(settings.namespace, 'Skip waiting on install');
    return self.skipWaiting();
  }));
});


//allow sw to control of current page
self.addEventListener('activate', function(evt) {
  console.log(settings.namespace, 'Claiming clients for current page');
  return self.clients.claim();
});

self.addEventListener('fetch', function(evt) {
	var mode = evt.request.mode;
	console.log(settings.namespace, 'The service worker is serving the "' + mode + '" asset.'+ evt.request.url);

	switch(mode){
		case 'same-origin':
		// this is a callmade internally //
			evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
		     evt.waitUntil(update(evt.request));
		break;
		case 'cors':
		// this is our ajax call so lets have it check if we are online if not then have it run a cache backup //
		break;
	}

});

// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
// 		 console.log('[IoB - PWA] The service worker is serving the asset.'+ event.request.url);
//         if (response) {
//           return response;     // if valid response is found in cache return it
//         } else {
//           return fetch(event.request)     //fetch from internet
//             .then(function(res) {
//               return caches.open([])
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());    //save the response for future
//                   return res;   // return the fetched data
//                 })
//             })
//             .catch(function(err) {       // fallback mechanism
//               return caches.open([])
//                 .then(function(cache) {
//                   return cache.match('/offline.html');
//                 });
//             });
//         }
//       })
//   );
// });

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll(precacheFiles);
  });
}

function fromCache(request) {
  //we pull files from the cache first thing so we can show them fast
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  //this is where we call the server to get the newest version of the
  //file to use the next time we show view
  return caches.open(CACHE).then(function (cache) {
    return fetch(request.clone()).then(function (response) {
      return cache.put(request, response);
    });
  });
}

function fromServer(request){
  //this is the fallback if it is not in the cache to go to the server and get it
  return fetch(request.clone()).then(function(response){ return response});
}
