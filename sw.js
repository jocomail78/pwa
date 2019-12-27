const staticCacheName = 'site-static-v4'; // app shell assets
const dynamicCacheName = 'site-dynamic-v1'; // page dynamic caches
const dynamicCacheSize = 2;
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

    '/pwa/pages/fallback.html'
];
//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size){
                //Delete the first item and call recursively the same function
                //so it deletes over and over until it will be under the limit
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    });
};


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
                .filter(key => (key !== staticCacheName && key!== dynamicCacheName))
                .map(key => caches.delete(key))
            )
        })
    )
});

//fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            //if cacheRes is not empty: return cacheRes
            //otherwise return fetch(evt.request);
            return cacheRes || fetch(evt.request).then(fetchResponse => {
                //dynamic caching every page, if there are multiple pages.

                return caches.open(dynamicCacheName).then(cache => {
                    //saving the request/response in cache
                    console.log("Saving ",evt.request.url);
                    cache.put(evt.request.url, fetchResponse.clone());
                    limitCacheSize(dynamicCacheName, dynamicCacheSize);
                    return fetchResponse;
                })
            });
        }).catch((error) =>{
            //if user requested some kind of page
            if(evt.request.url.indexOf('.html') !== -1){
                return caches.match('/pwa/pages/fallback.html');
            }
            //conditioning for .css or .jpg/.png in the same way
        })
    )

});

