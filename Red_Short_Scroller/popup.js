document.addEventListener('DOMContentLoaded', () => {
    const check = document.getElementById('toggleCheck');
    const status = document.getElementById('status');

    // 1. Charger l'état enregistré
    chrome.storage.local.get(['enabled'], (result) => {
        let isEnabled = result.enabled !== false;
        check.checked = isEnabled;
        updateLabel(isEnabled);
    });

    // 2. Écouter le changement du switch
    check.onchange = () => {
        let isEnabled = check.checked;
        chrome.storage.local.set({ enabled: isEnabled }, () => {
            updateLabel(isEnabled);
            
            // Rafraîchir YouTube pour appliquer
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0] && tabs[0].url.includes("youtube.com/shorts")) {
                    chrome.tabs.reload(tabs[0].id);
                }
            });
        });
    };

    // 3. Mettre à jour le texte sous le switch
    function updateLabel(isEnabled) {
        status.textContent = isEnabled ? "SYSTÈME ACTIF" : "SYSTÈME À L'ARRÊT";
        status.style.color = isEnabled ? "#deff9a" : "#94a3b8";
    }
});