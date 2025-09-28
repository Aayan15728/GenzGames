document.addEventListener('DOMContentLoaded', () => {
    const choices = ['rock', 'paper', 'scissors'];
    const icons = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️'
    };

    const controlButtons = document.querySelectorAll('.control-btn');
    const playAgainButton = document.getElementById('play-again');

    const playerScoreEl = document.getElementById('player-score');
    const aiScoreEl = document.getElementById('ai-score');
    const playerChoiceEl = document.querySelector('#player-choice .icon');
    const aiChoiceEl = document.querySelector('#ai-choice .icon');
    const playerChoiceCard = document.getElementById('player-choice');
    const aiChoiceCard = document.getElementById('ai-choice');

    const statusMessageEl = document.getElementById('status-message');
    const resultMessageEl = document.getElementById('result-message');

    let playerScore = 0;
    let aiScore = 0;
    let playerHistory = [];

    controlButtons.forEach(button => {
        button.addEventListener('click', () => {
            playRound(button.dataset.choice);
        });
    });

    playAgainButton.addEventListener('click', resetGame);

    function getAIChoice() {
        if (playerHistory.length < 3) {
            return choices[Math.floor(Math.random() * choices.length)];
        }

        const lastMove = playerHistory[playerHistory.length - 1];
        const secondLastMove = playerHistory[playerHistory.length - 2];

        // If the player repeats a move, predict they will switch
        if (lastMove === secondLastMove) {
            const remainingChoices = choices.filter(choice => choice !== lastMove);
            return remainingChoices[Math.floor(Math.random() * remainingChoices.length)];
        }

        // Predict the player will follow a sequence (e.g., rock, paper -> scissors)
        if (
            (lastMove === 'rock' && secondLastMove === 'scissors') ||
            (lastMove === 'paper' && secondLastMove === 'rock') ||
            (lastMove === 'scissors' && secondLastMove === 'paper')
        ) {
            const nextMove = {
                rock: 'paper',
                paper: 'scissors',
                scissors: 'rock'
            };
            return nextMove[lastMove];
        }

        // Default to a random choice
        return choices[Math.floor(Math.random() * choices.length)];
    }

    function playRound(playerChoice) {
        playerHistory.push(playerChoice);
        const aiChoice = getAIChoice();
        
        updateChoices(playerChoice, aiChoice);
        
        const winner = getWinner(playerChoice, aiChoice);

        if (winner === 'player') {
            playerScore++;
            playerScoreEl.textContent = 'Score: ' + playerScore;
            statusMessageEl.textContent = 'You win this round!';
            resultMessageEl.textContent = `${capitalize(playerChoice)} beats ${capitalize(aiChoice)}.`;
            playerChoiceCard.classList.add('glowing');
        } else if (winner === 'ai') {
            aiScore++;
            aiScoreEl.textContent = 'Score: ' + aiScore;
            statusMessageEl.textContent = 'AI wins this round!';
            resultMessageEl.textContent = `${capitalize(aiChoice)} beats ${capitalize(playerChoice)}.`;
            aiChoiceCard.classList.add('glowing');
        } else {
            statusMessageEl.textContent = 'It\'s a tie!';
            resultMessageEl.textContent = 'Both chose ' + capitalize(playerChoice) + '.';
        }

        toggleControls(true);
    }

    function getWinner(player, ai) {
        if (player === ai) {
            return 'tie';
        }
        if (
            (player === 'rock' && ai === 'scissors') ||
            (player === 'paper' && ai === 'rock') ||
            (player === 'scissors' && ai === 'paper')
        ) {
            return 'player';
        }
        return 'ai';
    }

    function updateChoices(player, ai) {
        playerChoiceEl.textContent = icons[player];
        aiChoiceEl.textContent = icons[ai];
    }

    function resetGame() {
        playerChoiceEl.textContent = '?';
        aiChoiceEl.textContent = '?';
        statusMessageEl.textContent = 'Choose your weapon!';
        resultMessageEl.textContent = '';
        playerChoiceCard.classList.remove('glowing');
        aiChoiceCard.classList.remove('glowing');
        toggleControls(false);
    }

    function toggleControls(gameOver) {
        if (gameOver) {
            document.querySelector('.controls').classList.add('hidden');
            playAgainButton.classList.remove('hidden');
        } else {
            document.querySelector('.controls').classList.remove('hidden');
            playAgainButton.classList.add('hidden');
        }
    }

    function capitalize(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
});
