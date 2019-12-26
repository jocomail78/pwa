const staticCacheName = 'site-static-v2';
const assets = [
    '/',
    '/index.html',

    '/pwa/',
    '/pwa/index.html',

    '/favicon.ico',
    '/pwa/favicon.ico',
    '/pwa/manifest.json',

    '/pwa/js/ui.js',
    '/pwa/js/app.js',

    '/pwa/css/styles.css',
    '/pwa/img/icons/144.png',

    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
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
    //Deleting the old cache here.
    evt.waitUntil(
        //requires one single promise to return
        caches.keys().then( keys => {
            //keys will return an array of keys from Application/Cache Storage
            //We have to cycle through all the keys
            //and group them as a single promise
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    )
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

