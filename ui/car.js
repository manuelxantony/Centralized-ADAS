class Car {
  // x and y are the position of the car
  constructor(id, x, y, width, height, maxSpeed, color = "blue") {
    //
    this.id = id;

    // car postion on road
    this.x = x;
    this.y = y;

    // car dimension
    this.width = width;
    this.height = height;

    this.color = color;

    // car movement metrics
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.03;
    this.angle = 0;
    this.damaged = false;

    // car sensor
    this.sensor = new Sensor(this);
    // car control
    this.controls = new Controls();

    // creating car shape
    this.polygon = this.#createPolygon();

    this.otherCarsTraffic = [];

    // register car in the server
    this.#registerCar(this.id);
  }

  // register car in the server
  async #registerCar(id) {
    const result = await registerCar(id);
    if (result) {
      this.controls.forward = true;
    }
  }

  update(roadBorders, traffic) {
    this.otherCarsTraffic = traffic.filter((t) => {
      return this.id != t.id;
    });
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon(); // here we are updating car shape
      this.damaged = this.#assessDamage(roadBorders, this.otherCarsTraffic);
    }
    this.sensor.update(roadBorders, this.otherCarsTraffic);
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  // creating shape of the car
  // we are using polygon to get the exact borders of the car
  // which can be later used for detecting a collision
  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    // top right
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    // top left
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    // bottom left
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    // bottom right
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });

    return points;
  }

  // server call should be from herer after registering
  // forward and stop instruction will be coming here
  #move() {
    // this is a temp fix
    if (this.sensor.touched) {
      this.controls.forward = false;
      this.speed -= this.acceleration / 2;
    }

    // we are setting the forward movement of car by default
    //this.controls.forward = true;
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

  draw(ctx, color) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }

    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    this.sensor.draw(ctx);
  }
}

// more like can register car and register it
async function registerCar(id) {
  try {
    const response = await fetch("http://localhost:8080/car/register", {
      method: "POST",
      body: JSON.stringify({ id: id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    console.log(result);
    return true;
    // this.controls.forward = true;
  } catch (error) {
    console.error("Error: ", error);
  }
  return false;
}
