import Sprite from './sprite.js';

class Paddle extends Sprite {
  constructor(x, y, width, height, color = 'red') {
    super(x, y, width, height, color);
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }
}
export default Paddle;
