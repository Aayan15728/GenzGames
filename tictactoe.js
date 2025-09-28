document.addEventListener('DOMContentLoaded', () => {
    const modeSelection = document.getElementById('mode-selection');
    const humanVsHumanBtn = document.getElementById('human-vs-human');
    const humanVsAiBtn = document.getElementById('human-vs-ai');
    const gameBoardContainer = document.getElementById('game-board-container');
    const cells = document.querySelectorAll('.cell');
    const turnDisplay = document.getElementById('turn-display');
    const resultPopup = document.getElementById('result-popup');
    const resultMessage = document.getElementById('result-message');
    const playAgainBtn = document.getElementById('play-again-btn');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let isAiMode = false;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- Game Initialization and Mode Selection ---
    humanVsHumanBtn.addEventListener('click', () => startGame(false));
    humanVsAiBtn.addEventListener('click', () => startGame(true));
    playAgainBtn.addEventListener('click', resetGame);

    function startGame(aiMode) {
        isAiMode = aiMode;
        modeSelection.classList.add('hidden');
        gameBoardContainer.classList.remove('hidden');
        resetGame();
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        isGameActive = true;
        turnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
        resultPopup.classList.add('hidden');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winning');
        });
        if (isAiMode && currentPlayer === 'O') { // If AI is O and it's O's turn first (shouldn't happen with X always starting)
            setTimeout(aiMove, 500);
        }
    }

    // --- Game Logic ---
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.dataset.cellIndex);

        if (board[clickedCellIndex] !== '' || !isGameActive) {
            return;
        }

        makeMove(clickedCell, clickedCellIndex, currentPlayer);
        checkResult();
        if (isGameActive) {
            turnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
            if (isAiMode && currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }
    }

    function makeMove(cell, index, player) {
        board[index] = player;
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
        currentPlayer = player === 'X' ? 'O' : 'X';
    }

    function checkResult() {
        let roundWon = false;
        let winningCombo = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                winningCombo = winCondition;
                break;
            }
        }

        if (roundWon) {
            isGameActive = false;
            turnDisplay.textContent = 'Game Over!'; // Clear turn display on win
            resultMessage.textContent = `Player ${board[winningCombo[0]]} Wins! 🎉`;
            winningCombo.forEach(index => {
                cells[index].classList.add('winning');
            });
            resultPopup.classList.remove('hidden');
            return;
        }

        if (!board.includes('')) {
            isGameActive = false;
            turnDisplay.textContent = 'Game Over!'; // Clear turn display on draw
            resultMessage.textContent = `It's a Draw! 🤝`;
            resultPopup.classList.remove('hidden');
            return;
        }
    }

    // --- AI Opponent (Minimax with Alpha-Beta Pruning) ---
    function aiMove() {
        if (!isGameActive) return;

        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O'; // Try the move
                let score = minimax(board, 0, -Infinity, Infinity, false);
                board[i] = ''; // Undo the move
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        if (move !== -1) {
            makeMove(cells[move], move, 'O');
            checkResult();
            if (isGameActive) {
                turnDisplay.textContent = `Player ${currentPlayer}'s Turn`;
            }
        }
    }

    function minimax(currentBoard, depth, alpha, beta, isMaximizingPlayer) {
        let score = evaluate(currentBoard);

        if (score === 10) return score - depth; // AI wins
        if (score === -10) return score + depth; // Human wins
        if (!currentBoard.includes('')) return 0; // Draw

        if (isMaximizingPlayer) {
            let best = -Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = 'O';
                    best = Math.max(best, minimax(currentBoard, depth + 1, alpha, beta, false));
                    currentBoard[i] = '';
                    alpha = Math.max(alpha, best);
                    if (beta <= alpha) break;
                }
            }
            return best;
        } else {
            let best = Infinity;
            for (let i = 0; i < currentBoard.length; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = 'X';
                    best = Math.min(best, minimax(currentBoard, depth + 1, alpha, beta, true));
                    currentBoard[i] = '';
                    beta = Math.min(beta, best);
                    if (beta <= alpha) break;
                }
            }
            return best;
        }
    }

    function evaluate(currentBoard) {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (currentBoard[a] === currentBoard[b] && currentBoard[b] === currentBoard[c]) {
                if (currentBoard[a] === 'O') return 10; // AI wins
                else if (currentBoard[a] === 'X') return -10; // Human wins
            }
        }
        return 0; // No winner
    }
});
