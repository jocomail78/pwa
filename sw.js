const staticCacheName = 'site-static';
const assets = [
    '/',
    '/index.html',
    '/pwa/',
    '/pwa/index.html',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    '/pwa/js/app.js',
    '/pwa/js/ui.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
    '/pwa/css/styles.css',
    '/pwa/favicon.ico',
    '/favicon.ico',
    '/pwa/manifest.json',
    '/pwa/img/icons/144.png',
];

//install event
self.addEventListener('install',(evt) => {
    //console.log('service worker has been installed');
    //Adding assets to the cache so they are available in offline mode.
    evt.waitUntil(
        caches.open(staticCacheName).then(
            cache => {
                console.log('caching shell assets');
                //cache.add();//add one resource

                assets.forEach(function(item,index){
                    cache.add(item);
                    console.log(item+' added to cache');
                });

                //cache.addAll(assets);
                // add all the resources at once. It should work out of the box, but it isn't

                console.log("Assets added");
            }
        )
    );

});

//activate event
self.addEventListener('activate',(evt) => {
    console.log('service worker has been activated');
    //Also some cache management
});

//fetch event
self.addEventListener('fetch', evt => {
    //console.log('Fetch event ', evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            //if cacheRes is not empty: return cacheRes
            //otherwise return fetch(evt.request);

            return cacheRes || fetch(evt.request);
        })
    )

});

