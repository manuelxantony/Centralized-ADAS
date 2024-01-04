class Car {
  // x and y are the position of the car
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.controls = new Controls();
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.rect(
      this.x - this.width / 2, // we are making x and y at the center of the car
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.fill();
  }
}
