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

function startGame() {
  let game = new Game({
    canvas,
    ctx,
    collisionCanvas,
    collisionCtx: collisionCtx,
  });

  let deltaTime = 0;
  let lastTime = 0;
  let animateId;

  function animate(timestamp = 0) {
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    if (deltaTime > 100) deltaTime = 16;

    game.render(deltaTime);

    if (game.gameOver) {
      cancelAnimationFrame(animateId);
      displayGameOver();
    } else {
      animateId = requestAnimationFrame(animate);
    }
  }
  animateId = requestAnimationFrame(animate);
}

const preloader = document.getElementById("preloader");
const gameStartUI = document.getElementById("game-start");
const gameOverUI = document.getElementById("game-over");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const shootSound = document.getElementById("shootSound");
const gameOverSound = document.getElementById("gameOverSound");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.style.display = "none";
    gameStartUI.style.display = "block";
  }, 1000);
});

startButton.addEventListener("click", () => {
  gameStartUI.style.display = "none";
  shootSound.play();
  startGame();
});

restartButton.addEventListener("click", () => {
  gameOverUI.style.display = "none";
  shootSound.play();
  startGame();
});

function displayGameOver() {
  gameOverUI.style.display = "block";
  gameOverSound.play();
}
