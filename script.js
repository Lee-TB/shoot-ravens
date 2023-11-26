/**@type {HTMLCanvasElement} */
import { Raven } from "./src/classes/Raven.js";
import { Explosion } from "./src/classes/Explosion.js";

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const scale = Math.min(1280, window.innerWidth) / 1280;
canvas.width = 1280 * scale;
canvas.height = 720 * scale;

const collisionCanvas = document.getElementById("collisionCanvas");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = canvas.width;
collisionCanvas.height = canvas.height;

window.addEventListener("load", () => {
  document.getElementById("preloader").style.display = "none";
  document.getElementById("game-start").style.display = "block";
});

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

function startGame() {
  ctx.font = "50px Impact";
  let score = 0;
  let gameOver = false;

  let timeToNextRaven = 0;
  let ravenInterval = 500;
  let lastTime = 0;

  let ravens = [];
  let explosions = [];
  let particles = [];

  function drawScore() {
    ctx.save();
    ctx.font = "48px Impact";
    ctx.fillStyle = "black";
    ctx.fillText("Score " + score, 50, 70);
    ctx.fillStyle = "white";
    ctx.fillText("Score " + score, 52, 72);
    ctx.restore();
  }

  function handleGameOver() {
    document.getElementById("game-over").style.display = "block";
    gameOverSound.play();
  }
  // shoot ravens event
  window.addEventListener("click", function (e) {
    ctx.fillRect(e.offsetX, e.offsetY, 100, 100);
    const detectPixelColor = collisionCtx.getImageData(
      e.offsetX,
      e.offsetY,
      1,
      1
    );
    const pc = detectPixelColor.data;
    ravens.forEach((raven) => {
      if (raven.randomColors.toString() + ",255" === pc.toString()) {
        raven.markedForDeletion = true;
        score += 1;
        explosions.push(
          new Explosion(raven.x, raven.y, raven.width, raven.height)
        );
      }
    });
  });

  let gameTimer = 0;
  let fps = 144;
  let gameInterval = 1000 / fps;

  function animate(timestamp = 0) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    gameTimer += deltaTime;
    if (gameTimer > gameInterval) {
      gameTimer = 0;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      collisionCtx.clearRect(0, 0, canvas.width, canvas.height);

      timeToNextRaven += deltaTime;
      if (timeToNextRaven > ravenInterval) {
        ravens.push(new Raven({ canvas, ctx, collisionCtx }));
        ravens.sort(function (a, b) {
          return a.width - b.width;
        });
        timeToNextRaven = 0;
      }

      drawScore();

      [...particles, ...ravens, ...explosions].forEach((object) => {
        object.update(deltaTime);
        if (object.x + object.width < 0) gameOver = true;
      });
      [...particles, ...ravens, ...explosions].forEach((object) =>
        object.draw({ ctx, collisionCtx })
      );
      ravens = ravens.filter((raven) => !raven.markedForDeletion);
      explosions = explosions.filter(
        (explosion) => !explosion.markedForDeletion
      );
      particles = particles.filter((particle) => !particle.markedForDeletion);
    }

    if (!gameOver) requestAnimationFrame(animate);
    else handleGameOver();
  }
  animate();
}
