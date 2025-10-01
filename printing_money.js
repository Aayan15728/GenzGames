document.addEventListener('DOMContentLoaded', () => {
    // Game state variables
    let money = 0;
    let moneyPerSecond = 1; // Start with $1 per second
    let manualPrintAmount = 0; // Start with no manual printing
    let totalMoneyEarned = 0;
    let totalClicks = 0;
    let clickCombo = 0;
    let lastClickTime = 0;
    let manualPrintMultiplier = 0;
    let clickingUnlocked = false;

    // DOM Elements
    const moneyCounterEl = document.getElementById('money-counter');
    const mpsEl = document.getElementById('money-per-second');
    const upgradesListEl = document.getElementById('upgrades-list');
    const printerEl = document.getElementById('visual-printer');
    const printMoneyBtn = document.getElementById('print-money-btn');
    const achievementsListEl = document.getElementById('achievements-list');
    const bonusEventBanner = document.getElementById('bonus-event-banner');
    const progressBar = document.getElementById('progress-bar');
    const animatedCharacter = document.getElementById('animated-character');

    // Audio setup
    const printSound = new Audio('sounds/print.wav');
    const buySound = new Audio('sounds/buy.wav');

    // --- Utility Functions ---
    const formatCurrency = (num) => `$${num.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

    // --- Upgrades ---
    const initialUpgrades = () => [
        { name: 'Faster Printer', cost: 50, mps_increase: 5, purchased: 0, multiplier: 1.15, maxPurchases: 50, description: 'Increases printing speed', manual_bonus: 1 },
        { name: 'Better Ink', cost: 250, mps_increase: 20, purchased: 0, multiplier: 1.35, maxPurchases: 25, description: 'Higher quality money printing', manual_bonus: 2 },
        { name: 'Hire Employee', cost: 1000, mps_increase: 100, purchased: 0, multiplier: 1.45, maxPurchases: 15, description: 'Each employee prints more money', manual_bonus: 5 },
        { name: 'Buy a Factory', cost: 10000, mps_increase: 1200, purchased: 0, multiplier: 1.65, maxPurchases: 10, description: 'Industrial-scale printing', manual_bonus: 10 },
        { name: 'Automate Factory', cost: 100000, mps_increase: 15000, purchased: 0, multiplier: 1.85, maxPurchases: 5, description: 'Fully automated money production', manual_bonus: 25 },
        { name: 'Corporate Lobbying', cost: 1000000, mps_increase: 200000, purchased: 0, multiplier: 2, maxPurchases: 3, description: 'Influence money policies', manual_bonus: 50 },
        { name: 'Stock Investments', cost: 5000000, mps_increase: 1000000, purchased: 0, multiplier: 2.5, maxPurchases: 2, description: 'Generate passive income', manual_bonus: 100 },
        { name: 'Crypto Mining', cost: 25000000, mps_increase: 5000000, purchased: 0, multiplier: 3, maxPurchases: 1, description: 'Digital money printing', manual_bonus: 200 },
    ];
    let upgrades;

    const renderUpgrades = () => {
        upgradesListEl.innerHTML = '';
        upgrades.forEach((upgrade) => {
            const btn = document.createElement('button');
            btn.className = 'upgrade-btn';
            const purchaseInfo = upgrade.maxPurchases > 0 ? `(${upgrade.purchased}/${upgrade.maxPurchases})` : '';
            btn.innerHTML = `
                <strong>${upgrade.name} ${purchaseInfo}</strong><br>
                <span style="font-size: 0.8rem;">
                    Cost: ${formatCurrency(upgrade.cost)}<br>
                    +${formatCurrency(upgrade.mps_increase)}/s | +${formatCurrency(upgrade.manual_bonus)} per click<br>
                    ${upgrade.description}
                </span>`;
            btn.disabled = money < upgrade.cost || upgrade.purchased >= upgrade.maxPurchases;
            btn.onclick = () => buyUpgrade(upgrade);
            upgradesListEl.appendChild(btn);
        });
    };

    const buyUpgrade = (upgrade) => {
        if (money >= upgrade.cost && upgrade.purchased < upgrade.maxPurchases) {
            buySound.play();
            money -= upgrade.cost;
            moneyPerSecond += upgrade.mps_increase;
            
            // Unlock clicking system after first upgrade
            if (!clickingUnlocked && upgrade.purchased === 0) {
                clickingUnlocked = true;
                manualPrintAmount = 1;
                manualPrintMultiplier = 1;
                clickCombo = 1;
                printMoneyBtn.classList.add('unlocked');
                displayAchievement('Manual Printing Unlocked! You can now click to print money!');
            }
            
            manualPrintAmount += upgrade.manual_bonus;
            upgrade.cost = Math.ceil(upgrade.cost * upgrade.multiplier);
            upgrade.purchased++;
            checkAchievements();
            updateProgressBar();
        }
    };

    // --- Achievements ---
    const initialAchievements = () => [
        { name: 'First Upgrade', condition: () => upgrades.some(u => u.purchased > 0), unlocked: false },
        { name: '$1,000 Earned', condition: () => totalMoneyEarned >= 1000, unlocked: false },
        { name: '$1,000,000 Earned', condition: () => totalMoneyEarned >= 1000000, unlocked: false },
        { name: 'All Upgrades Purchased', condition: () => upgrades.every(u => u.purchased > 0), unlocked: false },
        { name: 'Speed Demon', condition: () => clickCombo >= 10, unlocked: false },
        { name: 'Money Printer Go Brrr', condition: () => moneyPerSecond >= 10000, unlocked: false },
        { name: 'Dedicated Clicker', condition: () => totalClicks >= 1000, unlocked: false },
        { name: 'Billionaire', condition: () => totalMoneyEarned >= 1000000000, unlocked: false },
    ];
    let achievements;

    const checkAchievements = () => {
        achievements.forEach(ach => {
            if (!ach.unlocked && ach.condition()) {
                ach.unlocked = true;
                displayAchievement(ach.name);
                celebrateMilestone();
                // Add bonus reward for achievements
                money += 1000; // Bonus money for unlocking achievement
                manualPrintMultiplier += 0.1; // Small permanent bonus to manual printing
            }
        });
    };

    const displayAchievement = (name) => {
        const achEl = document.createElement('div');
        achEl.className = 'achievement';
        achEl.textContent = `🎉 Achievement Unlocked: ${name}`;
        achievementsListEl.appendChild(achEl);
    };

    // --- Game Loop and Core Logic ---
    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = timestamp - (lastTime || timestamp);
        lastTime = timestamp;

        const moneyGained = (moneyPerSecond * deltaTime) / 1000;
        money += moneyGained;
        totalMoneyEarned += moneyGained;

        moneyCounterEl.textContent = formatCurrency(Math.floor(money));
        mpsEl.textContent = `per second: ${formatCurrency(moneyPerSecond)}`;

        if (Math.random() < Math.min(0.3, moneyPerSecond / 1000)) {
            createFallingBill();
        }

        renderUpgrades();
        checkAchievements();
        updateProgressBar();

        requestAnimationFrame(gameLoop);
    }

    const createFallingBill = () => {
        const bill = document.createElement('div');
        bill.textContent = '💵';
        bill.className = 'falling-bill';
        bill.style.left = `${Math.random() * 95}%`;
        printerEl.appendChild(bill);
        setTimeout(() => bill.remove(), 2000);
    };

    printMoneyBtn.addEventListener('click', () => {
        if (!clickingUnlocked) {
            return; // Do nothing if clicking isn't unlocked yet
        }

        const now = Date.now();
        const timeSinceLastClick = now - lastClickTime;

        if (timeSinceLastClick < 500) { // 0.5 second window for combos
            clickCombo = Math.min(clickCombo + 1, 10);
        } else {
            clickCombo = 1;
        }

        const comboBonus = 1 + (clickCombo * 0.1);
        const finalAmount = manualPrintAmount * manualPrintMultiplier * comboBonus;

        money += finalAmount;
        totalMoneyEarned += finalAmount;
        totalClicks++;
        lastClickTime = now;

        printSound.play();
        moneyCounterEl.style.transform = 'scale(1.1)';
        setTimeout(() => moneyCounterEl.style.transform = 'scale(1)', 100);

        for (let i = 0; i < Math.min(clickCombo, 5); i++) {
            setTimeout(() => createFallingBill(), i * 50);
        }

        if (clickCombo > 1) {
            showComboText(clickCombo, finalAmount);
        }

        checkAchievements();
        updateProgressBar();
    });

    const showComboText = (combo, amount) => {
        const comboText = document.createElement('div');
        comboText.className = 'combo-text';
        comboText.textContent = `${combo}x COMBO! +${formatCurrency(amount)}`;
        printerEl.appendChild(comboText);
        setTimeout(() => comboText.remove(), 1000);
    };

    // --- Bonus Events ---
    const startBonusEvent = () => {
        if (Math.random() > 0.3) return; // 30% chance of bonus event
        const eventType = Math.random() > 0.5 ? 'rain' : 'double';
        bonusEventBanner.style.animation = 'slideIn 0.5s ease';

        if (eventType === 'rain') {
            bonusEventBanner.textContent = '🌧️ Money Rain! +500% manual printing for 10s!';
            bonusEventBanner.style.display = 'block';
            const originalMultiplier = manualPrintMultiplier;
            manualPrintMultiplier *= 5;

            const rainInterval = setInterval(() => createFallingBill(), 100);

            setTimeout(() => {
                manualPrintMultiplier = originalMultiplier;
                bonusEventBanner.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => bonusEventBanner.style.display = 'none', 500);
                clearInterval(rainInterval);
            }, 10000);
        } else {
            bonusEventBanner.textContent = 'MPS Doubled for 15 seconds!';
            bonusEventBanner.style.display = 'block';
            const originalMPS = moneyPerSecond;
            moneyPerSecond *= 2;
            setTimeout(() => {
                moneyPerSecond = originalMPS;
                bonusEventBanner.style.display = 'none';
            }, 15000);
        }
    };

    // --- Extra Features ---
    const celebrateMilestone = () => {
        if (animatedCharacter) {
            animatedCharacter.style.transform = 'scale(1.2) rotate(15deg)';
            setTimeout(() => animatedCharacter.style.transform = 'scale(1) rotate(0deg)', 500);
        }
    };

    const updateProgressBar = () => {
        const nextUpgrade = upgrades.find(u => money < u.cost && u.purchased < u.maxPurchases);
        if (nextUpgrade) {
            const progress = Math.min(100, (money / nextUpgrade.cost) * 100);
            progressBar.style.width = `${progress}%`;
        }
    };

    // --- Save & Load ---
    const saveGame = () => {
        const gameState = {
            money,
            moneyPerSecond,
            totalMoneyEarned,
            totalClicks,
            manualPrintAmount,
            manualPrintMultiplier,
            upgrades: upgrades.map(u => ({
                name: u.name,
                cost: u.cost,
                purchased: u.purchased,
                mps_increase: u.mps_increase,
                manual_bonus: u.manual_bonus
            })),
            achievements: achievements.map(a => ({ name: a.name, unlocked: a.unlocked }))
        };
        localStorage.setItem('printingMoneySave', JSON.stringify(gameState));
    };

    const resetGame = () => {
        money = 0;
        moneyPerSecond = 1; // Start with $1 per second
        manualPrintAmount = 0; // Start with no manual printing
        totalMoneyEarned = 0;
        totalClicks = 0;
        clickCombo = 0;
        lastClickTime = 0;
        manualPrintMultiplier = 0;
        clickingUnlocked = false;
        upgrades = initialUpgrades();
        achievements = initialAchievements();
        // Clear any existing achievements display
        if (achievementsListEl) {
            achievementsListEl.innerHTML = '';
        }
    };

    const showInstructions = () => {
        const instructionsEl = document.createElement('div');
        instructionsEl.className = 'achievement';
        instructionsEl.innerHTML = `
            <strong>How to Play:</strong><br>
            - You start with $1 per second automatically<br>
            - Buy your first upgrade to unlock manual printing<br>
            - After unlocking, click for bonus money and combos<br>
            - Keep upgrading to earn more money automatically<br>
            - Unlock achievements for bonus rewards<br>
            - Watch for special bonus events!
        `;
        achievementsListEl.appendChild(instructionsEl);
    };

    // --- Initialization ---
    resetGame(); // Always start fresh
    showInstructions();
    requestAnimationFrame(gameLoop);
    setInterval(startBonusEvent, 60000); // Chance for a bonus event every minute
});