document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const currentScoreElem = document.getElementById('current-score');
    const bestScoreElem = document.getElementById('best-score');
    const gameOverScreen = document.getElementById('game-over-screen');
    const restartButton = document.getElementById('restart-button');
    const restartButtonGameOver = document.getElementById('restart-button-game-over');

    const GRID_SIZE = 4;
    let board = [];
    let currentScore = 0;
    let bestScore = localStorage.getItem('bestScore_8192') || 0;

    // Initialize Game
    function initGame() {
        board = Array(GRID_SIZE * GRID_SIZE).fill(0);
        currentScore = 0;
        updateScore(0);
        bestScoreElem.textContent = bestScore;
        gameOverScreen.classList.add('hidden');
        spawnTile();
        spawnTile();
        renderBoard();
    }

    // Render the game board
    function renderBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < board.length; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            const value = board[i];
            if (value > 0) {
                tile.textContent = value;
                tile.dataset.value = value;
            }
            gameBoard.appendChild(tile);
        }
    }

    // Spawn a new tile (2 or 4)
    function spawnTile() {
        const emptyTiles = board.map((val, index) => val === 0 ? index : -1).filter(index => index !== -1);
        if (emptyTiles.length > 0) {
            const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    // Update score
    function updateScore(value) {
        currentScore += value;
        currentScoreElem.textContent = currentScore;
        if (currentScore > bestScore) {
            bestScore = currentScore;
            bestScoreElem.textContent = bestScore;
            localStorage.setItem('bestScore_8192', bestScore);
        }
    }

    // Handle key presses
    function handleKeyPress(e) {
        let moved = false;
        switch (e.key) {
            case 'ArrowUp':
                moved = moveUp();
                break;
            case 'ArrowDown':
                moved = moveDown();
                break;
            case 'ArrowLeft':
                moved = moveLeft();
                break;
            case 'ArrowRight':
                moved = moveRight();
                break;
        }

        if (moved) {
            spawnTile();
            renderBoard();
            if (isGameOver()) {
                gameOverScreen.classList.remove('hidden');
            }
        }
    }

    // Move tiles left
    function moveLeft() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            const row = board.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE);
            const newRow = transformRow(row);
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i * GRID_SIZE + j] !== newRow[j]) {
                    moved = true;
                }
                board[i * GRID_SIZE + j] = newRow[j];
            }
        }
        return moved;
    }

    // Move tiles right
    function moveRight() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = board.slice(i * GRID_SIZE, i * GRID_SIZE + GRID_SIZE);
            row.reverse();
            const newRow = transformRow(row);
            newRow.reverse();
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i * GRID_SIZE + j] !== newRow[j]) {
                    moved = true;
                }
                board[i * GRID_SIZE + j] = newRow[j];
            }
        }
        return moved;
    }

    // Move tiles up
    function moveUp() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            const col = [board[i], board[i + GRID_SIZE], board[i + 2 * GRID_SIZE], board[i + 3 * GRID_SIZE]];
            const newCol = transformRow(col);
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i + j * GRID_SIZE] !== newCol[j]) {
                    moved = true;
                }
                board[i + j * GRID_SIZE] = newCol[j];
            }
        }
        return moved;
    }

    // Move tiles down
    function moveDown() {
        let moved = false;
        for (let i = 0; i < GRID_SIZE; i++) {
            let col = [board[i], board[i + GRID_SIZE], board[i + 2 * GRID_SIZE], board[i + 3 * GRID_SIZE]];
            col.reverse();
            const newCol = transformRow(col);
            newCol.reverse();
            for (let j = 0; j < GRID_SIZE; j++) {
                if (board[i + j * GRID_SIZE] !== newCol[j]) {
                    moved = true;
                }
                board[i + j * GRID_SIZE] = newCol[j];
            }
        }
        return moved;
    }

    // Transform a row/column (slide and merge)
    function transformRow(row) {
        let newRow = row.filter(val => val);
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                updateScore(newRow[i]);
                newRow.splice(i + 1, 1);
            }
        }
        while (newRow.length < GRID_SIZE) {
            newRow.push(0);
        }
        return newRow;
    }

    // Check for game over
    function isGameOver() {
        // Check for empty cells
        if (board.includes(0)) return false;

        // Check for possible merges
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const current = board[i * GRID_SIZE + j];
                // Check right
                if (j < GRID_SIZE - 1 && current === board[i * GRID_SIZE + j + 1]) return false;
                // Check down
                if (i < GRID_SIZE - 1 && current === board[(i + 1) * GRID_SIZE + j]) return false;
            }
        }
        return true;
    }

    // Swipe controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    gameBoard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    gameBoard.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        let moved = false;

        if (Math.max(absDx, absDy) > 20) { // Threshold
            if (absDx > absDy) {
                moved = dx > 0 ? moveRight() : moveLeft();
            } else {
                moved = dy > 0 ? moveDown() : moveUp();
            }
        }

        if (moved) {
            spawnTile();
            renderBoard();
            if (isGameOver()) {
                gameOverScreen.classList.remove('hidden');
            }
        }
    }

    // Event Listeners
    document.addEventListener('keydown', handleKeyPress);
    restartButton.addEventListener('click', initGame);
    restartButtonGameOver.addEventListener('click', initGame);

    // Initial game start
    initGame();
});
