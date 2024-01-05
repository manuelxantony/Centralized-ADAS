// carRegister call to server
// when car moves, callCarMoves to server

const canvas = document.getElementById("roadCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);
  // requests the browser to call a user-supplied callback function before the next repaint.
  requestAnimationFrame(animate); // this function registers animate function and run it
}
