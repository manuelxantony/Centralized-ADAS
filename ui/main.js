// carRegister call to server
// when car moves, callCarMoves to server

const canvas = document.getElementById("roadCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
// const car =
const traffic = [
  new Car("car1", road.getLaneCenter(1), 200, 20, 30, 2, "red"),
  new Car("car2", road.getLaneCenter(0), 50, 20, 30, 2, "blue"),
  new Car("car3", road.getLaneCenter(1), -150, 20, 30, 3, "green"),
];
animate();

function animate() {
  // car.update(road.borders);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, traffic);
  }

  canvas.height = window.innerHeight;

  ctx.save();
  // for keeping car at 70% of canvas and to move road
  ctx.translate(0, -200 + canvas.height * 0.9);

  road.draw(ctx);
  //car.draw(ctx, "red");
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx, traffic[i].color);
  }

  ctx.restore();

  // requests the browser to call a user-supplied callback function before the next repaint.
  requestAnimationFrame(animate); // this function registers animate function and run it
}
