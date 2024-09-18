function rideHeight() {
    var userHeight = document.getElementById("userHeight").value; // Stores the input of user height to be used for the calculation

    // If the users height is left blank, the user will receive an error message asking for a correct input value.
    if (userHeight === '') {
        document.getElementById("rideResult").innerHTML = "<span class='error-message'>Please enter your height in inches in the field above.</span>";
        return;
    }

    // If the users height is less than 48 inches, the user will be notified that they are not tall enough to ride. Otherwise, the user will be shown they are tall enough.
    if (userHeight < 48) {
        document.getElementById("rideResult").innerHTML = "Sorry, you are not tall enough to ride!"
    } else {
        document.getElementById("rideResult").innerHTML = "You are tall enough to ride!"}
    }

function sumThreeNumbers() {
    var num1 = document.getElementById("num1").value;
    var num2 = document.getElementById("num2").value;
    var num3 = document.getElementById("num3").value;

    if (num1 === '' || num2 === '' || num3 === '') {
        document.getElementById("sumResult").innerHTML = "<span class='error-message'>Please enter numeric values in all fields.</span>";
        return;
    }
    
    var sum = Number(num1) + Number(num2) + Number(num3);
    
    document.getElementById("sumResult").innerHTML = "The sum is: " + sum; 
}
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player = {
    x: 320,
    y: 240,
    speed: 7
};

var enemy = {
    x: 0, // Initialize enemy x position to 0
    y: Math.floor(Math.random() * (canvas.height - 50)), // Randomize enemy y position
    speed: 14,
    direction: Math.random() < 0.5 ? 1 : -1 // Randomize enemy direction (1 for right, -1 for left)
};
var keys = {};
var gameStarted = false;
var gameOver = false;
var score = 0;
var playerId = generatePlayerId(); // Generate a unique player ID
var highScore = getHighScore(playerId); // Retrieve high score for the current player
var scoreInterval; // Variable to store setInterval for scoring

// Define keydown event handler
function keydownHandler(e) {
    // Prevent default scrolling behavior for arrow keys
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
    }
    keys[e.key] = true;
}

// Define keyup event handler
function keyupHandler(e) {
    delete keys[e.key];
}


// Define a function to reset the game state
function resetGame() {
    player.x = 320;
    player.y = 240;
    // Randomize enemy starting position and direction
    if (Math.random() < 0.5) {
        // Enemy starts from the left
        enemy.x = -50;
        enemy.direction = 1; // Move to the right
    } else {
        // Enemy starts from the right
        enemy.x = canvas.width;
        enemy.direction = -1; // Move to the left
    }
    // Randomize enemy y position
    enemy.y = Math.floor(Math.random() * (canvas.height - 50));
    keys = {};
    gameOver = false;
    clearInterval(scoreInterval); // Clear score interval
    score = 0; // Reset score to 0
    render();
    // Re-register event listeners
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
}

// Define game loop
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
        enemy.x += enemy.speed * enemy.direction; // Move enemy based on direction

        // Reset enemy position if it goes off the screen
        if (enemy.x < -50 || enemy.x > canvas.width + 50) {
            // Alternate starting side of the enemy
            enemy.direction *= -1; // Reverse the direction
            enemy.x = enemy.direction === 1 ? -50 : canvas.width;
            enemy.y = Math.floor(Math.random() * (canvas.height - 50));
        }

		// Detect collisions
		if (collision(player, enemy)) {
			clearInterval(scoreInterval); // Clear score interval
			if (score > highScore) {
				highScore = score;
				setHighScore(playerId, highScore); // Update high score for the current player
			}
			openGameOverModal("Game Over! Your Score: " + score + ", High Score: " + highScore);
			gameStarted = false;
			resetGame(); // Reset the game state
			startButton.textContent = "Start Game";
			return; // Exit the update loop if game over
		}
    }
}

// Define render function
function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = "blue";
    ctx.fillRect(player.x, player.y, 50, 50);

    // Draw enemy
    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, 50, 50);

    // Score display
    var scoreDisplay = document.getElementById("scoreDisplay");
    scoreDisplay.textContent = "Score: " + score + " | High Score: " + highScore;
}

// Define collision detection function
function collision(obj1, obj2) {
    return obj1.x < obj2.x + 50 &&
           obj1.x + 50 > obj2.x &&
           obj1.y < obj2.y + 50 &&
           obj1.y + 50 > obj2.y;
}

// Function to generate a unique player ID
function generatePlayerId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
}

// Function to get high score for a player from local storage
function getHighScore(playerId) {
    return parseInt(localStorage.getItem(playerId + "_highScore")) || 0; // Retrieve high score from local storage or default to 0
}

// Function to set high score for a player in local storage
function setHighScore(playerId, score) {
    localStorage.setItem(playerId + "_highScore", score); // Store high score in local storage
}

// Function to open the "Game Over" modal with custom message
function openGameOverModal(message) {
    var modal = document.getElementById("gameOverModal");
    var modalMessage = document.getElementById("gameOverMessage");
    modalMessage.textContent = message;
    modal.style.display = "block";
}

// Function to close the "Game Over" modal
function closeGameOverModal() {
    var modal = document.getElementById("gameOverModal");
    modal.style.display = "none";
}

// Get the start game button
var startButton = document.getElementById("startButton");

// Add event listener for start/end game button
startButton.addEventListener("click", function() {
    if (startButton.textContent === "Start Game") {
        startButton.textContent = "End Game";
        gameStarted = true;
        resetGame();
        // Start scoring interval
        scoreInterval = setInterval(function() {
            score++;
        }, 1000); // Increase score every second
    } else {
        startButton.textContent = "Start Game";
        gameStarted = false;
        resetGame();
    }
});

// Start game loop
gameLoop();
