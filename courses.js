var divs = [];
var center;
var scl;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  background(30);

  scl = 1;
	//
  // for (var i = 0; i < 10; i++) {
  //   divs[i] = new Course(random(window.innerWidth), random(window.innerHeight))
  // }
	addNode("/comp/330", "comp 330")
	addNode("/comp/172", "comp 172")
	addNode("/comp/241", "comp 241")
	addNode("/comp/142", "comp 142")
	addNode("/comp/141", "comp 141")
	addNode("/comp/231", "comp 231")


	divs[0].link(divs[1])
	divs[1].link(divs[4])
	divs[5].link(divs[4])
	divs[2].link(divs[3])
	divs[3].link(divs[4])
	divs[5].link(divs[0])
	divs[0].link(divs[3])

  center = createVector(window.innerWidth / 2, window.innerHeight / 2);
  // for (let i = 0; i < divs.length - 1; i++) {
  //   divs[i].link(divs[i + 1])
  // }
}

function draw() {

  background(52)
  //scale(scl);
  for (let d of divs) {
    d.attract();
    d.chain();
    d.avoid();
  }
  for (let d of divs) {
    d.update();
    d.show();
  }

  centerOfGravity()
}

class Course {
  constructor(x, y, data, name) {
		this.data = data;
    this.i = divs.length;
    this.div = createDiv(name);
    this.div.class("course");
		this.div.onmouseover = "display(event)"
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0);
    this.friction = 0.7
    this.radius = 42;
    this.drag = false;
    this.length = 200;
    this.isConnected = false;
    this.connected = [];
  }
  update() {
    this.vel.mult(this.friction)
    this.acc.mult(this.friction);
    if (this.drag) {
      this.pos = createVector(mouseX, mouseY)
    }
    this.vel.add(this.acc);
    if (this.vel.mag() > 0.2) {
      this.pos.add(this.vel);
    }
    this.acc.mult(0)

  }
  show() {
    this.div.position((this.pos.x - this.radius) * scl, (this.pos.y - this.radius) * scl);
  }
  edge(side) {
    if (side == "x") {
      let force = createVector(1)
    } else {
      this.vel.y *= -1;
    }
  }
  avoid() {
    for (let d of divs) {
      let dist = this.pos.dist(d.pos);
      if (dist < 300 && dist > 0.0001) {
        let force = p5.Vector.sub(this.pos, d.pos)
        force.setMag(this.radius / dist)
        this.acc.add(force);
      }
    }
  }
  attract() {
    let force = p5.Vector.sub(center, this.pos)
    if (this.pos.dist(center) < 0) {
      force.setMag(0);
    }
    force.mult(this.pos.dist(center))
    force.mult(0.00001)
    this.acc.add(force)
  }
  chain() {
    if (this.isConnected) {
      for (let d of this.connected) {
        let target = p5.Vector.sub(this.pos, d.pos);
        target.setMag(this.length);
        target.add(d.pos)
        stroke(255, 0, 0)

        line(d.pos.x * scl, d.pos.y * scl, this.pos.x * scl, this.pos.y * scl);
        ellipse(target.x * scl, target.y * scl, 20 * scl, 20 * scl);

        let force = p5.Vector.sub(target, this.pos);
        force.mult(0.02);
        this.acc.add(force);
      }
    }
  }
  link(d) {
    d.isConnected = true;
    this.isConnected = true;

    this.connected.push(d);
    d.connected.push(this);
  }
	populate(){
		for(let p of this.data.prerequisites){
			let n = addNode(p, p)
			this.link(n)
		}
	}
}

function centerOfGravity() {
  var average = createVector();
  for (let d of divs) {
    average.add(d.pos);
  }
  average.mult(1 / divs.length);
  center = average;
}

function mousePressed() {
  let m = createVector(mouseX * scl, mouseY * scl);
  for (let d of divs) {
    if (d.pos.dist(m) < d.radius) {
      d.drag = true;
    }
  }
}


function mouseReleased() {
  let m = createVector(mouseX * scl, mouseY * scl);
  for (let d of divs) {
    if (d.pos.dist(m) < d.radius) {
      d.drag = false;
    }
  }
}

function addConnections() {
  for (let d of divs) {
    if (d.connected.length != 0) {
      for (let i = 0; i < d.connected.length; i++) {
        d.connected[i] = divs[d.connected[i]];
      }
    }
    d.isConnected = true;
  }
}

function mouseWheel(event) {
  scl += 0.02 * event.delta;
}

function initCourses(){

}
