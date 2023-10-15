/**@type {HTMLCanvasElement} */
const shootSound = new Audio();
shootSound.src = 'cg1.wav';
const gameOverSound = new Audio();
gameOverSound.src = 'GameOver.wav';

window.addEventListener("load", () => {
  document.getElementById('preloader').style.display = 'none';
  document.getElementById('game-start').style.display = 'block';  
});

const startButton = document.getElementById('start-btn');
startButton.addEventListener('click', () => {
  document.getElementById('game-start').style.display = 'none';
  shootSound.play();
  startGame();
})

const restartButton = document.getElementById('restart-btn');
restartButton.addEventListener('click', () => {
  document.getElementById('game-over').style.display = 'none';
  shootSound.play();
  startGame();
})

function startGame() {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const collisionCanvas = document.getElementById("collisionCanvas");
  const collisionCtx = collisionCanvas.getContext("2d");
  collisionCanvas.width = window.innerWidth;
  collisionCanvas.height = window.innerHeight;

  ctx.font = "50px Impact";
  let score = 0;
  let gameOver = false;

  let ravens = [];
  let timeToNextRaven = 0;
  let ravenInterval = 500;
  let lastTime = 0;

  class Raven {
    constructor() {
      this.spriteWidth = 271;
      this.spriteHeight = 194;
      this.sizeModifier = Math.random() * 0.6 + 0.3;
      this.width = this.spriteWidth * this.sizeModifier;
      this.height = this.spriteHeight * this.sizeModifier;
      this.x = canvas.width;
      this.y = Math.random() * (canvas.height - this.height);
      this.directionX = Math.random() * 5 + 3;
      this.directionY = Math.random() * 5 - 2.5;
      this.markedForDeletion = false;
      this.image = new Image();
      this.image.src = "raven.png";
      this.frame = 0;
      this.maxFrame = 6;
      this.flySpeed = 0.5;
      this.timeSinceFlap = 0;
      this.flapInterval = Math.random() * 50 + 50;
      this.randomColors = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
      ];
      this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
    }

    update(deltaTime) {
      this.x -= this.directionX * this.flySpeed;
      if (this.x < 0 - this.width) this.markedForDeletion = true;

      if (this.y < 0 || this.y > canvas.height - this.height)
        this.directionY *= -1;
      this.y += this.directionY * this.flySpeed;

      this.timeSinceFlap += deltaTime;
      if (this.timeSinceFlap > this.flapInterval) {
        this.frame++;
        this.frame = this.frame % this.maxFrame;
        this.timeSinceFlap = 0;
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(
              this.x + this.width / 2,
              this.y + this.height / 2,
              this.width,
              "#ccc"
            )
          );
        }
      }
    }

    draw() {
      collisionCtx.fillStyle = this.color;
      collisionCtx.fillRect(this.x, this.y, this.width, this.height);
      ctx.drawImage(
        this.image,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  let explosions = [];
  class Explosion {
    constructor(x, y, width, height) {
      this.image = new Image();
      this.image.src = "boom.png";
      this.spriteWidth = 200;
      this.spriteHeight = 179;
      this.width = width;
      this.height = (this.spriteHeight / this.spriteWidth) * width;
      this.x = x;
      this.y = y;
      this.frame = 0;
      this.maxFrame = 5;
      this.sound = new Audio();
      this.sound.src = "cg1.wav";
      this.timeSinceLastFame = 0;
      this.frameInterval = 200;
      this.markedForDeletion = false;
      this.angle = Math.random() * 180;
    }

    update(deltaTime) {
      if (this.frame === 0) this.sound.play();
      this.timeSinceLastFame += deltaTime;
      if (this.timeSinceLastFame > this.frameInterval) {
        this.frame++;
        if (this.frame >= this.maxFrame) this.markedForDeletion = true;
        this.timeSinceLastFame = 0;
      }
    }
    draw() {
      ctx.drawImage(
        this.image,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  let particles = [];
  class Particle {
    constructor(x, y, size, color) {
      this.size = size;
      this.x = x + (Math.random() * size) / 5 - size / 10;
      this.y = y + (Math.random() * size) / 5 - size / 10;
      this.radius = (Math.random() * this.size) / 100 + this.size / 100;
      this.maxRadius = Math.random() * 10 + 10;
      this.markedForDeletion = false;
      this.speedX = Math.random() * 1 + 0.5;
      this.color = color;
    }

    update() {
      this.x += this.speedX;
      this.radius += 0.1;
      if (this.radius > this.maxRadius) this.markedForDeletion = true;
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.globalAlpha = 1.5 - this.radius / this.maxRadius;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawScore() {
    ctx.fillStyle = "black";
    ctx.fillText("Score " + score, 50, 70);
    ctx.fillStyle = "white";
    ctx.fillText("Score " + score, 52, 72);
  }

  function handleGameOver() {
    document.getElementById('game-over').style.display = 'block';
    gameOverSound.play();
  }
  // shoot ravens event
  window.addEventListener("click", function (e) {
    const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
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

  function animate(timestamp = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltaTime;

    if (timeToNextRaven > ravenInterval) {
      ravens.push(new Raven());
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
    [...particles, ...ravens, ...explosions].forEach((object) => object.draw());
    ravens = ravens.filter((raven) => !raven.markedForDeletion);
    explosions = explosions.filter((explosion) => !explosion.markedForDeletion);
    particles = particles.filter((particle) => !particle.markedForDeletion);

    if (!gameOver) requestAnimationFrame(animate);
    else handleGameOver();
  }
  animate();
}
