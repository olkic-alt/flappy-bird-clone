const bird = document.getElementById('bird');
const gameArea = document.getElementById('gameArea');
const gameOverScreen = document.getElementById('gameOver');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('bestScore');
const finalScoreDisplay = document.getElementById('finalScore');
const restartBtn = document.getElementById('restartBtn');

// Game Variables
let birdY = 200;
let birdX = 50;
let gravity = 0.6;
let velocity = 0;
let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
let gameRunning = true;
let pipeGap = 120;
let pipeWidth = 60;
let pipeDistance = 200;
let pipeSpeed = 4;

// Pipe positions
let pipes = [
    { x: 400, gap: Math.random() * 200 + 50 },
    { x: 600, gap: Math.random() * 200 + 50 },
    { x: 800, gap: Math.random() * 200 + 50 }
];

// Display best score
bestScoreDisplay.textContent = bestScore;

// Update bird position
function updateBird() {
    velocity += gravity;
    birdY += velocity;

    // Boundary check
    if (birdY > gameArea.offsetHeight - 40 || birdY < 0) {
        endGame();
    }

    bird.style.top = birdY + 'px';
}

// Move pipes
function updatePipes() {
    pipes.forEach((pipe, index) => {
        pipe.x -= pipeSpeed;

        // Reset pipe if off screen
        if (pipe.x < -pipeWidth) {
            pipe.x = gameArea.offsetWidth;
            pipe.gap = Math.random() * 200 + 50;
            score++;
            scoreDisplay.textContent = score;
        }

        // Render pipes
        const topPipe = document.getElementById(`pipe${index + 1}Top`);
        const bottomPipe = document.getElementById(`pipe${index + 1}Bottom`);

        topPipe.style.left = pipe.x + 'px';
        topPipe.style.height = pipe.gap + 'px';

        bottomPipe.style.left = pipe.x + 'px';
        bottomPipe.style.height = (gameArea.offsetHeight - pipe.gap - pipeGap) + 'px';

        // Collision detection
        checkCollision(pipe, topPipe, bottomPipe);
    });
}

// Collision detection
function checkCollision(pipe, topPipe, bottomPipe) {
    const birdSize = 40;
    const birdRight = birdX + birdSize;
    const birdBottom = birdY + birdSize;
    const pipeRight = pipe.x + pipeWidth;

    if (birdRight > pipe.x && birdX < pipeRight) {
        if (birdY < pipe.gap || birdBottom > pipe.gap + pipeGap) {
            endGame();
        }
    }
}

// Make bird fly
function fly() {
    velocity = -12;
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    updateBird();
    updatePipes();

    requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameRunning = false;
    gameOverScreen.classList.add('show');
    finalScoreDisplay.textContent = score;

    if (score > bestScore) {
        bestScore = score;
        bestScoreDisplay.textContent = bestScore;
        localStorage.setItem('bestScore', bestScore);
    }
}

// Restart game
function restart() {
    birdY = 200;
    velocity = 0;
    score = 0;
    gameRunning = true;
    scoreDisplay.textContent = score;
    gameOverScreen.classList.remove('show');

    pipes = [
        { x: 400, gap: Math.random() * 200 + 50 },
        { x: 600, gap: Math.random() * 200 + 50 },
        { x: 800, gap: Math.random() * 200 + 50 }
    ];

    gameLoop();
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameRunning) {
        e.preventDefault();
        fly();
    }
});

gameArea.addEventListener('click', () => {
    if (gameRunning) {
        fly();
    }
});

// Touch support for mobile
gameArea.addEventListener('touchstart', () => {
    if (gameRunning) {
        fly();
    }
});

restartBtn.addEventListener('click', restart);

// Start game
gameLoop();
