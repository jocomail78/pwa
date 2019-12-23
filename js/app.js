if('serviceWorker' in navigator){
    console.log("Service worker support Active");
    navigator.serviceWorker.register('/pwa/sw.js')
        .then((reg) => console.log("Service worker registered", reg))
        .catch((err) => console.log("Service worker not registered", err))
}else{
    console.log("No Service worker support.");
}
