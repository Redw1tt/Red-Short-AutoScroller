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
    const url = window.location.href;

    if (url.includes("youtube.com")) {
        // Logique YouTube Shorts
        const boutonSuivantYT = document.querySelector('#navigation-button-down button, ytd-reel-video-renderer[is-active] #navigation-button-down');
        if (boutonSuivantYT) boutonSuivantYT.click();

    } else if (url.includes("instagram.com")) {
        // Logique Instagram Reels
        const boutonsIG = document.querySelectorAll('svg[aria-label="Flèche pointant vers le bas"], svg[aria-label="Down arrow"]');
        if (boutonsIG.length > 0) {
            const boutonSuivantIG = boutonsIG[0].closest('button');
            if (boutonSuivantIG) boutonSuivantIG.click();
        }
        
    } else if (url.includes("tiktok.com")) {
        console.log("REDW1TT_SCR : TikTok détecté - Simulation de touche...");
        
        // METHODE ULTIME : On crée un faux événement de touche clavier "Flèche Bas"
        const evenementTouche = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            keyCode: 40,
            code: 'ArrowDown',
            which: 40,
            bubbles: true,
            cancelable: true
        });

        // On balance cet événement directement sur le corps de la page (body)
        document.body.dispatchEvent(evenementTouche);
    }
}

// --- GESTION DES RACCOURCIS CLAVIER ---
document.addEventListener('keydown', (e) => {
    // SÉCURITÉ CRITIQUE : Si l'événement est généré par le script (pas "Trusted"),
    // on stoppe immédiatement pour éviter la boucle infinie sur TikTok !
    if (!e.isTrusted) return;

    const key = e.key.toLowerCase();
    
    if (key === 's' || key === 'arrowdown') {
        chrome.storage.local.get(['enabled'], (result) => {
            if (result.enabled !== false) {
                console.log("REDW1TT_SCR : Skip manuel via " + e.key);
                passerAuSuivant();
            }
        });
    }
});