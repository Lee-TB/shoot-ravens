export class Particle {
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

  draw({ ctx }) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1.5 - this.radius / this.maxRadius;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
