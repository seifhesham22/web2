// Get canvas element and context
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Algorithm parameters
let numAnts = 10;
const numIterations = 10;
const evaporationRate = 0.5;
const Alpha = 1;
const Beta = 2;
const q = 100;
let pheromoneMatrix = [];
let distances;
let points = [];
let bestTour;
let bestTourLength;

// Event listener for adding points
canvas.addEventListener('mousedown', handleMouseDown);

function handleMouseDown(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const canvasX = x * (canvas.width / rect.width);
  const canvasY = y * (canvas.height / rect.height);
  context.fillStyle = 'red';
  context.beginPath();
  context.arc(canvasX, canvasY, 5, 0, Math.PI * 2);
  context.fill();
  points.push([canvasX, canvasY]);
}

// Calculate distance between two points
function distanceCalculation(point1, point2) {
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
      arr.push(distanceCalculation(dots[i], dots[j]));
    }
    graph.push(arr);
  }
  return graph;
}

// Ant Colony Optimization algorithm for TSP
async function ACO(distanceMatrix, numAnts, numIterations, evaporationRate, Alpha, Beta, q) {
  pheromoneMatrix = [];
  const initialPheromone = 1 / (distanceMatrix.length * numAnts);
  for (let i = 0; i < distanceMatrix.length; i++) {
    const arr = [];
    for (let j = 0; j < distanceMatrix.length; j++) {
      arr.push(initialPheromone);
    }
    pheromoneMatrix.push(arr);
  }

  bestTour = [];
  bestTourLength = Infinity;

  for (let iter = 0; iter < numIterations; iter++) {
    const antPheromoneMatrix = [];
    for (let i = 0; i < numAnts; i++) {
      antPheromoneMatrix.push(pheromoneMatrix.slice());
    }

    for (let ant = 0; ant < numAnts; ant++) {
      const path = [];
      const visited = new Set();
      let current = Math.floor(Math.random() * distanceMatrix.length);
      visited.add(current);
      path.push(current);

      for (let i = 0; i < distanceMatrix.length - 1; i++) {
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

        visited.add(next);
        path.push(next);

        antPheromoneMatrix[ant][current][next] += q / distanceMatrix[current][next];
        antPheromoneMatrix[ant][next][current] += q / distanceMatrix[current][next];

        current = next;
      }

      let tourLength = 0;
      for (let i = 0; i < path.length - 1; i++) {
        tourLength += distanceMatrix[path[i]][path[i + 1]];
      }
      tourLength += distanceMatrix[path[path.length - 1]][path[0]];

      antPheromoneMatrix[ant][path[path.length - 1]][path[0]] += q / distanceMatrix[path[path.length - 1]][path[0]];
      antPheromoneMatrix[ant][path[0]][path[path.length - 1]] += q / distanceMatrix[path[path.length - 1]][path[0]];

      for (let i = 0; i < antPheromoneMatrix[ant].length; i++) {
        for (let j = 0; j < antPheromoneMatrix[ant][i].length; j++) {
          antPheromoneMatrix[ant][i][j] *= 1 - evaporationRate;
          antPheromoneMatrix[ant][i][j] = Math.max(antPheromoneMatrix[ant][i][j], 0.0001);
        }
      }

      if (tourLength < bestTourLength) {
        bestTour = path;
        bestTourLength = tourLength;
      }
    }

    for (let i = 0; i < pheromoneMatrix.length; i++) {
      for (let j = 0; j < pheromoneMatrix[i].length; j++) {
        let sum = 0;
        for (let ant = 0; ant < numAnts; ant++) {
          sum += antPheromoneMatrix[ant][i][j];
        }
        pheromoneMatrix[i][j] = (1 - evaporationRate) * pheromoneMatrix[i][j] + sum;
      }
    }

    drawPath(bestTour, true);
  }

  return [bestTour, bestTourLength];
}

// Draw lines between points in the specified path
function drawPath(path, isBestRoute = false) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'red';
  points.forEach(point => {
    context.beginPath();
    context.arc(point[0], point[1], 5, 0, Math.PI * 2);
    context.fill();
  });

  context.strokeStyle = 'rgba(0, 100, 100, 0.5)';
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
}

// Start button click event
async function startOptimization() {
  distances = createGraph(points);
  await ACO(distances, numAnts, numIterations, evaporationRate, Alpha, Beta, q);
}

// Clear button click event
function reset() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  points = [];
}

// Event listeners for buttons
document.getElementById("startButton").addEventListener("click", startOptimization);
document.getElementById("clearButton").addEventListener("click", reset);

// Initial clear of canvas and points array
reset();