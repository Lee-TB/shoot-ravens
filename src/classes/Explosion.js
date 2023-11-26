export class Explosion {
  constructor(x, y, width, height) {
    this.image = boomImage;
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = width;
    this.height = (this.spriteHeight / this.spriteWidth) * width;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.maxFrame = 5;
    this.timeSinceLastFame = 0;
    this.frameInterval = 50;
    this.markedForDeletion = false;
    this.angle = Math.random() * 180;
  }

  update(deltaTime) {
    this.timeSinceLastFame += deltaTime;
    if (this.timeSinceLastFame > this.frameInterval) {
      this.frame++;
      if (this.frame >= this.maxFrame) this.markedForDeletion = true;
      this.timeSinceLastFame = 0;
    }
  }
  draw({ ctx }) {
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
