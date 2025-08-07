const game = document.getElementById("game");
const player = document.getElementById("player");
const counter = document.getElementById("counter");
let isJumping = false;
let jumpHeight = 0;
const gravity = 4;
let score = 0;
let lastObstacleTime = 0;
const obstacleInterval = 1200;
let gameStarted = false;
let gameOver = false;




function jump() {
  if (isJumping) return;
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
    jump();
  }
});

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  let obstacleLeft = game.offsetWidth;
  obstacle.style.left = obstacleLeft + "px";
  game.appendChild(obstacle);

  let moveInterval = setInterval(() => {
    if (obstacleLeft < -20) {
      clearInterval(moveInterval);
      game.removeChild(obstacle);
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
        alert("Game Over");
        location.reload();
      }
    }
  }, 20);
}

function trySpawnObstacle(timestamp) {
  if (timestamp - lastObstacleTime > obstacleInterval) {
    if (Math.random() < 0.5) {
      createObstacle();
      lastObstacleTime = timestamp;
    }
  }
}


function gameLoop(timestamp) {
  trySpawnObstacle(timestamp);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
