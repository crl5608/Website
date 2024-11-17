var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = {
    x: 320,
    y: 240,
    speed: 7
};

var enemy = {
    x: -50, // Start offscreen to the left
    y: Math.random() * (canvas.height - 50),
    speed: 7,
    direction: 1 // Initially moving to the right
};
var keys = {};
var gameStarted = false;
var gameOver = false;
var score = 0;
var highScore = 0; // Initialize high score
var scoreInterval;

// Prevent arrow keys from scrolling the page
window.addEventListener("keydown", function (e) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
});

window.addEventListener("keyup", function (e) {
    delete keys[e.key];
});

// Reset the game state
function resetGame() {
    player.x = 320;
    player.y = 240;

    // Reset the enemy position
    enemy.x = Math.random() < 0.5 ? -50 : canvas.width; // Randomize starting side
    enemy.y = Math.random() * (canvas.height - 50);
    enemy.direction = enemy.x === -50 ? 1 : -1; // Set direction based on starting side

    keys = {};
    gameOver = false;
    score = 0;
    clearInterval(scoreInterval); // Stop the score counter
}

// Game loop
function gameLoop() {
    if (gameStarted) {
        update();
        render();
    }
    requestAnimationFrame(gameLoop);
}

function update() {
    if (!gameOver) {
        // Move player
        if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
        if (keys["ArrowDown"] && player.y < canvas.height - 50) player.y += player.speed;
        if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
        if (keys["ArrowRight"] && player.x < canvas.width - 50) player.x += player.speed;

        // Move enemy
        enemy.x += enemy.speed * enemy.direction;

        // Reset enemy position if it goes offscreen
        if (enemy.x < -50 || enemy.x > canvas.width + 50) {
            enemy.x = enemy.direction === 1 ? -50 : canvas.width;
            enemy.y = Math.random() * (canvas.height - 50);
        }

        // Detect collision
        if (collision(player, enemy)) {
            gameOver = true;
            clearInterval(scoreInterval); // Stop the score counter
            if (score > highScore) {
                highScore = score; // Update high score
            }
            openGameOverModal(`Game Over! Your Score: ${score} | High Score: ${highScore}`);
        }
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, 50, 50);

    // Draw enemy
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, 50, 50);

    // Display score
    var scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

// Collision detection
function collision(obj1, obj2) {
    return obj1.x < obj2.x + 50 &&
        obj1.x + 50 > obj2.x &&
        obj1.y < obj2.y + 50 &&
        obj1.y + 50 > obj2.y;
}

// Open the "Game Over" modal
function openGameOverModal(message) {
    var modal = document.getElementById("gameOverModal");
    var modalMessage = document.getElementById("gameOverMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Close the "Game Over" modal
function closeGameOverModal() {
    var modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
    resetGame();
}

// Start button logic
var startButton = document.getElementById("startButton");
startButton.addEventListener("click", function () {
    if (!gameStarted) {
        gameStarted = true;
        resetGame();
        scoreInterval = setInterval(() => score++, 1000); // Increment score every second
        startButton.textContent = "End Game";
    } else {
        gameStarted = false;
        resetGame();
        startButton.textContent = "Start Game";
    }
});

// Start the game loop
gameLoop();