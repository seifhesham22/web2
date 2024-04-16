// Get the canvas element and its 2D context
const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

// Add event listener for mouse clicks on the canvas
canvas.addEventListener('mousedown', handleMouseDown);

// Initialize variables for genetic algorithm parameters and population
let mutationRate = document.getElementById("mutationRate").value;
let populationSize = document.getElementById("populationSize").value;
let maxGenerations = document.getElementById("maxGenerations").value;
let pop;
let bestPathever;
let points = [];

// Function to handle mouse clicks on the canvas, adding points where clicked
function handleMouseDown(event) {
    let x = event.clientX - canvas.offsetLeft;
    let y = event.clientY - canvas.offsetTop;
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
    context.fill();
    points.push([x, y]);
}

// Function to create an initial population of paths
function createPopulation(populationSize, cities) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        // Shuffle the cities to create a random order
        const individual = cities.slice();
        for (let j = individual.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [individual[j], individual[k]] = [individual[k], individual[j]];
        }
        population.push(individual);
    }
    return population;
}

// Function to calculate fitness of a path
function calcFitness(pattern) {
    let totalDistance = 0;
    for (let i = 0; i < pattern.length - 1; i++) {
        const cityA = pattern[i];
        const cityB = pattern[i + 1];
        const dx = cityB[0] - cityA[0];
        const dy = cityB[1] - cityA[1];
        totalDistance += Math.sqrt(dx * dx + dy * dy);
    }
    return 100 / totalDistance;
}

// Function to get the fittest path from a population
function getFittest(cities) {
    let fittest = cities[0];
    let maxFitness = calcFitness(fittest);
    for (let i = 1; i < cities.length; i++) {
        const fitness = calcFitness(cities[i]);
        if (fitness > maxFitness) {
            fittest = cities[i];
            maxFitness = fitness;
        }
    }
    return fittest;
}

// Function to perform crossover between two parent paths
function crossover(parentA, parentB) {
    const offspring = new Array(parentA.length);
    let start = Math.floor(Math.random() * parentA.length);
    let end = Math.floor(Math.random() * parentA.length);

    while (start === end) {
        start = Math.floor(Math.random() * parentA.length);
        end = Math.floor(Math.random() * parentA.length);
    }
    
    // Ensure start and end are different
    if (start !== end) {
        // Swap start and end if start is greater than end
        if (start > end) {
            const temp = start;
            start = end;
            end = temp;
        }

        // Copy cities from parentA to offspring
        for (let i = start; i <= end; i++) {
            offspring[i] = parentA[i];
        }

        // Copy cities from parentB to offspring
        let j = 0;
        for (let i = 0; i < offspring.length; i++) {
            if (offspring[i] === undefined) {
                // Find first city in parentB that is not already in offspring
                while (offspring.includes(parentB[j])) {
                    j++;
                }
                offspring[i] = parentB[j];
            }
        }
    }

    return offspring;
}

// Function to mutate a path by swapping cities randomly
function mutate(pattern) {
    for (let i = 0; i < pattern.length; i++) {
        if (Math.random() < mutationRate) {
            const j = Math.floor(Math.random() * pattern.length);
            const temp = pattern[i];
            pattern[i] = pattern[j];
            pattern[j] = temp;
        }
    }
}

// Function to sort a population by fitness
function sortPopulationByFitness(population) {
    population.sort((a, b) => calcFitness(a) - calcFitness(b));
}

// Function to draw a line connecting points on the canvas
function drawLineThroughPoints(ctx, dots) {
    if (dots.length < 2) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(dots[0][0] - 8, dots[0][1] - 8);

    for (let i = 1; i < dots.length; i++) {
        ctx.lineTo(dots[i][0] - 8, dots[i][1] - 8);
    }
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 3;
    ctx.stroke();
}

// Function to draw points on the canvas
function drawPoints(ctx, dots) {
    ctx.fillStyle = 'black';
    ctx.moveTo(dots[0][0], dots[0][1]);
    for (let i = 0; i < dots.length; i++) {
        const x = dots[i][0];
        const y = dots[i][1];
        ctx.beginPath();
        ctx.arc(x - 8, y - 8, 5, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Function to draw a path on the canvas
function drawPath(ctx, path) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawLineThroughPoints(ctx, path)
    drawPoints(ctx, points);
}

// Function to animate drawing the best path found
function animatepath(context, path) {
    let animationFrame = 0;
    const maxFrames = 100;

    const animationLoop = setInterval(() => {
        drawPath(context, path);
        if (++animationFrame >= maxFrames) {
            clearInterval(animationLoop);
        }
    }, 1000 / 60);
}

// Function to start the genetic algorithm
function startButton() {
    mutationRate = document.getElementById("mutationRate").value;
    populationSize = document.getElementById("populationSize").value;
    maxGenerations = document.getElementById("maxGenerations").value;

    pop = createPopulation(populationSize, points);
    let generationCount = 0;
    let convergance = 0;
    bestPathever = points;
    sortPopulationByFitness(pop);
    
    // Main loop of the genetic algorithm
    while (generationCount < maxGenerations && convergance < maxGenerations / 2) {
        let parents = [];
        let i = 0, j = i + 1;

        // Select parents from the population
        while (parents.length < populationSize) {
            for (let i = populationSize - 1; i > populationSize / 2; i--) {
                parents.push(pop[i])
            }
            if (populationSize - 1 - i === 0) {
                break;
            }
            if (populationSize - 1 - j === 0) {
                i++;
                j = i + 1;
            }
            let offspring = crossover(pop[populationSize - 1 - i], pop[populationSize - 1 - j]);
            if (offspring.length === points.length) {
                parents.push(offspring);
            }
            j++;
        }
        
        // Mutate some of the parents
        for (let i = 0; i < parents.length / 2; i++) {
            mutate(parents[i]);
        }
        
        // Sort parents by fitness
        sortPopulationByFitness(parents);
        pop = parents;
        let bestPathG = pop[populationSize - 1];
        
        // Update best path if a better one is found
        if (calcFitness(bestPathG) - calcFitness(bestPathever) > 0) {
            bestPathever = bestPathG;
            convergance = 0;
        }
        convergance++;
        generationCount++;
        
        // Animate the best path every 100 generations
        if (generationCount % 100 === 0) {
            animatepath(context, bestPathever);
            console.log(calcFitness(bestPathever));
        }
    }
}

// Function to clear the canvas and reset points
function clearButton() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
}