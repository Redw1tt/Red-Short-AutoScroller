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
        // L'ANALYSE DU CODE POUR TIKTOK :
        // Sur TikTok Web, les boutons de navigation ont des attributs de données "data-e2e"
        const boutonSuivantTT = document.querySelector('[data-e2e="arrow-down"]');
        
        if (boutonSuivantTT) {
            console.log("REDW1TT_SCR : Bouton TikTok trouvé, clic simulé.");
            boutonSuivantTT.click();
        } else {
            // Alternative : Si le bouton n'est pas trouvé, on simule un scroll physique de la page
            console.log("REDW1TT_SCR : Bouton introuvable, simulation de scroll.");
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
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