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
});
