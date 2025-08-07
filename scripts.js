const game = document.getElementById("game");
const player = document.getElementById("player");
const counter = document.getElementById("counter");
const instructions = document.getElementById("instructions");

let isJumping = false;
let jumpHeight = 0;
const gravity = 4;
let score = 0;
let lastObstacleTime = 0;
const obstacleInterval = 1200;
let gameStarted = false;
let gameOver = false;

function jump() {
  if (isJumping || gameOver) return;
  isJumping = true;
  let upInterval = setInterval(() => {
    if (jumpHeight >= 100) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (jumpHeight <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          jumpHeight -= gravity;
          player.style.bottom = 10 + jumpHeight + "px";
        }
      }, 20);
    } else {
      jumpHeight += gravity;
      player.style.bottom = 10 + jumpHeight + "px";
    }
  }, 20);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if(!gameStarted) {
      startGame();
      instructions.textContent = "Press Space to Avoid Obstacles!"
    }
    jump();
  }
});

function endGame() {
  gameOver = true;
  // Optional: visually mark the player or screen as game over
  instructions.textContent = `Game Over! Final Score ${score}`
  alert(`Game Over! Final Score ${score}`);
  // Stop all ongoing obstacle movement and animations
  // Let user refresh or auto-reload
  location.reload();
}

function createObstacle() {
  if (gameOver) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  let obstacleLeft = game.offsetWidth;
  obstacle.style.left = obstacleLeft + "px";
  game.appendChild(obstacle);

  let moveInterval = setInterval(() => {
    if (gameOver) {
      clearInterval(moveInterval);
      if (obstacle.parentElement) {
        game.removeChild(obstacle);
      }
      return;
    }

    if (obstacleLeft < -20) {
      clearInterval(moveInterval);
      if (obstacle.parentElement) {
        game.removeChild(obstacle);
      }
      score++;
      counter.textContent = "Score: " + score;
    } else {
      obstacleLeft -= 6;
      obstacle.style.left = obstacleLeft + "px";

      const playerLeft = 50;
      const playerRight = playerLeft + 50;
      const playerBottom = 10 + jumpHeight;

      const obstacleRight = obstacleLeft + 20;

      if (
        obstacleLeft < playerRight &&
        obstacleRight > playerLeft &&
        playerBottom < 60
      ) {
        clearInterval(moveInterval);
        endGame();
      }
    }
  }, 20);
}

function trySpawnObstacle(timestamp) {
  if (!gameStarted) return;
  if (gameOver) return;

  if (timestamp - lastObstacleTime > obstacleInterval) {
    if (Math.random() < 0.5) {
      createObstacle();
      lastObstacleTime = timestamp;
    }
  }
}

function startGame() {
  gameStarted = true;
  lastObstacleTime = performance.now();
}

function gameLoop(timestamp) {
  if (gameOver) return;
  trySpawnObstacle(timestamp);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
