import Sprite from './sprite.js';

class Ball extends Sprite {
  constructor(x = 0, y = 0, dx = 2, dy = -2, radius = 10, color = 'red') {
    super(x, y, radius * 2, radius * 2, color);

    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  render(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }
}
export default Ball;
