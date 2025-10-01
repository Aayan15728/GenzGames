document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const passwordInput = document.getElementById('password-input');
    const pillarsChecklist = document.getElementById('pillars-checklist');
    const dynamicInfoContainer = document.getElementById('dynamic-info-container');
    const timerDisplay = document.getElementById('timer');
    const completionScreen = document.getElementById('completion-screen');
    const finalTimeDisplay = document.getElementById('final-time');
    const restartBtn = document.getElementById('restart-btn');

    // --- MOCK & STATIC DATA ---
    const MOCK_OLDEST_USER = { name: 'John', year: 1971 };
    const INERT_GASES = ['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'];
    const COUNTRY_LIST = { A:['Argentina'], B:['Brazil'], C:['Canada','Chile','China','Colombia'], D:['Denmark'], E:['Egypt'], F:['Finland','France'], G:['Germany','Greece'], H:['Hungary'], I:['Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy'], J:['Jamaica','Japan'], K:['Kenya'], L:['Luxembourg'], M:['Mexico','Monaco'], N:['Netherlands','Nigeria','Norway'], O:['Oman'], P:['Peru','Poland','Portugal'], Q:['Qatar'], R:['Romania','Russia'], S:['Senegal','Singapore','Spain','Sweden','Switzerland'], T:['Thailand','Turkey'], U:['Uganda','Ukraine','United Kingdom','United States','Uruguay'], V:['Venezuela','Vietnam'], W:[], X:[], Y:['Yemen'], Z:['Zambia','Zimbabwe'] };

    // --- GAME STATE ---
    let gameState;
    let pillarElements = [];

    // --- PILLAR DEFINITIONS ---
    const definePillars = () => [
        { id: 1, text: 'Your password must be at least 10 characters long.', status: 'fail', check: () => gameState.password.length >= 10 },
        { id: 2, text: 'Your password must contain an uppercase letter.', status: 'fail', check: () => /[A-Z]/.test(gameState.password) },
        { id: 3, text: 'Your password must contain a number.', status: 'fail', check: () => /[0-9]/.test(gameState.password) },
        { id: 4, text: 'Your password must contain a special character.', status: 'fail', check: () => /[^a-zA-Z0-9]/.test(gameState.password) },
        { id: 5, text: 'The digits in your password must sum to 25.', status: 'fail', check: () => (gameState.password.match(/\d/g) || []).reduce((sum, digit) => sum + parseInt(digit), 0) === 25 },
        { id: 6, text: 'Your password must contain a two-digit prime number.', status: 'fail', check: () => /11|13|17|19|23|29|31|37|41|43|47|53|59|61|67|71|73|79|83|89|97/.test(gameState.password) },
        { id: 7, text: 'Your password must contain a Roman numeral that evaluates to 49.', status: 'fail', check: () => gameState.password.includes('XLIX') },
        { id: 8, text: 'Your password must contain one of the following capital letters: A, B, or C.', status: 'fail', check: () => /[ABC]/.test(gameState.password) },
        { id: 9, text: () => `Your password must contain the current phase of the moon: ${getMoonPhase()}`, status: 'fail', check: () => gameState.password.includes(getMoonPhase()) },
        { id: 10, text: 'The last character of your password must be a letter.', status: 'fail', check: () => /[a-zA-Z]$/.test(gameState.password) },
        { id: 11, text: () => `Your password must include the two-letter abbreviation of the state where it is currently midnight: ${getMidnightState()}`, status: 'fail', check: () => gameState.password.includes(getMidnightState()) },
        { id: 12, text: 'Your password must contain the chemical symbol of an inert gas.', status: 'fail', check: () => INERT_GASES.some(gas => gameState.password.includes(gas)) },
        { id: 13, text: () => `Your password must contain the name of the oldest active user: ${MOCK_OLDEST_USER.name}`, status: 'fail', check: () => gameState.password.includes(MOCK_OLDEST_USER.name) },
        { id: 14, text: 'Your password must contain a number greater than 100, and it must contain P, where P is the total count of prime factors of 60 (which is 4).', status: 'fail', check: () => (gameState.password.match(/\d+/g) || []).some(n => parseInt(n) > 100) && gameState.password.includes('4') },
        { id: 15, text: 'Your password must contain a color name.', status: 'fail', check: () => /Red|Blue|Green|Yellow|Orange|Purple|Black|White/i.test(gameState.password) },
        { id: 16, text: 'Your password must contain an emoji representing a piece of food.', status: 'fail', check: () => /[🍎🍕🍔🌮🍣]/.test(gameState.password) },
        { id: 17, text: () => `Your password must contain the result of (Length * 2) - (Special Chars), which is currently ${gameState.password.length * 2 - (gameState.password.match(/[^a-zA-Z0-9]/g) || []).length}.`, status: 'fail', check: () => {
            const requiredValue = gameState.password.length * 2 - (gameState.password.match(/[^a-zA-Z0-9]/g) || []).length;
            return gameState.password.includes(requiredValue.toString());
        }},
        { id: 18, text: 'If the password contains \'E\', it must also contain \'O\', and vice-versa.', status: 'fail', check: () => {
            const hasE = /e/i.test(gameState.password);
            const hasO = /o/i.test(gameState.password);
            return (hasE && hasO) || (!hasE && !hasO);
        }},
        { id: 19, text: () => `Your password must include an ASCII loading bar for your progress: ${getAsciiLoadingBar()}`, status: 'fail', check: () => gameState.password.includes(getAsciiLoadingBar()) },
        { id: 20, text: 'Your password must contain a country name that begins with the first letter of your password.', status: 'fail', check: () => {
            if (gameState.password.length === 0) return false;
            const firstLetter = gameState.password[0].toUpperCase();
            const countries = COUNTRY_LIST[firstLetter] || [];
            return countries.some(country => gameState.password.toLowerCase().includes(country.toLowerCase()));
        }},
        { id: 21, text: 'The number of vowels in your password must be the cube root of 27 (which is 3).', status: 'fail', check: () => (gameState.password.match(/[aeiou]/ig) || []).length === 3 },
        { id: 22, text: 'Your password must include the Unicode hexadecimal code for the letter \'Z\'.', status: 'fail', check: () => gameState.password.includes('\\u005A') },
        { id: 23, text: 'Your password must contain an image URL placeholder for a 50x50 white square.', status: 'fail', check: () => gameState.password.includes('https://placehold.co/50x50/ffffff/ffffff?text=+') },
        { id: 24, text: 'Your password must contain the word \'END\' exactly once.', status: 'fail', check: () => gameState.password.includes('END') && gameState.password.indexOf('END') === gameState.password.lastIndexOf('END') },
        { id: 25, text: 'Your password must contain a self-correction phrase that invalidates Pillar I.', status: 'fail', check: () => gameState.password.includes('I disagree with Pillar I.') },
    ];

    // --- HELPER & DYNAMIC DATA FUNCTIONS ---
    const getMoonPhase = () => ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'][Math.floor(new Date().getDate() / 4)];
    const getMidnightState = () => ['HI', 'AK', 'CA', 'AZ', 'IL', 'NY'][new Date().getMinutes() % 6];
    const getAsciiLoadingBar = () => {
        const passedCount = gameState.pillars.slice(0, gameState.activePillarCount).filter(p => p.status === 'pass').length;
        const total = gameState.activePillarCount;
        const barWidth = 10;
        const filled = total > 0 ? Math.round((passedCount / total) * barWidth) : 0;
        const empty = barWidth - filled;
        return `[${'#'.repeat(filled)}${'-'.repeat(empty)}]`;
    };

    // --- GAME LOGIC ---
    function validatePillars() {
        if (gameState.gameCompleted) return;

        let lastPassedPillarIndex = -1;
        let pillarStatusChanged = false;

        for (let i = 0; i < gameState.activePillarCount; i++) {
            const pillar = gameState.pillars[i];
            const oldStatus = pillar.status;
            let isPassed = false;

            if (pillar.id === 1 && gameState.pillars[24].check()) {
                isPassed = true;
            } else {
                isPassed = pillar.check();
            }
            
            pillar.status = isPassed ? 'pass' : 'fail';

            if (pillar.status !== oldStatus) {
                pillarStatusChanged = true;
                const pillarElement = pillarElements[i];
                pillarElement.className = `pillar ${pillar.status}`;
                if (pillar.status === 'fail' && oldStatus === 'pass') {
                    pillarElement.classList.add('just-failed');
                    pillarElement.addEventListener('animationend', () => pillarElement.classList.remove('just-failed'), { once: true });
                }
            }

            if (isPassed) lastPassedPillarIndex = i;
        }

        if (lastPassedPillarIndex === gameState.activePillarCount - 1 && gameState.activePillarCount < gameState.pillars.length) {
            gameState.activePillarCount++;
            pillarElements[gameState.activePillarCount - 1].classList.remove('hidden');
            pillarElements[gameState.activePillarCount - 1].classList.add('newly-active');
            pillarStatusChanged = true;
        }

        if (pillarStatusChanged) {
            renderDynamicContent();
        }

        if (gameState.pillars.every(p => p.status === 'pass')) {
            endGame();
        }
    }

    function startGame() {
        gameState = {
            password: '',
            startTime: new Date(),
            timerInterval: null,
            pillars: definePillars(),
            activePillarCount: 1,
            gameCompleted: false
        };
        passwordInput.value = '';
        passwordInput.disabled = false;
        completionScreen.classList.add('hidden');
        
        preparePillarsDOM();
        gameState.timerInterval = setInterval(updateTimer, 1000);
        validatePillars();
        renderDynamicContent();
    }

    function endGame() {
        gameState.gameCompleted = true;
        clearInterval(gameState.timerInterval);
        passwordInput.disabled = true;
        pillarsChecklist.style.display = 'none';
        dynamicInfoContainer.style.display = 'none';
        completionScreen.classList.remove('hidden');
        finalTimeDisplay.textContent = timerDisplay.textContent;
    }

    // --- RENDERING & UI UPDATES ---
    function preparePillarsDOM() {
        pillarsChecklist.innerHTML = '';
        pillarElements = [];
        gameState.pillars.forEach((pillar, index) => {
            const li = document.createElement('li');
            li.className = 'pillar hidden';
            pillarElements.push(li);
            pillarsChecklist.appendChild(li);
        });
        pillarElements[0].classList.remove('hidden');
        pillarElements[0].classList.add('newly-active');
        pillarsChecklist.style.display = 'block';
        dynamicInfoContainer.style.display = 'flex';
    }

    function renderDynamicContent() {
        // Update dynamic info boxes
        dynamicInfoContainer.innerHTML = `
            <div class="info-box"><span class="label">Moon Phase</span> ${getMoonPhase()}</div>
            <div class="info-box"><span class="label">Midnight State</span> ${getMidnightState()}</div>
            <div class="info-box"><span class="label">Oldest User</span> ${MOCK_OLDEST_USER.name}</div>
            <div class="info-box"><span class="label">Progress</span> [${gameState.pillars.filter(p=>p.status === 'pass').length}/25]</div>
        `;

        // Update pillar text for dynamic pillars
        for (let i = 0; i < gameState.activePillarCount; i++) {
            const pillar = gameState.pillars[i];
            if (typeof pillar.text === 'function') {
                const text = pillar.text();
                pillarElements[i].innerHTML = `<strong>Pillar ${pillar.id}:</strong> ${text}`;
            } else {
                 pillarElements[i].innerHTML = `<strong>Pillar ${pillar.id}:</strong> ${pillar.text}`;
            }
        }
    }

    function updateTimer() {
        if (gameState.gameCompleted) return;
        const now = new Date();
        const elapsed = Math.floor((now - gameState.startTime) / 1000);
        const hours = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const seconds = String(elapsed % 60).padStart(2, '0');
        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }

    // --- EVENT LISTENERS ---
    passwordInput.addEventListener('input', (e) => {
        gameState.password = e.target.value;
        validatePillars();
    });

    restartBtn.addEventListener('click', startGame);

    // --- INITIALIZE ---
    startGame();
});