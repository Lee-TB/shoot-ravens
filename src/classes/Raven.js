import { Particle } from "./Particle.js";

export class Raven {
  constructor({ game }) {
    this.game = game;
    this.canvas = game.canvas;
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.3;
    this.width = this.spriteWidth * this.sizeModifier * this.canvas.scale;
    this.height = this.spriteHeight * this.sizeModifier * this.canvas.scale;
    this.x = this.canvas.width;
    this.y = Math.random() * (this.canvas.height - this.height);
    this.velocityX =
      (Math.random() + 2) * this.canvas.scale * this.game.gameSpeed;
    this.velocityY =
      (Math.random() * 4 - 2) * this.canvas.scale * this.game.gameSpeed;
    this.markedForDeletion = false;
    this.image = ravenImage;
    this.frame = 0;
    this.maxFrame = 6;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 25 + 25;
    this.randomColors = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    ];
    this.color = `rgb(${this.randomColors[0]}, ${this.randomColors[1]}, ${this.randomColors[2]})`;
    this.adaptSpeedByDevice();
  }

  update(deltaTime) {
    this.x -= this.velocityX;
    if (this.x < 0 - this.width) this.markedForDeletion = true;

    if (this.y < 0 || this.y > this.canvas.height - this.height)
      this.velocityY *= -1;
    this.y += this.velocityY;

    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      this.frame++;
      this.frame = this.frame % this.maxFrame;
      this.timeSinceFlap = 0;
      for (let i = 0; i < 2; i++) {
        this.game.particles.push(
          new Particle(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width,
            "#4F4A45"
          )
        );
      }
    }
  }

  draw({ ctx, collisionCtx }) {
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

  adaptSpeedByDevice() {
    this.velocityX *= this.game.speedRatio;
    this.velocityY *= this.game.speedRatio;
  }
}
