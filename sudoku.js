document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('sudoku-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const solveBtn = document.getElementById('solve-btn');
    const easyBtn = document.getElementById('easy-btn');
    const mediumBtn = document.getElementById('medium-btn');
    const hardBtn = document.getElementById('hard-btn');
    const impossibleBtn = document.getElementById('impossible-btn');
    const successMessage = document.createElement('p');
    successMessage.id = 'success-message';
    successMessage.textContent = 'Congratulations! You solved the puzzle!';
    boardElement.insertAdjacentElement('afterend', successMessage);

    let board = [];
    let solution = [];
    let difficulty = 'easy';
    let selectedCell = null;

    function createBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('input');
                cell.classList.add('cell');
                cell.setAttribute('type', 'text');
                cell.setAttribute('maxlength', '1');
                cell.dataset.row = i;
                cell.dataset.col = j;
                row.appendChild(cell);
            }
            boardElement.appendChild(row);
        }
    }

    function generateSudoku() {
        successMessage.style.display = 'none';
        board = Array(9).fill(null).map(() => Array(9).fill(0));
        solution = Array(9).fill(null).map(() => Array(9).fill(0));
        
        generateSolution(board);
        
        for(let i=0; i<9; i++){
            for(let j=0; j<9; j++){
                solution[i][j] = board[i][j];
            }
        }

        let holes = 0;
        if (difficulty === 'easy') {
            holes = 30;
        } else if (difficulty === 'medium') {
            holes = 40;
        } else if (difficulty === 'hard') {
            holes = 50;
        } else if (difficulty === 'impossible') {
            holes = 60;
        }

        punchHoles(board, holes);
        renderBoard();
    }

    function generateSolution(board) {
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0) {
                    shuffle(numbers);
                    for (let num of numbers) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (generateSolution(board)) {
                                return true;
                            }
                            board[i][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function punchHoles(board, holes) {
        let punched = 0;
        while (punched < holes) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                punched++;
            }
        }
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[startRow + i][startCol + j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function renderBoard() {
        const cells = boardElement.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            if (board[row][col] !== 0) {
                cell.value = board[row][col];
                cell.classList.add('fixed');
                cell.disabled = true;
            } else {
                cell.value = '';
                cell.classList.remove('fixed');
                cell.disabled = false;
            }
            cell.addEventListener('focus', handleCellFocus);
            cell.addEventListener('input', handleCellInput);
        });
    }

    function handleCellFocus(event) {
        selectedCell = event.target;
        highlightCells(selectedCell);
    }

    function handleCellInput(event) {
        const cell = event.target;
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = cell.value;

        if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 9)) {
            board[row][col] = value === '' ? 0 : parseInt(value);
            validateCell(cell);
            if (checkWin()) {
                successMessage.style.display = 'block';
            }
        } else {
            cell.value = '';
        }
    }

    function highlightCells(cell) {
        const cells = boardElement.querySelectorAll('.cell');
        cells.forEach(c => c.classList.remove('selected', 'highlight'));

        cell.classList.add('selected');

        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        for (let i = 0; i < 9; i++) {
            getCell(row, i).classList.add('highlight');
            getCell(i, col).classList.add('highlight');
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                getCell(startRow + i, startCol + j).classList.add('highlight');
            }
        }
    }

    function validateCell(cell) {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = parseInt(cell.value);

        if (isNaN(value)) {
            cell.classList.remove('incorrect');
            return;
        }

        let isValidMove = true;
        for (let i = 0; i < 9; i++) {
            if (i !== col && board[row][i] === value) {
                isValidMove = false;
                break;
            }
            if (i !== row && board[i][col] === value) {
                isValidMove = false;
                break;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if ((startRow + i !== row || startCol + j !== col) && board[startRow + i][startCol + j] === value) {
                    isValidMove = false;
                    break;
                }
            }
        }

        if (isValidMove) {
            cell.classList.remove('incorrect');
        } else {
            cell.classList.add('incorrect');
        }
    }

    function checkWin() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === 0 || !isValid(board, i, j, board[i][j])) {
                    return false;
                }
            }
        }
        return true;
    }

    function getCell(row, col) {
        return boardElement.querySelector(`[data-row='${row}'][data-col='${col}']`);
    }

    function solveSudoku() {
        renderSolution();
    }

    function renderSolution() {
        const cells = boardElement.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            cell.value = solution[row][col];
        });
    }

    newGameBtn.addEventListener('click', generateSudoku);
    solveBtn.addEventListener('click', solveSudoku);

    easyBtn.addEventListener('click', () => setDifficulty('easy'));
    mediumBtn.addEventListener('click', () => setDifficulty('medium'));
    hardBtn.addEventListener('click', () => setDifficulty('hard'));
    impossibleBtn.addEventListener('click', () => setDifficulty('impossible'));

    function setDifficulty(level) {
        difficulty = level;
        easyBtn.classList.remove('active');
        mediumBtn.classList.remove('active');
        hardBtn.classList.remove('active');
        impossibleBtn.classList.remove('active');
        document.getElementById(`${level}-btn`).classList.add('active');
        generateSudoku();
    }

    createBoard();
    setDifficulty('easy');
});