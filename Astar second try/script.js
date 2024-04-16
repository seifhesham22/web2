const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let gridSize = 20; // Default grid size
let canvasSize = 600; // Updated canvas size
let cellSize = canvasSize / gridSize;

canvas.width = canvasSize;
canvas.height = canvasSize;

let start = null;
let end = null;
let walls = new Set();
let isDragging = false;
let lastClickedCell = null;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  ctx.strokeStyle = 'black'; // Set stroke color to black
  ctx.lineWidth = 1; // Set line width to 1 pixel

  // Draw vertical grid lines
  for (let x = 0; x <= canvasSize; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasSize);
    ctx.stroke();
  }

  // Draw horizontal grid lines
  for (let y = 0; y <= canvasSize; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasSize, y);
    ctx.stroke();
  }
}

// Call the drawGrid function to draw the grid
drawGrid();

canvas.addEventListener('mousedown', handleMouseDown);
canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('mouseup', handleMouseUp);
canvas.addEventListener('click', handleClick);

function handleMouseDown(event) {
  isDragging = true;
  lastClickedCell = getCellFromEvent(event);
}

function handleMouseMove(event) {
  if (isDragging) {
    const currentCell = getCellFromEvent(event);
    if (currentCell.x !== lastClickedCell.x || currentCell.y !== lastClickedCell.y) {
      lastClickedCell = currentCell;
      handleClick(event);
    }
  }
}

function handleMouseUp() {
  isDragging = false;
}

function getCellFromEvent(event) {
  const x = Math.floor(event.offsetX / cellSize);
  const y = Math.floor(event.offsetY / cellSize);
  return { x, y };
}

function handleClick(event) {
  const { x, y } = getCellFromEvent(event);

  if (!start) {
    start = { x, y };
    drawMarker(start, 'blue');
  } else if (!end) {
    end = { x, y };
    drawMarker(end, 'red');
  } else {
    if (!walls.has(`${x},${y}`) && !(x === start.x && y === start.y) && !(x === end.x && y === end.y)) {
      walls.add(`${x},${y}`);
      drawWall(x, y);
    }
  }
}

function drawMarker(position, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc((position.x + 0.5) * cellSize, (position.y + 0.5) * cellSize, cellSize / 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawWall(x, y) {
  ctx.fillStyle = 'green';
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  walls.clear();
  start = null;
  end = null;
}

const gridSizeSelect = document.getElementById('gridSize');
gridSizeSelect.addEventListener('change', function () {
  gridSize = parseInt(this.value);
  canvasSize = 600; // Updated default canvas size
  cellSize = canvasSize / gridSize;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  clearCanvas();
});

function heuristic(node, goal) {
  const heuristicType = document.getElementById('heuristic').value;
  if (heuristicType === 'euclidean') {
    return Math.sqrt(Math.pow(node.x - goal.x, 2) + Math.pow(node.y - goal.y, 2));
  } else {
    return Math.abs(node.x - goal.x) + Math.abs(node.y - goal.y);
  }
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(JSON.stringify(current))) {
    current = cameFrom.get(JSON.stringify(current));
    path.push(current);
  }
  return path.reverse();
}

function aStar(start, end) {
  const openSet = new Set();
  const closedSet = new Set();
  const cameFrom = new Map();
  const gScore = new Map();
  const fScore = new Map();

  openSet.add(JSON.stringify(start));
  gScore.set(JSON.stringify(start), 0);
  fScore.set(JSON.stringify(start), heuristic(start, end));

  while (openSet.size > 0) {
    let current = null;
    let minFScore = Infinity;
    for (const node of openSet) {
      if (fScore.get(node) < minFScore) {
        minFScore = fScore.get(node);
        current = JSON.parse(node);
      }
    }

    if (current.x === end.x && current.y === end.y) {
      return reconstructPath(cameFrom, current);
    }

    openSet.delete(JSON.stringify(current));
    closedSet.add(JSON.stringify(current));

    const neighbors = [
      { x: current.x - 1, y: current.y },
      { x: current.x + 1, y: current.y },
      { x: current.x, y: current.y - 1 },
      { x: current.x, y: current.y + 1 }
    ];

    for (const neighbor of neighbors) {
      if (neighbor.x < 0 || neighbor.x >= gridSize || neighbor.y < 0 || neighbor.y >= gridSize) {
        continue;
      }
      if (walls.has(`${neighbor.x},${neighbor.y}`) || closedSet.has(JSON.stringify(neighbor))) {
        continue;
      }
      const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;
      if (!openSet.has(JSON.stringify(neighbor))) {
        openSet.add(JSON.stringify(neighbor));
      } else if (tentativeGScore >= gScore.get(JSON.stringify(neighbor))) {
        continue;
      }

      cameFrom.set(JSON.stringify(neighbor), current);
      gScore.set(JSON.stringify(neighbor), tentativeGScore);
      fScore.set(JSON.stringify(neighbor), gScore.get(JSON.stringify(neighbor)) + heuristic(neighbor, end));
    }
  }

  // No path found
  return null;
}

function drawPath(path) {
  ctx.lineWidth = cellSize / 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo((path[0].x + 0.5) * cellSize, (path[0].y + 0.5) * cellSize);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo((path[i].x + 0.5) * cellSize, (path[i].y + 0.5) * cellSize);
  }
  ctx.stroke();
}

function findAndDrawPath() {
  const tempStart = start;
  const tempEnd = end;
  const tempWalls = new Set(walls);

  clearCanvas();

  start = tempStart;
  end = tempEnd;
  walls = tempWalls;

  drawGrid(); // Redraw the grid

  drawMarker(start, 'green');
  drawMarker(end, 'red');
  walls.forEach(wall => {
    const [x, y] = wall.split(',').map(Number);
    drawWall(x, y);
  });

  const path = aStar(start, end);
  if (path) {
    // Introducing delay
    let i = 0;
    const interval = setInterval(() => {
      drawPath(path.slice(0, i + 1));
      i++;
      if (i >= path.length) {
        clearInterval(interval);
      }
    }, 30); // Adjust delay here (in milliseconds)
  } else {
    alert('No path found!');
  }
}

document.getElementById('findPathButton').addEventListener('click', findAndDrawPath);
document.getElementById('clearButton').addEventListener('click', clearCanvas);



