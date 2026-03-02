// Logique du Tableau de Bord Nexelec - Spécial Lycée

const brandPrimary = '#d6dfd5'; /* User requested Sage Green */
const brandSecondary = '#3b82f6';
const brandWarning = '#f59e0b';
const textMuted = '#9a9fa5';
const textPrimary = '#1a1d1f';

// 1. Graphique de Gains Mensuels (Bar Chart) - Realiste pour un Lycée
const monthlyChartCanvas = document.getElementById('monthlyChart');
let monthlyChart;

if (monthlyChartCanvas) {
    const ctxMonthly = monthlyChartCanvas.getContext('2d');

    const gradientBarActive = ctxMonthly.createLinearGradient(0, 0, 0, 400);
    gradientBarActive.addColorStop(0, '#8b5cf6');
    gradientBarActive.addColorStop(1, '#a78bfa'); /* Light mauve gradient */

    monthlyChart = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
            labels: ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'],
            datasets: [{
                label: 'Économies Réalisées',
                // Valeurs raccord avec un gain annuel de ~28k€ (pic en hiver pour le chauffage)
                data: [1.2, 2.8, 3.9, 4.5, 3.4, 3.8, 3.2, 1.8, 1.2, 0.8, 0.4, 1.6],
                backgroundColor: (context) => {
                    const index = context.dataIndex;
                    return index === 4 ? gradientBarActive : '#ede9fe'; // Mauve clair pour les autres barres
                },

                borderRadius: 8,
                borderSkipped: false,
                barThickness: 24,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1d1f',
                    padding: 12,
                    borderRadius: 8,
                    callbacks: {
                        label: function (context) {
                            return 'Gain : ' + (context.raw * 1000).toLocaleString('fr-FR') + ' €';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0', drawBorder: false },
                    ticks: {
                        color: '#6f767e',
                        font: { size: 11 },
                        callback: value => value + 'k€'
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#6f767e', font: { size: 11, weight: '600' } }
                }
            }
        }
    });
}

// 2. Basculement Hebdo / Mensuel
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelector('.tab.active').classList.remove('active');
        this.classList.add('active');

        if (!monthlyChart) return;

        const view = this.getAttribute('data-view');

        if (view === 'weekly') {
            monthlyChart.data.labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
            monthlyChart.data.datasets[0].data = [120, 115, 140, 130, 125, 45, 40].map(v => v / 1000); // Gains journaliers en k€
            monthlyChart.data.datasets[0].label = 'Gains quotidiens';
        } else {
            monthlyChart.data.labels = ['Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août'];
            monthlyChart.data.datasets[0].data = [1.2, 2.8, 3.9, 4.5, 3.4, 3.8, 3.2, 1.8, 1.2, 0.8, 0.4, 1.6];
            monthlyChart.data.datasets[0].label = 'Économies Mensuelles';
        }
        monthlyChart.update();
    });
});

// Interaction bouton Optimiser
document.querySelector('.btn-primary')?.addEventListener('click', function () {
    this.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Audit en cours...';
    lucide.createIcons();
    this.disabled = true;

    setTimeout(() => {
        this.innerHTML = '<i data-lucide="check"></i> Équilibrage fait';
        this.style.background = '#8FA392'; /* Darker version of #d6dfd5 for readable white text */
        this.style.color = '#fff';
        lucide.createIcons();

        const savingsValue = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (savingsValue) {
            savingsValue.innerText = '3 438 €';
            savingsValue.classList.add('pulse');
            setTimeout(() => savingsValue.classList.remove('pulse'), 1000);
        }
    }, 1800);
});

// Styles additionnels injectés pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse-green {
        0% { transform: scale(1); color: var(--brand-primary); }
        50% { transform: scale(1.05); color: #8FA392; }
        100% { transform: scale(1); color: var(--brand-primary); }
    }
    .pulse { animation: pulse-green 0.5s ease-in-out; }
    .animate-spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);

// Gestion de la Sidebar (Collapse)
const sidebar = document.querySelector('.sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const logoIcon = document.querySelector('.logo-icon');

toggleBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');

    // Toggle icon logic specifically
    if (sidebar.classList.contains('collapsed')) {
        toggleBtn.innerHTML = '<i data-lucide="chevron-right"></i>';
    } else {
        toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
    }
    lucide.createIcons();
});

// Gestion de l'IA Chat Sidebar
const chatSidebar = document.getElementById('aiChatSidebar');
const chatToggleBtn = document.getElementById('chatToggle');
const closeChatBtn = document.getElementById('closeChat');
const chatMessages = document.getElementById('chatMessages');
const chatSuggestions = document.getElementById('chatSuggestions');

// Toggle Chat
chatToggleBtn?.addEventListener('click', () => {
    chatSidebar.classList.remove('hidden'); // Ensure it's not hidden
    // Use setTimeout to allow render before transition
    setTimeout(() => chatSidebar.classList.add('active'), 10);
});

closeChatBtn?.addEventListener('click', () => {
    chatSidebar.classList.remove('active');
    setTimeout(() => chatSidebar.classList.add('hidden'), 300); // Wait for transition
});

// Demo Scenario Logic
const scenarios = {
    start: {
        text: `Bonjour, voici les recommandations de la journée :
        <div class="briefing-card" style="margin-top: 12px;">
            <div class="briefing-header"><i data-lucide="zap"></i> Recommandations</div>
            <div class="briefing-item">
                <div class="item-icon"><i data-lucide="droplets"></i></div>
                <div class="item-text">
                    <strong>Rez-de-chaussée</strong>
                    Le taux d'humidité est monté à 70% suite aux pluies. Je recommande d'augmenter le chauffage de 1°C pour assécher l'air.
                    <div class="item-action">
                        <button class="btn-inline-validate" onclick="handleHumidityValidation(event)">Valider</button>
                    </div>
                </div>
            </div>
            <div class="briefing-item">
                <div class="item-icon"><i data-lucide="wind"></i></div>
                <div class="item-text"><strong>Salle 104</strong> Le taux de CO2 a atteint 1200 ppm. Je recommande d'aérer la pièce.</div>
            </div>
            <div class="briefing-item">
                <div class="item-icon"><i data-lucide="battery-low"></i></div>
                <div class="item-text"><strong>Cantine</strong> Le capteur ne répond plus (Pile faible 10%). À prévoir lors de la prochaine maintenance.</div>
            </div>
        </div>`,
        suggestions: []
    },
    anomaly_detected: {
        text: `
        <div class="anomaly-card">
            <div class="anomaly-title"><i data-lucide="alert-triangle"></i> Anomalie détectée : +28% au Gymnase</div>
            <div class="anomaly-details">
                <strong>Cause identifiée :</strong> Dérogation manuelle active (22°C).
            </div>
            <div class="anomaly-context">
                Comparé à la moyenne des mardis (22h-06h). Il semble que le chauffage n'ait pas basculé en mode 'Nuit'.
            </div>
            <div class="anomaly-actions">
                <button class="btn-chat-primary" onclick="handleAnomalyAction('reset')">Rétablir le planning (19°C)</button>
                <button class="btn-chat-secondary" onclick="handleAnomalyAction('maintain')">Maintenir jusqu'à 12h</button>
            </div>
        </div>`,
        suggestions: []
    },
    fix_anomaly: {
        text: "J'applique la correction de l'horaire sur les unités CVC du Gymnase...",
        action: () => {
            // Simulate processing
            return new Promise(resolve => setTimeout(resolve, 1500));
        },
        followUp: "✅ Correction appliquée avec succès. Économie estimée : **120 € / mois**.",
        suggestions: [
            { text: "Générer un rapport d'incident", next: "generate_report" },
            { text: "Retour au menu", next: "start" }
        ]
    },
    generate_report: {
        text: "Le rapport d'incident a été généré et envoyé au responsable technique.",
        suggestions: [
            { text: "Merci !", next: "start" }
        ]
    },
    report_flow: {
        text: "Je peux générer les rapports suivants :",
        suggestions: [
            { text: "Rapport Mensuel (Janvier)", next: "monthly_report" },
            { text: "Audit Énergétique (ELAN)", next: "elan_audit" }
        ]
    },
    monthly_report: {
        text: "Le rapport mensuel de Janvier 2026 est prêt. Votre performance énergétique est en hausse de 18% par rapport à l'année dernière.",
        suggestions: [
            { text: "Retour", next: "start" }
        ]
    }
};

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user' : 'bot'}`;

    // Simple markdown-style bolding support
    let formattedText = typeof text === 'string' ? text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : text;

    msgDiv.innerHTML = `<div class="message-content">${formattedText}</div>`;
    chatMessages.appendChild(msgDiv);

    // Create icons for any new lucide icons in the message
    lucide.createIcons();

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Global actions for anomaly buttons
window.handleAnomalyAction = (action) => {
    if (action === 'reset') {
        handleScenario({ text: "Rétablir le planning (19°C)", next: "fix_anomaly" });
    } else {
        addMessage("D'accord, je maintiens la température actuelle au Gymnase jusqu'à midi.", false);
        chatSuggestions.innerHTML = '';
        setTimeout(() => updateSuggestions(scenarios.start.suggestions), 1000);
    }
};

window.handleHumidityValidation = (event) => {
    if (event) event.stopPropagation();
    addMessage("✅ Demande validée. J'augmente le chauffage de 1°C au rez-de-chaussée pour optimiser l'hygrométrie.", false);
};

async function simulateThought(message = "Analyse de la météo et des occupations en cours...") {
    const thoughtDiv = document.createElement('div');
    thoughtDiv.className = 'thought-process';
    thoughtDiv.innerHTML = `<div class="spinner"></div><span>${message}</span>`;
    chatMessages.appendChild(thoughtDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    await new Promise(resolve => setTimeout(resolve, 2000));
    thoughtDiv.remove();
}

function updateSuggestions(suggestionList) {
    chatSuggestions.innerHTML = '';
    suggestionList.forEach(sug => {
        const btn = document.createElement('button');
        btn.className = 'suggestion-chip';
        btn.textContent = sug.text;
        btn.onclick = () => handleScenario(sug);
        chatSuggestions.appendChild(btn);
    });
}

function handleScenario(suggestion) {
    // 1. User message
    addMessage(suggestion.text, true);
    chatSuggestions.innerHTML = ''; // Clear suggestions while processing

    // 2. Load next step
    const nextStep = scenarios[suggestion.next];
    if (!nextStep) return;

    // Simulate typing delay
    setTimeout(async () => {
        // Special logic for "Analyse des anomalies" or search-like actions
        if (suggestion.next === 'anomaly_detected') {
            await simulateThought("Analyse de la météo et des occupations en cours...");
        }

        // Handle actions if any
        if (nextStep.action) {
            addMessage("Traitement en cours...", false); // Loading message
            await nextStep.action();
            if (nextStep.followUp) {
                addMessage(nextStep.followUp, false);
            }
        } else {
            addMessage(nextStep.text, false);
            if (nextStep.context) {
                setTimeout(() => addMessage(nextStep.context, false), 800);
            }
        }

        // 3. Show new suggestions
        if (nextStep.suggestions) {
            updateSuggestions(nextStep.suggestions);
        }
    }, 1000);
}

// Init suggestions and show greeting with "thought"
(async () => {
    // Show thought process for initial load
    await simulateThought("Initialisation d'Eco-Pilot IA...");
    addMessage(scenarios.start.text, false);
    updateSuggestions(scenarios.start.suggestions);
})();

