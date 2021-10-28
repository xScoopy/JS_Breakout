class Bricks {
  constructor(cols, rows, defWidth, defHeight, offLeft, offTop, padding) {
    this.cols = cols;
    this.rows = rows;
    this.defWidth = defWidth;
    this.defHeight = defHeight;
    this.offLeft = offLeft;
    this.offTop = offTop;
    this.padding = padding;
    this.bricks = [];
    this.init();
  }

  init() {
    for (let c = 0; c < this.cols; c += 1) {
      this.bricks[c] = [];
      for (let r = 0; r < this.rows; r += 1) {
        const brickX = (c * (this.defWidth + this.padding)) + this.offLeft;
        const brickY = (r * (this.defHeight + this.padding)) + this.offTop;
        this.bricks[c][r] = new Bricks(brickX, brickY, this.defWidth, this.defHeight, this.color);
      }
    }
  }

  render(ctx) {
    for (let c = 0; c < this.cols; c += 1) {
      for (let r = 0; r < this.rows; r += 1) {
        const brick = this.bricks[c][r];
        if (brick.status === 1) {
          brick.render(ctx);
        }
      }
    }
  }
}

export default Bricks;
