export class Particle {
  constructor({ x, y, size, color, game }) {
    this.game = game;
    this.size = size * this.game.canvas.scale;
    this.x = x + (Math.random() * size) / 5 - size / 10;
    this.y = y + (Math.random() * size) / 5 - size / 10;
    this.radius = (Math.random() * this.size) / 100 + this.size / 100;
    this.maxRadius = Math.random() * 10 + 10;
    this.maxRadius *= this.game.canvas.scale;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.speedX =
      this.speedX *
      this.game.speedRatio *
      this.game.gameSpeed *
      this.game.canvas.scale;
    this.speedRadius =
      0.1 * this.game.speedRatio * this.game.gameSpeed * this.game.canvas.scale;
    this.color = color;
  }

  update() {
    this.updateGameSpeed();

    this.x += this.speedX;
    this.radius += this.speedRadius;
    if (this.radius > this.maxRadius) this.markedForDeletion = true;
  }

  draw({ ctx }) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1.5 - this.radius / this.maxRadius;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  updateGameSpeed(){
    if(this.game.gameSpeedNeedUpdate.particle) {
      this.game.gameSpeedNeedUpdate.particle = false;
      console.log('update particle speed');      
      this.speedX *= this.game.gameSpeed;
      this.speedRadius *= this.game.gameSpeed;
    }
  }
}
