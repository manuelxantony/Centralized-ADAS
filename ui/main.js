// carRegister call to server
// when car moves, callCarMoves to server

const canvas = document.getElementById("roadCanvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const car = new Car(100, 100, 30, 50);
car.draw(ctx);
