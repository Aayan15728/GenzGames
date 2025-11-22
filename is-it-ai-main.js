document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Event fired.');
    const gameImage = document.getElementById('game-image');
    const realBtn = document.querySelector('.real-btn');
    const aiBtn = document.querySelector('.ai-btn');
    const progressSpan = document.querySelector('.progress span');
    const reloadBtn = document.querySelector('.reload-btn');
    const gameControls = document.querySelector('.game-controls');
    const feedbackContainer = document.querySelector('.feedback-container');
    const feedbackText = document.getElementById('feedback-text');
    const nextBtn = document.querySelector('.next-btn');
    const mainContent = document.querySelector('main');
    const scoreScreen = document.querySelector('.score-screen');
    const finalScoreSpan = document.getElementById('final-score');
    const totalQuestionsDisplaySpan = document.getElementById('total-questions-display');
    const playAgainBtn = document.querySelector('.play-again-btn');
    const tweetScoreBtn = document.getElementById('tweet-score-btn');


    const imageData = [
        { src: 'is-it-ai-game-image-this-image-is-real(hard).jpeg', type: 'real' },
        { src: 'is-it-ai-game-image-this-image-is-ai(hard).png', type: 'ai' },
        { src: 'is-it-ai-game-image-this-image-is-real(medium).jpeg', type: 'real' },
        { src: 'is-it-ai-game-image-this-image-is-ai(impossible).jpeg', type: 'ai' },
        { src: 'is-it-ai-game-image-this-image-is-real(easy).jpeg', type: 'real' },
        { src: 'is-it-ai-game-image-this-image-is-ai(hard) (2).png', type: 'ai' },
        { src: 'is-it-ai-game-image-this-image-is-real(hard).jpg', type: 'real' },
        { src: 'is-it-ai-game-image-this-image-is-ai(hard)1.png', type: 'ai' },
        { src: 'is-it-ai-game-image-this-image-is-ai(hard) (3).png', type: 'ai' },
        { src: 'is-it-ai-game-image-this-image-is-real(hard)1.png', type: 'real' }
    ];

    let currentImageIndex = 0;
    let score = 0;
    let totalQuestions = 0;
    let shuffledImages = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {
        shuffledImages = shuffleArray([...imageData]).slice(0, 10);
        totalQuestions = shuffledImages.length;
        currentImageIndex = 0;
        score = 0;

        mainContent.style.display = 'block';
        gameControls.style.display = 'block';
        feedbackContainer.style.display = 'none';
        scoreScreen.style.display = 'none';

        // Keep using classes for parts of the UI where it's not failing
        mainContent.classList.remove('hidden');
        gameControls.classList.remove('hidden');


        displayImage();
        updateProgress();
    }

    function displayImage() {
        if (currentImageIndex < totalQuestions) {
            gameImage.src = shuffledImages[currentImageIndex].src;
        } else {
            endGame();
        }
    }

    function updateProgress() {
        progressSpan.textContent = `${currentImageIndex + 1}/${totalQuestions}`;
    }

    function showFeedback(isCorrect, correctAnswerType) {
        gameControls.style.display = 'none';
        feedbackContainer.style.display = 'flex';
        const feedbackMessage = feedbackContainer.querySelector('.feedback-message');
        feedbackMessage.classList.remove('correct', 'incorrect');

        if (isCorrect) {
            feedbackText.textContent = `Yes, This is ${correctAnswerType.toUpperCase()}`;
            feedbackMessage.classList.add('correct');
        } else {
            feedbackText.textContent = `No, This is ${correctAnswerType.toUpperCase()}`;
            feedbackMessage.classList.add('incorrect');
        }
    }

    function handleAnswer(userChoice) {
        if (currentImageIndex < totalQuestions) {
            const correctAnswer = shuffledImages[currentImageIndex].type;
            const isCorrect = (userChoice === correctAnswer);
            if (isCorrect) {
                score++;
            }
            showFeedback(isCorrect, correctAnswer);
        }
    }

    function nextQuestion() {
        currentImageIndex++;
        if (currentImageIndex < totalQuestions) {
            feedbackContainer.style.display = 'none';
            gameControls.style.display = 'block';
            displayImage();
            updateProgress();
        } else {
            endGame();
        }
    }

    function endGame() {
        mainContent.style.display = 'none';
        scoreScreen.style.display = 'flex';
        finalScoreSpan.textContent = score;
        totalQuestionsDisplaySpan.textContent = totalQuestions;

        finalScoreSpan.classList.remove('high-score', 'medium-score', 'low-score');

        if (score > 7) {
            finalScoreSpan.classList.add('high-score');
        } else if (score >= 3) {
            finalScoreSpan.classList.add('medium-score');
        } else {
            finalScoreSpan.classList.add('low-score');
        }
    }

    realBtn.addEventListener('click', () => handleAnswer('real'));
    aiBtn.addEventListener('click', () => handleAnswer('ai'));
    nextBtn.addEventListener('click', nextQuestion);
    playAgainBtn.addEventListener('click', startGame);

    tweetScoreBtn.addEventListener('click', () => {
        const text = `I scored ${score}/${totalQuestions} in the GENZGames — IS IT AI CHALLENGE! Can you beat my score?`;
        const url = 'https://genzgames.fun/';
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank');
    });

    function preloadImages(imageObjects, callback) {
        let loadedCount = 0;
        const totalImages = imageObjects.length;
        if (totalImages === 0) {
            callback();
            return;
        }
        imageObjects.forEach(imageData => {
            const img = new Image();
            img.src = imageData.src;
            img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    callback();
                }
            };
        });
    }

    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            startGame(); // Restart game instead of full page reload
        });
    }

    preloadImages(imageData, startGame);
});
