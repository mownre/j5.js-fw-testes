var rocket;
var population;
var lifespan = 400;
var count = 0;
var gen = 1;
var saude;

var target;

var lifeP;
var genP;

function setup() {
	createCanvas(1000, 500);
	genP = createP();
	lifeP = createP();
	population = new Population();
	target = createVector(width/2, 50);
}

function draw() {
	background(0);
	population.run();
	genP.html("Geração: "  + gen);
	lifeP.html(count);
	count++;
	
	if(count == lifespan) {
		population.evaluate();
		population.selection();	
		count = 0;
		acertos = 0;
		gen++;
	}



	ellipse(target.x, target.y, 16, 16)

}


function DNA(genes) {

	if(genes) {
		this.genes = genes;
	} else {	
		this.genes = [];
		for(var i = 0; i < lifespan; i++) {
			this.genes[i] = p5.Vector.random2D();
			this.genes[i].setMag(0.2);
		}
	}

	this.crossover = function(partnerDNA) {
		var newgenes = [];
		var mid = floor(random(this.genes.length));

		for(var i = 0; i < this.genes.length; i++) {
			if(i > mid) {
				newgenes[i] = this.genes[i];
			} else {
				newgenes[i] = partnerDNA.genes[i];
			}
		}

		return new DNA(newgenes);
	}

	this.mutation = function() {
		for(var i = 0; i < this.genes.length; i++) {
			if(random(1) < 0.02) {
				this.genes[i] = p5.Vector.random2D();
				this.genes[i].setMag(0.1);

			}

		}
	}
}


function Population() {
	this.rockets = [];
	this.populationSize = 100;
	
	for(var i = 0; i < this.populationSize; i++) {
		this.rockets[i] = new Rocket();
	}

	this.run = function() {
		for(var i = 0; i < this.populationSize; i++) {
			this.rockets[i].update();
			this.rockets[i].show();

		}
	}

	this.evaluate = function() {
		var maxfit = 0;
		for(var i = 0; i < this.populationSize; i++) {
			this.rockets[i].calcFitness();

			if(this.rockets[i].fitness > maxfit){
				maxfit = this.rockets[i].fitness;
			}
		}

		for(var i = 0; i < this.populationSize; i++) {
			this.rockets[i].fitness /= maxfit;
		}

		this.matingpool = [];
		for(var i = 0; i < this.populationSize; i++) {
			var n = this.rockets[i].fitness * 100;
			saude = n;
			for(var j = 0 ; j < n; j++) {
				this.matingpool.push(this.rockets[i]);
			}
		}
	}

	this.selection = function() {
		var newRockets = []; 
		for(var i = 0; i < this.rockets.length; i++) {
		//Escolhe DNA aleatorio
			var parentA = random(this.matingpool).dna;
			var parentB = random(this.matingpool).dna;
			//cria um filho com dna crossover'ed
			var child = parentA.crossover(parentB);
			child.mutation();
			newRockets[i] = new Rocket(child);
	
		}
		this.rockets = newRockets;

	}






}


var minTemp = lifespan + 1;
function Rocket(dna) {
	this.pos = createVector(width/2, height - 100);
	this.vel = createVector();
	this.acc = createVector();
	this.completed = false;
	this.temp = 0;

	if (dna) {
		this.dna = dna;
	} else {
		this.dna = new DNA();
	}

	this.fitness = 0;

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.calcFitness = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		this.fitness = map(d, 0, width, width, 0);

		if(this.completed) {
			this.fitness *= 10;	
		} else {
			this.fitness *= 0.9;
		}



		/*if(this.temp < minTemp) {
			this.fitness *= 1.5;
		}*/

	}

	this.update = function() {
		var d = dist(this.pos.x, this.pos.y, target.x, target.y);
		if(d < 10) {
			this.completed = true;
			this.pos = target.copy();
			//this.temp = count;
		}


		this.applyForce(this.dna.genes[count]);

		if(!this.completed) {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
		}
	}

	this.show = function () {
		push();
		noStroke();
		fill(255, 150);
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		rectMode(CENTER);
		rect(0,0,25,5);	
		pop();
	}
}
