const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

let paddleHeight = 80;
let paddleWidth = 10;
let ballRadius = 8;

let player1Y = (canvas.height - paddleHeight) / 2;
let player2Y = (canvas.height - paddleHeight) / 2;

let upPressed = false;
let downPressed = false;
let wPressed = false;
let sPressed = false;

let ballX, ballY, ballDX, ballDY;
let speedMultiplier = 1.05;
let score1 = 0;
let score2 = 0;
let gameInterval;
let winningScore = 5; // Default
let gameRunning = false;

function startGame() {
  const input = prompt("🏁 How many points to win?", "5");
  if (input !== null && !isNaN(parseInt(input)) && parseInt(input) > 0) {
    winningScore = parseInt(input);
  } else {
    alert("Please enter a valid number. Using default: 5");
    winningScore = 5;
  }

  score1 = 0;
  score2 = 0;
  player1Y = player2Y = (canvas.height - paddleHeight) / 2;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballDX = 4;
  ballDY = 2;

  clearInterval(gameInterval);
  gameRunning = true;
  gameInterval = setInterval(update, 1000 / 60);
}

function update() {
  if (!gameRunning) return;

  movePaddles();
  moveBall();
  draw();

  // Check winner
  if (score1 >= winningScore || score2 >= winningScore) {
    gameRunning = false;
    clearInterval(gameInterval);
    setTimeout(() => {
      alert(score1 >= winningScore ? "🏆 Player 1 Wins!" : "🏆 Player 2 Wins!");
    }, 100);
  }
}

function movePaddles() {
  if (wPressed && player1Y > 0) player1Y -= 5;
  if (sPressed && player1Y < canvas.height - paddleHeight) player1Y += 5;
  if (upPressed && player2Y > 0) player2Y -= 5;
  if (downPressed && player2Y < canvas.height - paddleHeight) player2Y += 5;
}

function moveBall() {
  ballX += ballDX;
  ballY += ballDY;

  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballDY = -ballDY;
  }

  // Player 1 collision
  if (
    ballX - ballRadius < paddleWidth &&
    ballY > player1Y &&
    ballY < player1Y + paddleHeight
  ) {
    ballDX = -ballDX * speedMultiplier;
    ballDY += (Math.random() - 0.5);
  }

  // Player 2 collision
  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > player2Y &&
    ballY < player2Y + paddleHeight
  ) {
    ballDX = -ballDX * speedMultiplier;
    ballDY += (Math.random() - 0.5);
  }

  // Score conditions
  if (ballX - ballRadius < 0) {
    score2++;
    resetBall();
  }

  if (ballX + ballRadius > canvas.width) {
    score1++;
    resetBall();
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;

  const angle = (Math.random() * Math.PI / 3) - (Math.PI / 6); // -30° to +30°
  const speed = 4;
  const direction = Math.random() < 0.5 ? -1 : 1;

  ballDX = speed * Math.cos(angle) * direction;
  ballDY = speed * Math.sin(angle);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.closePath();

  ctx.font = "20px Arial";
  ctx.fillText("Player 1: " + score1, 50, 30);
  ctx.fillText("Player 2: " + score2, canvas.width - 150, 30);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
  if (e.key === "w") wPressed = true;
  if (e.key === "s") sPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
  if (e.key === "w") wPressed = false;
  if (e.key === "s") sPressed = false;
});
