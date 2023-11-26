/**@type {HTMLCanvasElement} */
import { Raven } from "./src/classes/Raven.js";
import { Explosion } from "./src/classes/Explosion.js";

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

const shootSound = document.querySelector("#shootSound");
const gameOverSound = document.querySelector("#gameOverSound");

window.addEventListener("load", () => {
  document.getElementById("preloader").style.display = "none";
  document.getElementById("game-start").style.display = "block";
});

function startGame() {
  let score = 0;
  let gameOver = false;

  let timeToNextRaven = 0;
  let ravenInterval = 500;
  let lastTime = 0;

  let ravens = [];
  let explosions = [];
  let particles = [];

  let debug = false;

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d") {
      debug = !debug;
    }
  });

  function debugMode() {
    if (debug) {
      collisionCanvas.style.opacity = 1;
    } else {
      collisionCanvas.style.opacity = 0;
    }
  }

  function drawScore() {
    ctx.save();
    ctx.font = `${48 * canvas.scale}px Impact`;
    ctx.fillStyle = "black";
    ctx.fillText("Score " + score, 50 * canvas.scale, 70 * canvas.scale);
    ctx.fillStyle = "white";
    ctx.fillText("Score " + score, 52 * canvas.scale, 72 * canvas.scale);
    ctx.restore();
  }

  function drawFPS(fps) {
    ctx.save();
    ctx.font = `${16 * canvas.scale}px Consolas`;
    ctx.fillStyle = "black";
    ctx.fillText(
      `${fps} fps`,
      canvas.width - 100 * canvas.scale,
      20 * canvas.scale
    );
    ctx.fillStyle = "white";
    ctx.fillText(
      `${fps} fps`,
      canvas.width - 100 * canvas.scale + 1,
      20 * canvas.scale + 1
    );
    ctx.restore();
  }

  function handleGameOver() {
    document.getElementById("game-over").style.display = "block";
    gameOverSound.play();
  }

  // shoot ravens event
  window.addEventListener("click", function (e) {
    if (debug) {
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,0,0,0.5)";
      ctx.arc(e.offsetX, e.offsetY, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    const detectPixelColor = collisionCtx.getImageData(
      e.offsetX,
      e.offsetY,
      1,
      1
    );
    const pc = detectPixelColor.data;
    ravens.forEach((raven) => {
      if (raven.randomColors.toString() + ",255" === pc.toString()) {
        shootSound.load();
        shootSound.play();
        raven.markedForDeletion = true;
        score += 1;
        explosions.push(
          new Explosion(raven.x, raven.y, raven.width, raven.height)
        );
      }
    });
  });

  let gameTimer = 0;
  let fps = 60;
  let gameInterval = 1000 / 144;
  let deltaTime = 0;

  function animate(timestamp = 0) {
    deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    if (deltaTime > 100) deltaTime = 16;

    fps = 1000 / deltaTime;

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
      drawFPS(fps.toFixed(2));
      debugMode();

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
