let currentStep = 1;
let buildingType = 'bureau';

function selectBuildingType(type) {
    buildingType = type;
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
}

function goToStep(step) {
    if (step === 3) {
        generateRoomCards();
    }

    // Hide all steps
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });

    // Show current step
    document.getElementById(`step${step}`).classList.add('active');

    // Update progress bar
    const progress = (step === 1) ? 33 : (step === 2) ? 66 : 100;
    document.getElementById('progressBar').style.width = `${progress}%`;

    // Update labels
    document.querySelectorAll('.step-label').forEach((label, index) => {
        if (index + 1 <= step) {
            label.classList.add('active');
        } else {
            label.classList.remove('active');
        }
    });

    currentStep = step;
    window.scrollTo(0,0);
}

function generateRoomCards() {
    const floors = parseInt(document.getElementById('floors').value) || 1;
    const roomsPerFloor = parseInt(document.getElementById('roomsPerFloor').value) || 1;
    const container = document.getElementById('roomSetupList');
    
    container.innerHTML = '';
    
    // Limit generation to avoid UI freeze if huge numbers are entered
    const totalRooms = Math.min(floors * roomsPerFloor, 20);
    
    for (let i = 1; i <= totalRooms; i++) {
        const roomCard = document.createElement('div');
        roomCard.className = 'room-card';
        
        const floorNum = Math.ceil(i / roomsPerFloor);
        const roomNum = (i % roomsPerFloor) || roomsPerFloor;
        
        roomCard.innerHTML = `
            <div class="room-header">
                <span class="room-title">Pièce ${roomNum} - Étage ${floorNum}</span>
                <i data-lucide="info" style="width: 16px; color: var(--text-muted); cursor: pointer"></i>
            </div>
            <div class="equip-grid">
                <div class="equip-tag selected" onclick="toggleEquip(this)">Carbon Air</div>
                <div class="equip-tag" onclick="toggleEquip(this)">Feel Plus</div>
                <div class="equip-tag selected" onclick="toggleEquip(this)">Thermostat</div>
                <div class="equip-tag" onclick="toggleEquip(this)">Détecteur Mouvement</div>
            </div>
        `;
        container.appendChild(roomCard);
    }
    
    if (floors * roomsPerFloor > 20) {
        const note = document.createElement('p');
        note.style.fontSize = '12px';
        note.style.color = 'var(--text-muted)';
        note.style.marginTop = '10px';
        note.innerText = `Affichage limité aux 20 premières pièces sur ${floors * roomsPerFloor}.`;
        container.appendChild(note);
    }
    
    lucide.createIcons();
}

function toggleEquip(el) {
    el.classList.toggle('selected');
}

function finishOnboarding() {
    alert("Configuration terminée ! Redirection vers votre tableau de bord...");
    window.location.href = 'index.html';
}
