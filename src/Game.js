import { Raven } from "./classes/Raven.js";
import { Explosion } from "./classes/Explosion.js";

export class Game {
  constructor({ canvas, ctx, collisionCanvas, collisionCtx }) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.collisionCanvas = collisionCanvas;
    this.collisionCtx = collisionCtx;

    this.gameSpeed = 1;
    this.score = 0;
    this.maxLives = 5;
    this.lives = this.maxLives;
    this.gameOver = false;

    this.fps = 0;
    this.fpsDev = 144;
    this.speedRatio = 0; // is 1 if your monitor refresh is 144hz

    this.timeToNextRaven = 0;
    this.ravenInterval = 500 / this.gameSpeed;

    this.ravens = [];
    this.explosions = [];
    this.particles = [];

    this.shootSound = document.querySelector("#shootSound");
    this.shootSound.volume = 0.5;
    this.gameOverSound = document.querySelector("#gameOverSound");
    this.hitSound = document.querySelector("#hitSound");
    this.heartImage = document.querySelector("#heartImage");
    this.debug = false;

    this.toggleDebug();
    this.shootRavenEvent();
  }

  render(deltaTime) {
    this.fps = 1000 / deltaTime;
    this.speedRatio = this.fpsDev / this.fps;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.collisionCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      particle.update(deltaTime);
      particle.draw({ ctx: this.ctx });
    });

    this.ravens.forEach((raven) => {
      raven.update(deltaTime);
      raven.draw({ ctx: this.ctx, collisionCtx: this.collisionCtx });
      if (raven.x + raven.width < 0) {
        this.lives -= 1;
        this.hitSound.load();
        this.hitSound.play();
      }
    });

    if (this.lives < 1) {
      this.gameOver = true;
    }

    this.explosions.forEach((explosion) => {
      explosion.update(deltaTime);
      explosion.draw({ ctx: this.ctx });
    });

    this.spawnRavens(deltaTime);

    this.drawScore();
    this.drawLives();
    this.drawFPS();
    this.debugMode();
    this.clearUnusedObjects();
  }

  shootRavenEvent() {
    window.addEventListener("click", (e) => {
      if (this.debug) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,0,0,0.5)";
        this.ctx.arc(e.offsetX, e.offsetY, 20, 0, Math.PI * 2);
        this.ctx.fill();
      }

      const detectPixelColor = this.collisionCtx.getImageData(
        e.offsetX,
        e.offsetY,
        1,
        1
      );
      const pc = detectPixelColor.data;
      this.ravens.forEach((raven) => {
        if (raven.randomColors.toString() + ",255" === pc.toString()) {
          this.shootSound.load();
          this.shootSound.play();
          raven.markedForDeletion = true;
          this.score += 1;
          this.explosions.push(
            new Explosion(raven.x, raven.y, raven.width, raven.height)
          );
        }
      });
    });
  }

  toggleDebug() {
    window.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "d") {
        this.debug = !this.debug;
      }
    });
  }

  spawnRavens(deltaTime) {
    this.timeToNextRaven += deltaTime;
    if (this.timeToNextRaven > this.ravenInterval) {
      this.ravens.push(
        new Raven({
          game: this,
        })
      );
      this.ravens.sort((a, b) => {
        return a.width - b.width;
      });
      this.timeToNextRaven = 0;
    }
  }

  clearUnusedObjects() {
    this.ravens = this.ravens.filter((raven) => !raven.markedForDeletion);
    this.explosions = this.explosions.filter(
      (explosion) => !explosion.markedForDeletion
    );
    this.particles = this.particles.filter(
      (particle) => !particle.markedForDeletion
    );
  }

  drawScore() {
    this.ctx.save();
    this.ctx.font = `${48 * this.canvas.scale}px Impact`;
    this.ctx.fillStyle = "black";
    this.ctx.fillText(
      "Score " + this.score,
      50 * this.canvas.scale,
      70 * this.canvas.scale
    );
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      "Score " + this.score,
      52 * this.canvas.scale,
      72 * this.canvas.scale
    );
    this.ctx.restore();
  }

  drawLives() {
    for (let i = 0; i < this.lives; i++) {
      this.ctx.drawImage(
        heartImage,
        50 * this.canvas.scale + i * 40,
        90 * this.canvas.scale,
        25 * this.canvas.scale,
        25 * this.canvas.scale
      );
    }
  }

  drawFPS() {
    this.ctx.save();
    this.ctx.font = `${16 * this.canvas.scale}px Consolas`;
    this.ctx.fillStyle = "black";
    this.ctx.fillText(
      `${this.fps.toFixed(0)} fps`,
      this.canvas.width - 100 * this.canvas.scale,
      20 * this.canvas.scale
    );
    this.ctx.font = `${15.5 * this.canvas.scale}px Consolas`;
    this.ctx.fillStyle = "white";
    this.ctx.fillText(
      `${this.fps.toFixed(0)} fps`,
      this.canvas.width - 100 * this.canvas.scale + 0.1,
      20 * this.canvas.scale + 0.1
    );
    this.ctx.restore();
  }

  debugMode() {
    if (this.debug) {
      this.collisionCanvas.style.opacity = 1;
    } else {
      this.collisionCanvas.style.opacity = 0;
    }
  }
}
