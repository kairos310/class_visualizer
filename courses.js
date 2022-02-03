console.log(classes["/comp/320"])

var divs = [];
var center;
var scl;
function setup(){
  createCanvas(window.innerWidth, window.innerHeight)
  background(30);

  scl = 1;

  divs[0] = new Course(0, random(window.innerWidth), random(window.innerHeight), [1])
  for(var i = 1; i < 10; i++){
    divs[i] = new Course(i, random(window.innerWidth), random(window.innerHeight), [i - 1, i + 1])
  }
  divs[10] = new Course(10, 200,200, [9]);
  addConnections();
  center = createVector(window.innerWidth/2, window.innerHeight/2);
}

function draw(){

  background(52)
  //scale(scl);
  for(let d of divs){
    //d.attract();
    d.chain();
    d.avoid();
  }
  for(let d of divs){
    d.update();
    d.show();
  }

  centerOfGravity()
}

class Course{
  constructor(i,x,y,d){
    this.i = i;
    this.div = createDiv("course");
		this.div.class("course");
    this.pos = createVector(x,y);
    this.vel = createVector(0,0)
    this.acc = createVector(0,0);
    this.friction = 0.7
    this.radius = 42;
    this.drag = false;
    this.length = 200;
    this.isConnected = false;
    this.connected = d;
  }
  update(){
    this.vel.mult(this.friction)
    this.acc.mult(this.friction);
    if(this.drag){
      this.pos = createVector(mouseX, mouseY)
    }
    this.vel.add(this.acc);
    if(this.vel.mag() > 0.2){
      this.pos.add(this.vel);
    }
    this.acc.mult(0)

  }
  show(){
    this.div.position((this.pos.x - this.radius), (this.pos.y - this.radius));

  }
  edge(side){
    if(side == "x"){
      let force = createVector(1)
    }else{
      this.vel.y *= -1;
    }
  }
  avoid(){
    for(let d of divs){
      let dist = this.pos.dist(d.pos);
      if(dist < 300 && dist > 0.0001){
        let force = p5.Vector.sub(this.pos, d.pos)
        force.setMag(this.radius/dist)
        this.acc.add(force);
      }
    }
  }
  attract(){
    let force = p5.Vector.sub(center, this.pos)
    if(this.pos.dist(center) < 0){
      force.setMag(0);
    }
    force.mult(this.pos.dist(center))
    force.mult(0.00001)
    this.acc.add(force)
  }
  chain(){
    if(this.isConnected){
      for(let d of this.connected){
        let target = p5.Vector.sub(this.pos,d.pos);
        target.setMag(this.length);
        target.add(d.pos)
        stroke(255,0,0)
        line(d.pos.x, d.pos.y, this.pos.x, this.pos.y);
        ellipse(target.x, target.y, 20,20);
        let force = p5.Vector.sub(target, this.pos);
        force.mult(0.01);
        this.acc.add(force);
      }
    }
  }
}

function centerOfGravity(){
  var average = createVector();
  for(let d of divs){
    average.add(d.pos);
  }
  average.mult(1/divs.length);
  center = average;
}

function mousePressed(){
  let m = createVector(mouseX,mouseY);
  for(let d of divs){
    if(d.pos.dist(m) < d.radius){
      d.drag = true;
    }
  }
}

function mouseReleased(){
  let m = createVector(mouseX,mouseY);
  for(let d of divs){
    if(d.pos.dist(m) < d.radius){
      d.drag = false;
    }
  }
}

function addConnections(){
  for(let d of divs){
    if(d.connected.length != 0){
      for(let i = 0; i < d.connected.length; i++){
        d.connected[i] = divs[d.connected[i]];
      }
    }
    d.isConnected = true;
  }
}

function mouseWheel(event){
  scl += 0.02 * event.delta;

}
