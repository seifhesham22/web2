const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const clearButton = document.getElementById('clearButton');
const cityCountInput = document.getElementById('cityCountInput');
let cities = [];

function setup() {
    cities = [];

  // Add user-input cities
    const userCities = document.getElementsByClassName('user-city');
    for (let i = 0; i < userCities.length; i++) {
        cities.push({
        x: parseInt(userCities[i].getAttribute('data-x')),
        y: parseInt(userCities[i].getAttribute('data-y')),
        });
    }

  // Add random cities
    const cityCount = parseInt(cityCountInput.value);
    while (cities.length < cityCount) {
        cities.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        });
    }

    drawCities();
    }

function drawCities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cities.forEach(city => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 7, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    });
}

function drawPath(path) {
    ctx.beginPath();
    ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
    }
    ctx.lineTo(cities[path[0]].x, cities[path[0]].y);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

// Initialize the population
function initializePopulation() {
    const population = [];
    for (let i = 0; i < 100; i++) {
        const path = [...Array(cities.length)].map((_, i) => i);
        shuffleArray(path);
        population.push(path);
    }
    return population;
    }

// Evaluate the fitness of each individual in the population
function evaluateFitness(population) {
    const fitness = [];
    for (const path of population) {
    const pathLength = path.reduce(
        (sum, city, index) =>
        sum + Math.sqrt(Math.pow(cities[city].x - cities[path[(index + 1) % path.length]].x, 2) + Math.pow(cities[city].y - cities[path[(index + 1) % path.length]].y, 2)),
        0,
    );
    fitness.push(1 / pathLength);
    }
    return fitness;
}

// Select the parents for the next generation using tournament selection
function selectParents(population, fitness) {
    const parents = [];
    for (let i = 0; i < 100; i++) {
    const tournamentSize = 5;
    let bestIndex = Math.floor(Math.random() * population.length);
    for (let j = 1; j < tournamentSize; j++) {
      const index = Math.floor(Math.random() * population.length);
        if (fitness[index] > fitness[bestIndex]) {
        bestIndex = index;
        }
    }
    parents.push(population[bestIndex]);
    }
    return parents;
}

// Crossover two parents to create a child
function crossover(parent1, parent2) {
    const child = [...Array(parent1.length)];
    const startPos = Math.floor(Math.random() * parent1.length);
    const endPos = Math.floor(Math.random() * parent1.length);
    const [start, end] = startPos < endPos ? [startPos, endPos] : [endPos, startPos];
    for (let i = start; i <= end; i++) {
        child[i] = parent1[i];
    }
    for (let i = 0; i < parent2.length; i++) {
        if (!child.includes(parent2[i])) {
        for (let j = 0; j < child.length; j++) {
            if (child[j] === undefined) {
            child[j] = parent2[i];
            break;
            }
        }
        }
    }
    return child;
}

// Mutate an individual with the given probability
function mutate(individual, mutationRate) {
    for (let i = 0; i < individual.length; i++) {
        if (Math.random() < mutationRate) {
        const j = Math.floor(Math.random() * individual.length);
        [individual[i], individual[j]] = [individual[j], individual[i]];
        }
    }
    return individual;
}

// Perform one generation of the genetic algorithm
function generation(population, fitness, mutationRate) {
    const parents = selectParents(population, fitness);
    const newPopulation = [];
    for (let i = 0; i < parents.length / 2; i++) {
        const parent1 = parents[i * 2];
        const parent2 = parents[i * 2 + 1];
        const child1 = crossover(parent1, parent2);
        const child2 = crossover(parent2, parent1);
        newPopulation.push(mutate(child1, mutationRate));
        newPopulation.push(mutate(child2, mutationRate));
    }
    return newPopulation;
}

// Shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function runGeneticAlgorithm() {
  // Initialize the population
    let population = initializePopulation();

    const intervalId = setInterval(() => {
    const fitness = evaluateFitness(population);

    // Find the best individual in the population
    const bestIndex = fitness.indexOf(Math.max(...fitness));
    const bestIndividual = population[bestIndex];

    // Draw the best path
    drawPath(bestIndividual);

    // Create the next generation
    population = generation(population, fitness, 0.01);
  }, 0); 

  // Stop the algorithm "Clear" button
    clearButton.addEventListener('click', () => {
    clearInterval(intervalId);
    /* clear function */
    clearCanvas();
    });
}

// Initialize the canvas and add event listeners
function init() {
    canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const elem = document.createElement('div');
    elem.className = 'user-city';
    elem.style.left = `${x - 5}px`;
    elem.style.top = `${y - 5}px`;
    elem.setAttribute('data-x', x);
    elem.setAttribute('data-y', y);
    document.body.appendChild(elem);
    });
    startButton.addEventListener('click', () => {
    setup();
    runGeneticAlgorithm();
    });
}

init();