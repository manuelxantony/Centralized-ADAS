class Car {
  // x and y are the position of the car
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.03;
    this.angle = 0;

    this.controls = new Controls();
  }

  update() {
    this.#move();
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }
    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }
    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    // to handle cases where speed lesser than friction but not zero
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    // for controlling reverse controllers properly
    // also only when speed is not equalto zero because we dont want car to spin from the same axis
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += this.friction * flip;
      }
      if (this.controls.right) {
        this.angle -= this.friction * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    ctx.save();
    // translating at the center of the car
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(
      // no x and y is here because we are already seeting x and y while translating above.
      -this.width / 2, // we are making x and y at the center of the car
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
    ctx.restore();
  }
}
