import Paddle from './paddle.js';
import Ball from './ball.js';
import Bricks from './bricks.js';
import GameLabel from './gameLabel.js';

class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.ballRadius = 10;
    this.paddleHeight = 10;
    this.paddleWidth = 75;
    this.brickRowCount = 5;
    this.brickColumnCount = 10;
    this.brickHeight = 20;
    this.brickPadding = 10;
    this.brickOffsetTop = 30;
    this.brickOffsetLeft = 30;
    // eslint-disable-next-line max-len
    this.brickWidth = (this.canvas.width - (this.brickPadding * this.brickColumnCount) - this.brickOffsetLeft) / this.brickColumnCount;
    this.paddleXStart = (this.canvas.width - this.paddleWidth) / 2;
    this.paddleYStart = this.canvas.height - this.paddleHeight;
    this.PI2 = Math.PI * 2;
    this.objectColor = '#0095DD';
    this.gameOverMessage = 'Game Over';

    this.ball = new Ball(0, 0, 2, -2, this.ballRadius, this.objectColor);
    this.paddle = new Paddle(this.paddleXStart,
      this.paddleYStart, this.paddleWidth, this.paddleHeight,
      this.objectColor);
    this.bricks = new Bricks({
      cols: this.brickColumnCount,
      rows: this.brickRowCount,
      width: this.brickWidth,
      height: this.brickHeight,
      padding: this.brickPadding,
      offsetLeft: this.brickOffsetLeft,
      offsetTop: this.brickOffsetTop,
      color: this.objectColor,
    });
    this.scoreLabel = new GameLabel('Score: ', 8, 20);
    this.livesLabel = new GameLabel('Lives: ', this.canvas.width - 65, 20);

    this.rightPressed = false;
    this.leftPressed = false;

    this.setup();

    this.draw();
  }

  setup() {
    this.livesLabel.value = 3;
    this.resetBallAndPaddle();
    document.addEventListener('keydown', (e) => { this.keyDownHandler(e); }, false);
    document.addEventListener('keyup', (e) => { this.keyUpHandler(e); }, false);
    document.addEventListener('mousemove', (e) => { this.mouseMoveHandler(e); }, false);
  }

  resetBallAndPaddle() {
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height - 30;
    this.ball.dx = 2;
    this.ball.dy = -2;
    this.paddle.x = this.paddleXStart;
  }

  collisionDetection() {
    for (let c = 0; c < this.bricks.cols; c += 1) {
      for (let r = 0; r < this.bricks.rows; r += 1) {
        const brick = this.bricks.bricks[c][r];
        if (brick.status === 1) {
          if (this.ball.x > brick.x
                && this.ball.x < brick.x + this.brickWidth
                && this.ball.y > brick.y && this.ball.y < brick.y + this.brickHeight) {
            this.ball.dy = -this.ball.dy;
            brick.status = 0;
            this.scoreLabel.value += 1;
            if (Math.sign(this.ball.dy) === 1) {
              this.ball.dy += 0.1;
            } else {
              this.ball.dy -= 0.1;
            }
            if (Math.sign(this.ball.dx) === 1) {
              this.ball.dx += 0.1;
            } else {
              this.ball.dx -= 0.1;
            }

            if (this.scoreLabel.value === this.bricks.cols * this.bricks.rows) {
              alert('You Win');
              document.location.reload();
            }
          }
        }
      }
    }
  }

  movePaddle() {
    if (this.rightPressed && this.paddle.x < this.canvas.width - this.paddle.width) {
      this.paddle.moveBy(7, 0);
    } else if (this.leftPressed && this.paddle.x > 0) {
      this.paddle.moveBy(-7, 0);
    }
  }

  collisionsWithCanvasAndPaddle() {
    if (this.ball.x + this.ball.dx > this.canvas.width - this.ball.radius
        || this.ball.x + this.ball.dx < this.ball.radius) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y + this.ball.dy < this.ball.radius) {
      this.ball.dy = -this.ball.dy;
    } else if (this.ball.y + this.ball.dy > this.canvas.height - this.ball.radius) {
      if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + (this.paddle.width / 2)) {
        if (Math.sign(this.ball.dx) === 1) {
          this.ball.dx = -this.ball.dx;
        }
        this.ball.dy = -this.ball.dy;
      // eslint-disable-next-line max-len
      } else if (this.ball.x > this.paddle.x + (this.paddle.width / 2) && this.ball.x < this.paddle.x + this.paddle.width) {
        if (Math.sign(this.ball.dx) === -1) {
          this.ball.dx = -this.ball.dx;
        }
        this.ball.dy = -this.ball.dy;
      } else {
        this.livesLabel.value -= 1;
        if (this.livesLabel.value < 1) {
          alert('game over');
          this.ball.x = 200;
          this.ball.y = 200;
          document.location.reload();
        } else {
          this.resetBallAndPaddle();
        }
      }
    }
  }

  keyDownHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = true;
    } else if (e.keyCode === 37) {
      this.leftPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode === 39) {
      this.rightPressed = false;
    } else if (e.keyCode === 37) {
      this.leftPressed = false;
    }
  }

  mouseMoveHandler(e) {
    const relativeX = e.clientX - this.canvas.offsetLeft;
    if (relativeX > 0 && relativeX < this.canvas.width) {
      this.paddle.moveTo(relativeX - this.paddle.width / 2, this.paddleYStart);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.bricks.render(this.ctx);
    this.ball.render(this.ctx);
    this.paddle.render(this.ctx);
    this.scoreLabel.render(this.ctx);
    this.livesLabel.render(this.ctx);
    this.collisionDetection();
    this.ball.move();
    this.movePaddle();
    this.collisionsWithCanvasAndPaddle();

    requestAnimationFrame(() => {
      this.draw();
    });
  }
}
export default Game;
