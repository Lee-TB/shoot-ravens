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

let game = null;
let animateId;
function playGame() {
  game = new Game({
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

    if (!game.pause) game.render(deltaTime);

    if (game.gameOver) {
      cancelAnimationFrame(animateId);
      displayGameOver();
      game = null; // free the memory
    } else {
      animateId = requestAnimationFrame(animate);
    }
  }
  animateId = requestAnimationFrame(animate);
}

const preloader = document.getElementById("preloader");
const gameStartUI = document.getElementById("gameStartUI");
const gameOverUI = document.getElementById("gameOverUI");
const playButton = document.getElementById("playButton");
const playAgainButton = document.getElementById("playAgainButton");
const restartButton = document.getElementById("restartButton");
const shootSound = document.getElementById("shootSound");
const gameOverSound = document.getElementById("gameOverSound");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.style.display = "none";
    gameStartUI.style.display = "block";
  }, 1000);
});

playButton.addEventListener("click", () => {
  gameStartUI.style.display = "none";
  shootSound.play();
  playGame();
});

playAgainButton.addEventListener("click", () => {
  gameOverUI.style.display = "none";
  shootSound.play();
  playGame();
});

restartButton.addEventListener("click", () => {
  if (window.confirm("Are you sure you want to restart game now?")) {
    game.settingsMenu.style.display = "none";
    game = null;
    cancelAnimationFrame(animateId);
    shootSound.play();
    playGame();
  }
});

function displayGameOver() {
  gameOverUI.style.display = "block";
  gameOverSound.play();
}
