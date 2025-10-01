document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');

    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameUrl = card.getAttribute('data-game-url');
            if (gameUrl) {
                window.location.href = gameUrl;
            } else {
                alert('This game is coming soon!');
            }
        });
    });

    const luckRatingElement = document.getElementById('luck-rating');

    if (luckRatingElement) {
        function updateLuckRating() {
            const random = Math.random();
            const sign = Math.random() < 0.5 ? -1 : 1;
            // Use a logarithmic scale for a wider range, and make extreme values rarer
            const luckValue = sign * Math.floor(Math.pow(10, random * 10));
            luckRatingElement.textContent = luckValue.toLocaleString();
        }

        setInterval(updateLuckRating, 2000);
        updateLuckRating(); // Initial update
    }
});