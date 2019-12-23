//install event
self.addEventListener('install',(evt) => {
    console.log('service worker has been installed');
    //Adding assets to the cache so they are available in offline mode.
});

//activate event
self.addEventListener('activate',(evt) => {
    console.log('service worker has been activated');
    //Also some cache management
});

