/**@type {HTMLCanvasElement} */
import { Game } from "./src/Game.js";

const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

const scale = Math.min(
  Math.min(1920, window.innerWidth) / 1920,
  Math.min(1080, window.innerHeight) / 1080
);
canvas.width = 1920 * scale;
canvas.height = 1080 * scale;
canvas.scale = scale;

const collisionCanvas = document.querySelector("#collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;

window.addEventListener("load", () => {
  document.getElementById("preloader").style.display = "none";
  document.getElementById("game-start").style.display = "block";
});

function startGame() {
  let game = new Game({
    canvas,
    ctx,
    collisionCanvas,
    collisionCtx: collisionCtx,
  });

  let deltaTime = 0;
  let lastTime = 0;

  function animate(timestamp = 0) {
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    if (deltaTime > 100) deltaTime = 16;

    game.render(deltaTime);

    if (!game.gameOver) requestAnimationFrame(animate);
    else handleGameOver();
  }
  animate();
}

const startButton = document.getElementById("start-btn");
startButton.addEventListener("click", () => {
  document.getElementById("game-start").style.display = "none";
  shootSound.play();
  startGame();
});

const restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", () => {
  document.getElementById("game-over").style.display = "none";
  shootSound.play();
  startGame();
});

function handleGameOver() {
  document.getElementById("game-over").style.display = "block";
  gameOverSound.play();
}
