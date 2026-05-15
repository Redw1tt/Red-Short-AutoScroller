chrome.storage.local.get(['enabled'], (result) => {
    if (result.enabled === false) return;

    console.log("REDW1TT SCROLLER : Monitoring activé...");

    setInterval(() => {
        const video = document.querySelector('video');
        
        if (video && !video.dataset.autoScrollReady) {
            video.dataset.autoScrollReady = "true";

            // Détection de fin
            video.ontimeupdate = function() {
                if (video.duration > 0) {
                    const reste = video.duration - video.currentTime;
                    // On scroll un peu plus tôt sur Insta (0.3s) car les transitions sont lentes
                    if (reste < 0.3) {
                        video.currentTime = 0; 
                        passerAuSuivant();
                    }
                }
            };
        }
    }, 1000);
});

function passerAuSuivant() {
    const isInstagram = window.location.hostname.includes('instagram.com');

    if (isInstagram) {
        // Logique Instagram : On cherche le bouton "Suivant" (Flèche du bas)
        // Instagram change souvent ses classes, le plus fiable est de simuler la touche "Flèche Bas"
        window.dispatchEvent(new KeyboardEvent('keydown', {
            bubbles: true,
            key: "ArrowDown",
            keyCode: 40
        }));
        console.log("Insta Reel suivant !");
    } else {
        // Logique YouTube
        const btnBas = document.querySelector('#navigation-button-down button');
        if (btnBas) btnBas.click();
        else window.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: "ArrowDown", keyCode: 40}));
        console.log("YouTube Short suivant !");
    }
}

// --- GESTION DES RACCOURCIS CLAVIER ---
document.addEventListener('keydown', (e) => {
    // On convertit en minuscule pour 'S' et on vérifie 'ArrowDown'
    const key = e.key.toLowerCase();
    
    if (key === 's' || key === 'arrowdown') {
        // On vérifie toujours si l'extension est activée avant d'agir
        chrome.storage.local.get(['enabled'], (result) => {
            if (result.enabled !== false) {
                console.log("REDW1TT_SCR : Skip manuel via " + e.key);
                passerAuSuivant();
                
                // Optionnel : On empêche le scroll natif si on veut que 
                // notre script garde la priorité absolue
                // e.preventDefault(); 
            }
        });
    }
});