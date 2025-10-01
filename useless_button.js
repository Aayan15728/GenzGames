document.addEventListener('DOMContentLoaded', () => {
    const uselessButton = document.getElementById('useless-button');
    const clickCounter = document.getElementById('click-counter');

    let clickCount = 0;

    uselessButton.addEventListener('click', () => {
        // Haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }

        // Animation
        uselessButton.classList.add('clicked');
        setTimeout(() => {
            uselessButton.classList.remove('clicked');
        }, 200);

        clickCount++;
        clickCounter.textContent = `You have clicked the button ${clickCount} many times`;
    });
});