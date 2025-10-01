document.addEventListener('DOMContentLoaded', () => {
    const coin = document.getElementById('coin');
    const flipButton = document.getElementById('flip-button');
    const resetButton = document.getElementById('reset-button');
    const resultDisplay = document.getElementById('result');
    const totalFlipsDisplay = document.getElementById('total-flips');
    const headsCountDisplay = document.getElementById('heads-count');
    const tailsCountDisplay = document.getElementById('tails-count');

    let totalFlips = 0;
    let headsCount = 0;
    let tailsCount = 0;
    let isFlipping = false;
    let rotations = 0;

    flipButton.addEventListener('click', () => {
        if (isFlipping) return;
        isFlipping = true;
        flipButton.disabled = true;

        // Clear previous animation
        coin.style.animation = 'none';
        coin.offsetHeight; // Force reflow
        
        // Determine result
        const isHeads = Math.random() < 0.5;
        const flipCount = 5 + Math.floor(Math.random() * 5); // 5-10 flips
        const totalRotation = flipCount * 360 + (isHeads ? 0 : 180);
        
        // Set final rotation for CSS animation
        coin.style.setProperty('--final-rotation', `${totalRotation}deg`);
        coin.classList.add('flipping');

        // Haptic feedback pattern
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }

        // Play sound
        const flipSound = document.getElementById('flip-sound');
        flipSound.currentTime = 0;
        flipSound.play();

        // Wait for animation to finish
        setTimeout(() => {
            if (isHeads) {
                resultDisplay.innerHTML = '🌟 <span style="color: #feca57">HEADS!</span> 🌟';
                headsCount++;
            } else {
                resultDisplay.innerHTML = '🌙 <span style="color: #ff6b6b">TAILS!</span> 🌙';
                tailsCount++;
            }
            resultDisplay.classList.add('show');

            totalFlips++;
            updateScoreboard();
            
            coin.classList.remove('flipping');
            isFlipping = false;
            flipButton.disabled = false;
        }, 1000);
    });

    resetButton.addEventListener('click', () => {
        totalFlips = 0;
        headsCount = 0;
        tailsCount = 0;
        updateScoreboard();
        resultDisplay.textContent = '';
        resultDisplay.classList.remove('show');
        coin.className = 'coin';
        coin.style.transform = 'rotateY(0deg)';
    });

    function updateScoreboard() {
        totalFlipsDisplay.textContent = totalFlips;
        headsCountDisplay.textContent = headsCount;
        tailsCountDisplay.textContent = tailsCount;
        
        // Add animation to the scoreboard
        const scoreboard = document.querySelector('.scoreboard');
        scoreboard.style.animation = 'none';
        scoreboard.offsetHeight;
        scoreboard.style.animation = 'pulse 0.3s ease-out';
    }
});