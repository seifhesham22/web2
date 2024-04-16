// Get canvas element and context
let canvas = document.getElementById('canvas');
canvas.width = 1000;
canvas.height = 600;
let context = canvas.getContext('2d');

// Set up variables
let numAnts = 10;
let numIterations;
let evaporationRate = 0.5;
let pheromoneMatrix = [];
let Alpha = 1;
let Beta = 2;
let q = 100;
let distances;
let points = [];

// Set up event listener for adding points
canvas.addEventListener('mousedown', handleMouseDown);

// Handle mousedown event - add point to canvas and points array
function handleMouseDown(event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let canvasX = x * (canvas.width / rect.width);
  let canvasY = y * (canvas.height / rect.height);
  context.fillStyle = 'blue'; // Point color
  context.beginPath();
  context.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
  context.fill();
  points.push([canvasX, canvasY]);
}

// Calculate distance between two points
function DistanceCalculation(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Create distance matrix from array of points
function createGraph(dots) {
  const n = dots.length;
  const graph = [];
  for (let i = 0; i < n; i++) {
    const arr = [];
    for (let j = 0; j < n; j++) {
      arr.push(DistanceCalculation(dots[i], dots[j]));
    }
    graph.push(arr);
  }
  return graph;
}

// Ant Colony Optimization algorithm for TSP
async function ACO(distanceMatrix, numAnts, numIterations, evaporationRate, Alpha, Beta, q) {
  // Initialize pheromone matrix
  pheromoneMatrix = [];
  const initialPheromone = 1 / (distanceMatrix.length * numAnts);
  for (let i = 0; i < distanceMatrix.length; i++) {
    const arr = [];
    for (let j = 0; j < distanceMatrix.length; j++) {
      arr.push(initialPheromone);
    }
    pheromoneMatrix.push(arr);
  }

  // Variables to store the best tour found so far
  let bestTour;
  let bestTourLength = Infinity;

  // Loop through specified number of iterations
  for (let iter = 0; iter < numIterations; iter++) {
    // Create a copy of the pheromone matrix for each ant
    const antPheromoneMatrix = [];
    for (let i = 0; i < numAnts; i++) {
      antPheromoneMatrix.push(pheromoneMatrix.slice());
    }

    // Loop through each ant
    for (let ant = 0; ant < numAnts; ant++) {
      const path = [];
      const visited = new Set();
      let current = Math.floor(Math.random() * distanceMatrix.length);
      visited.add(current);
      path.push(current);

      // Loop through each city
      for (let i = 0; i < distanceMatrix.length - 1; i++) {
        // Calculate the probabilities of each possible next city
        const probabilities = [];
        let denominator = 0;
        for (let j = 0; j < distanceMatrix.length; j++) {
          if (!visited.has(j)) {
            const numerator = Math.pow(pheromoneMatrix[current][j], Alpha) * Math.pow(1 / distanceMatrix[current][j], Beta);
            denominator += numerator;
            probabilities.push(numerator);
          } else {
            probabilities.push(0);
          }
        }
        probabilities.forEach((_, index) => probabilities[index] /= denominator);

        // Use a weighted random selection to choose the next city
        const random = Math.random();
        let sum = 0;
        let next;
        for (let j = 0; j < probabilities.length; j++) {
          sum += probabilities[j];
          if (random < sum) {
            next = j;
            break;
          }
        }

        // Add the next city to the path and mark it as visited
        visited.add(next);
        path.push(next);

        // Update the pheromone matrix for the current and next cities
        antPheromoneMatrix[ant][current][next] += q / distanceMatrix[current][next];
        antPheromoneMatrix[ant][next][current] += q / distanceMatrix[current][next];

        // Move to the next city
        current = next;
      }

      // Add the distance from the last city to the starting city to complete the tour
      let tourLength = 0;
      for (let i = 0; i < path.length - 1; i++) {
        tourLength += distanceMatrix[path[i]][path[i + 1]];
      }
      tourLength += distanceMatrix[path[path.length - 1]][path[0]];

      // Update the pheromone matrix for the last and first cities in the path
      antPheromoneMatrix[ant][path[path.length - 1]][path[0]] += q / distanceMatrix[path[path.length - 1]][path[0]];
      antPheromoneMatrix[ant][path[0]][path[path.length - 1]] += q / distanceMatrix[path[path.length - 1]][path[0]];

      // Apply evaporation to the pheromone matrix
      for (let i = 0; i < antPheromoneMatrix[ant].length; i++) {
        for (let j = 0; j < antPheromoneMatrix[ant][i].length; j++) {
          antPheromoneMatrix[ant][i][j] *= 1 - evaporationRate;
          antPheromoneMatrix[ant][i][j] = Math.max(antPheromoneMatrix[ant][i][j], 0.0001);
        }
      }

      // Update the best tour if a shorter tour is found
      if (tourLength < bestTourLength) {
        bestTour = path;
        bestTourLength = tourLength;
      }
    }

    // Update the global pheromone matrix with the pheromone deposits from each ant
    for (let i = 0; i < pheromoneMatrix.length; i++) {
      for (let j = 0; j < pheromoneMatrix[i].length; j++) {
        let sum = 0;
        for (let ant = 0; ant < numAnts; ant++) {
          sum += antPheromoneMatrix[ant][i][j];
        }
        pheromoneMatrix[i][j] = (1 - evaporationRate) * pheromoneMatrix[i][j] + sum;
      }
    }
  }

  return [bestTour, bestTourLength];
}

// Draw lines between points in the specified path
function drawPath(path, isBestRoute = false) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the pheromone trails in red
  context.strokeStyle = 'red';
  context.lineWidth = 4;
  for (let i = 0; i < path.length - 1; i++) {
    let startX = points[path[i]][0];
    let startY = points[path[i]][1];
    let endX = points[path[i + 1]][0];
    let endY = points[path[i + 1]][1];
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }

  // Draw the best route in black
  if (isBestRoute) {
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(points[path[0]][0], points[path[0]][1]);
    for (let i = 1; i < path.length; i++) {
      context.lineTo(points[path[i]][0], points[path[i]][1]);
    }
    context.closePath();
    context.stroke();
  }

  // Draw the points in blue
  context.fillStyle = 'blue';
  for (let i = 0; i < points.length; i++) {
    context.beginPath();
    context.arc(points[i][0], points[i][1], 5, 0, Math.PI * 2);
    context.fill();
  }
}

// Handle button click event - runs the ant colony optimization algorithm and displays the result
async function startOptimization() {
  // Get the number of iterations from the input field
  numIterations = parseInt(document.getElementById('numIterations').value);
  Beta = parseInt(document.getElementById('Beta').value);
  Alpha = parseInt(document.getElementById('Alpha').value);

  // Check that there are at least two points
  if (points.length < 2) {
    alert('Add at least TWO points.');
    return;
  }

  // Create a distance matrix from the array of points
  distances = createGraph(points);

  let bestTour;
  let bestTourLength = Infinity;

  for (let iteration = 1; iteration <= numIterations; iteration++) {
    // Run the ant colony optimization algorithm for the current iteration
    const [currentBestTour, currentBestTourLength] = await ACO(distances, numAnts, 1, evaporationRate, Alpha, Beta, q);

    // Update the best tour if a shorter tour is found
    if (currentBestTourLength < bestTourLength) {
      bestTour = currentBestTour;
      bestTourLength = currentBestTourLength;
    }

    // Draw the pheromone trails and the best route for the current iteration
    drawPath(currentBestTour);

    // Display the current iteration and the length of the best tour
    console.log(`Iteration ${iteration}: Best tour length = ${bestTourLength}`);
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  // Draw the best route with color blue
  drawPath(bestTour, true);

 document.getElementById("distance-label").innerHTML = bestTourLength;
}

// Handle button click event - clears the canvas and the points array
function reset() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);
  // Clear the points array
  points = [];
}

// Clear the canvas and the points array
reset();