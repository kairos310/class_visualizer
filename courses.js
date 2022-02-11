var divs = [];
var center;
var scl;
var curr;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  background(29);

  scl = 1;

  // for (var i = 0; i < 10; i++) {
  //   divs[i] = new Course(random(window.innerWidth), random(window.innerHeight))
  // }
	/*
	addNode(classes["/comp/330"], "/comp/330")
	addNode(classes["/comp/172"], "/comp/172")
	addNode(classes["/comp/241"], "/comp/241")
	addNode(classes["/comp/142"], "/comp/142")
	addNode(classes["/comp/141"], "/comp/141")
	addNode(classes["/comp/231"], "/comp/231")


	divs[0].link(divs[1])
	divs[1].link(divs[4])
	divs[5].link(divs[4])
	divs[2].link(divs[3])
	divs[3].link(divs[4])
	divs[5].link(divs[0])
	divs[0].link(divs[3])*/

  center = createVector(window.innerWidth / 2, window.innerHeight / 2);
  // for (let i = 0; i < divs.length - 1; i++) {
  //   divs[i].link(divs[i + 1])
  // }
}

function draw() {
  background(52)
  //scale(scl);

  for (let d of divs) {
    d.attract(); 			//attracts divs to the center of mass
    d.chain(); 				//moves divs based on links
    d.avoid();				//avoid each other
  }
  for (let d of divs) {
    d.update();				//update in separate loop to finish calculations before updating
    d.show();					//display elements
  }
	if(divs.length > 0){
  	centerOfGravity()	//calculate average position of all, giving center of mass
	}
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

class Course {
  constructor(x, y, data, name) {
		this.data = data;									//object that holds class information
    this.i = divs.length;							//current index ##### needs testing

		this.name = name;
    this.div = createDiv(name.replaceAll("/", " "));				//creates div with p5
    this.div.class("course");					//gives it class course for css
		this.div.id(this.i)
		this.div.mouseOver(description);
		//this.div.mouseOut(hide);

		//init physics
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0)
    this.acc = createVector(0, 0);
    this.friction = 0.7
    this.radius = 42;
		//if mouse is over and dragging it
    this.drag = false;
		//link lengths
    this.length = 200;
		//if connected to another div
    this.isConnected = false;
		//array of connected divs
    this.connected = [];
		this.prerequisites = [];
		this.taken = false;

		if(this.taken){
			this.div.elt.style.background = "var(--blue)"
			this.div.elt.style.color = "var(--light)"
		}else if(this.data.semester.includes(",")){
			this.div.elt.style.background = "var(--both)"
		}else if(this.data.semester.includes("Spring")){
			this.div.elt.style.background = "var(--spring)"
		}else if(this.data.semester.includes("Fall")){
			this.div.elt.style.background = "var(--fall)"
		}
  }
  update() {
		//physics loop
		this.vel.mult(this.friction)
    this.acc.mult(this.friction);
    if (this.drag) {
      this.pos = createVector(mouseX, mouseY)
    }
    this.vel.add(this.acc);

		//dampen small motion, reduce jitter
		if (this.vel.mag() > 0.3) {
      this.pos.add(this.vel);
    }
		//reset acceleration
    this.acc.mult(0)

  }
  show() {
		//sets css position of div
    this.div.position((this.pos.x - this.radius) * scl, (this.pos.y - this.radius) * scl);
		if(this.isConnected){
			for(let p of this.prerequisites){
				drawArrow(p.pos, p5.Vector.sub(this.pos, p.pos), color(87, 115, 153))
			}
		}
  }
  avoid() {
		//loop through all divs
    for (let d of divs) {
			//get distance from each other
      let dist = this.pos.dist(d.pos);
			//if meets threshhold force in opposite direction
      if (dist < this.length && dist > 0.0001) {
        let force = p5.Vector.sub(this.pos, d.pos)
        force.setMag(this.radius / dist);
				force.mult(1);
        this.acc.add(force);
      }
    }
  }
  attract() {
		//generate force towards center of mass
    let force = p5.Vector.sub(center, this.pos)
    if (this.pos.dist(center) < 0) {
      force.setMag(0);
    }
    force.mult(this.pos.dist(center))
    force.mult(0.00001)
    this.acc.add(force)
  }
  chain() {
		//check if connected
    if (this.isConnected) {
			//for all that its connected to
      for (let d of this.connected) {
				//calculate target
        let target = p5.Vector.sub(this.pos, d.pos);
        target.setMag(this.length);
        target.add(d.pos)
				//spring force
        let force = p5.Vector.sub(target, this.pos);
        force.mult(0.005);
        this.acc.add(force);

				//draw lines
				/*
				drawArrow(this.pos, d.pos, color(255,255,0))
        line(d.pos.x * scl, d.pos.y * scl, this.pos.x * scl, this.pos.y * scl);
        ellipse(target.x * scl, target.y * scl, 20 * scl, 20 * scl);
				*/

      }
    }
  }
  link(d) {
		//sets connected to true, adds other div to array of connected divs
    d.isConnected = true;
    this.isConnected = true;

    this.connected.push(d);
    d.connected.push(this);
		this.prerequisites.push(d);

  }
	populate(){
		//adds all prerequisite nodes
		for(let p of this.data.prerequisites){
			for(let d of divs){
				if(p != d.name){
					let n = addNode(classes[p], p)
					this.link(n)
				}else{
					this.link(d)
				}
			}
		}
	}
	checkTaken(){

		if(this.taken){
			this.div.elt.style.background = "var(--blue)"
			this.div.elt.style.color = "var(--light)"
		}else if(this.data.semester.includes(",")){
			this.div.elt.style.background = "var(--both)"
		}else if(this.data.semester.includes("Spring")){
			this.div.elt.style.background = "var(--spring)"
		}else if(this.data.semester.includes("Fall")){
			this.div.elt.style.background = "var(--fall)"
		}
	}
}

function centerOfGravity() {
	//get average position
  var average = createVector();
  for (let d of divs) {
    average.add(d.pos);
  }
  average.mult(1 / divs.length);
  center = average;
}

//get mouse factored in scale, sets drag to true and position matches mouse
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

//scale
/*
function mouseWheel(event) {
  scl += 0.02 * event.delta;
}*/

function description(event){
	let d = document.getElementById('description');
	d.style.display = "block";
	let selection = event.target.innerText;
	let output = "/" + selection.replace(/\s/gi, "/");
	d.innerHTML = classes[output].course +"<br><br>" + classes[output].description + "<br><br> Semester: <br>" + classes[output].semester.toString() + "<br><br>";
	var temp = document.getElementsByTagName("template")[0];
  var clon = temp.content.cloneNode(true);
  d.appendChild(clon);
	curr = event.target.id;
}

function hide(){
	let d = document.getElementById('description');
	d.style.display = "none";
}


function addNode(data, name){
	let added = false;
	let existingNode;
	for(let d of divs){
		if(d.name == name){
			added = true;
			existingNode = d;
		}
	}
	if(!added){
		let c = new Course(random(200) + window.innerWidth/2 - 100, random(200) + window.innerHeight/2 - 100, data, name)
		divs.push(c)
		c.populate()
		return c;
	}else{
		return existingNode;
	}
}

function drawArrow(base, vec, myColor) {
	push();
		stroke(myColor);
		strokeWeight(3);
		fill(myColor);
		translate(base.x, base.y);
		vec.mult(0.7);
		line(0, 0, vec.x, vec.y);
		rotate(vec.heading());
		let arrowSize = 7;
		translate(vec.mag() - arrowSize, 0);
		triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
	pop();
}

function toggle(event){
	divs[curr].taken = event.target.checked
	divs[curr].checkTaken();
}
