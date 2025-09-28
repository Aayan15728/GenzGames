document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const scoreCounter = document.getElementById('score-counter');
    const finalScore = document.getElementById('final-score');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    // --- Sound Effects ---
    const flapSound = document.getElementById('flap-sound');
    const scoreSound = document.getElementById('score-sound');
    const hitSound = document.getElementById('hit-sound');
    const bgMusic = document.getElementById('bg-music');

    // --- Game Configuration ---
    let canvasWidth, canvasHeight;
    const gravity = 0.5;
    const flapStrength = -8;
    const obstacleWidth = 50;
    const obstacleGap = 150;
    const obstacleSpeed = -3;
    const obstacleInterval = 120; // Frames between obstacles

    // --- Game State ---
    let player, obstacles, score, frameCount, gameState;

    // --- Player Object ---
    const playerSprite = {
        x: 50,
        y: 150,
        width: 30,
        height: 30,
        velocity: 0,
        color: '#ffd32a', // Yellow
        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        },
        update() {
            this.velocity += gravity;
            this.y += this.velocity;

            // Prevent falling off the top
            if (this.y < 0) {
                this.y = 0;
                this.velocity = 0;
            }
        },
        flap() {
            this.velocity = flapStrength;
            playSound(flapSound);
        }
    };

    // --- Game Functions ---

    function init() {
        canvasWidth = canvas.width = canvas.offsetWidth;
        canvasHeight = canvas.height = canvas.offsetHeight;
        
        player = Object.assign({}, playerSprite);
        player.y = canvasHeight / 2;
        obstacles = [];
        score = 0;
        frameCount = 0;
        gameState = 'start';

        updateScore(0);
        startScreen.classList.remove('hidden');
        gameOverScreen.classList.add('hidden');
        gameLoop();
    }

    function gameLoop() {
        if (gameState === 'gameOver') return;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        if (gameState === 'playing') {
            // --- Obstacle Generation ---
            if (frameCount % obstacleInterval === 0) {
                const gapY = Math.random() * (canvasHeight - obstacleGap - 100) + 50;
                obstacles.push({ x: canvasWidth, y: gapY, scored: false });
            }

            // --- Update & Draw Obstacles ---
            for (let i = obstacles.length - 1; i >= 0; i--) {
                const o = obstacles[i];
                o.x += obstacleSpeed;

                // Draw
                ctx.fillStyle = '#2ed573'; // Green
                // Top pipe
                ctx.fillRect(o.x, 0, obstacleWidth, o.y);
                ctx.strokeRect(o.x, 0, obstacleWidth, o.y);
                // Bottom pipe
                ctx.fillRect(o.x, o.y + obstacleGap, obstacleWidth, canvasHeight - o.y - obstacleGap);
                ctx.strokeRect(o.x, o.y + obstacleGap, obstacleWidth, canvasHeight - o.y - obstacleGap);

                // --- Scoring ---
                if (!o.scored && o.x + obstacleWidth < player.x) {
                    score++;
                    updateScore(score);
                    playSound(scoreSound);
                    o.scored = true;
                }

                // --- Collision Detection ---
                if (
                    player.x < o.x + obstacleWidth &&
                    player.x + player.width > o.x &&
                    (player.y < o.y || player.y + player.height > o.y + obstacleGap)
                ) {
                    endGame();
                }

                // Remove off-screen obstacles
                if (o.x + obstacleWidth < 0) {
                    obstacles.splice(i, 1);
                }
            }

            // --- Update & Draw Player ---
            player.update();
            player.draw();

            // --- Bottom Collision ---
            if (player.y + player.height > canvasHeight) {
                endGame();
            }

            frameCount++;
        }

        requestAnimationFrame(gameLoop);
    }

    function startGame() {
        gameState = 'playing';
        startScreen.classList.add('hidden');
        player.flap(); // Initial flap
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log("Music play failed"));
    }

    function endGame() {
        gameState = 'gameOver';
        playSound(hitSound);
        bgMusic.pause();
        bgMusic.currentTime = 0;
        finalScore.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    function updateScore(newScore) {
        score = newScore;
        scoreCounter.textContent = `Score: ${score}`;
    }

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log(`Sound play failed: ${e}`));
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', init);
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (gameState === 'playing') player.flap();
        }
    });
    canvas.addEventListener('mousedown', () => {
        if (gameState === 'playing') player.flap();
    });
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent double-tap zoom
        if (gameState === 'playing') player.flap();
    });

    // --- Initial Load ---
    window.addEventListener('resize', init); // Re-init on resize
    init();
});