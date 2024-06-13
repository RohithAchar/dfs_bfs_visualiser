const myCanvas = document.querySelector("#myCanvas");
const ctx = myCanvas.getContext("2d");
const algorithm = document.querySelector("#algorithm");
const startBtn = document.querySelector("#start");
const randomBtn = document.querySelector("#random");

startBtn.addEventListener("click", handleStart);
randomBtn.addEventListener("click", handleRandom);

// Parameters for the maze
let rows = 5;
let cols = 5;
let start = [0, 0];
let end = [4, 4];

let iteration = 0;

// Generate and print the maze
let maze = createMaze(rows, cols, start, end);
printMaze(maze);
drawMaze(maze);

function handleStart() {
  iteration = 0;

  const algo = algorithm.value;
  let result;
  if (algo == "dfs") {
    result = dfs(maze, start, end);
  } else {
    result = bfs(maze, start, end);
    console.log("DFS: ", result.visitedArray);
  }
  if (result.path.length == 0) alert("No escape");
  else {
    let intervalId = setInterval(() => {
      if (iteration == result.visitedArray.length) {
        clearInterval(intervalId);
        cleanUpMaze(result.path);
      } else {
        updateMaze(result.visitedArray[iteration]);
        iteration++;
      }
    }, 1000);
  }
}

function handleRandom() {
  maze = createMaze(rows, cols, start, end);
  printMaze(maze);
  drawMaze(maze);
}

function createMaze(rows, cols, start, end) {
  // Initialize the maze with empty spaces
  let maze = Array.from({ length: rows }, () => Array(cols).fill(" "));

  // Add start and end points
  maze[start[0]][start[1]] = "S";
  maze[end[0]][end[1]] = "E";

  // Add walls (random example)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (
        Math.random() > 0.7 &&
        !(i === start[0] && j === start[1]) &&
        !(i === end[0] && j === end[1])
      ) {
        maze[i][j] = "X";
      }
    }
  }

  return maze;
}

function updateMaze([row, col]) {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.lineWidth = "1";
  ctx.strokeStyle = "black";
  ctx.rect(col * 50, row * 50, 50, 50);
  ctx.stroke();
  ctx.fill();
}

function cleanUpMaze(path) {
  path.map(([row, col]) => {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.lineWidth = "1";
    ctx.strokeStyle = "black";
    ctx.rect(col * 50, row * 50, 50, 50);
    ctx.stroke();
    ctx.fill();
  });

  setTimeout(() => {
    handleRandom();
  }, 2000);
}

// Display the maze
function printMaze(maze) {
  console.log(maze);
}

function drawMaze(maze) {
  const canvasWidth = maze[0].length * 50;
  const canvasHeight = maze.length * 50;

  myCanvas.width = canvasWidth;
  myCanvas.height = canvasHeight;

  ctx.clearRect(0, 0, myCanvas.innerWidth, myCanvas.innerHeight);
  for (let row = 0; row < maze.length; row++) {
    let offsetY = 50 * row;
    for (let col = 0; col < maze[0].length; col++) {
      let offsetX = 50 * col;
      ctx.beginPath();
      ctx.fillStyle = "white";
      if (maze[row][col] == "X") ctx.fillStyle = "black";
      if (maze[row][col] == "S" || maze[row][col] == "E")
        ctx.fillStyle = "green";
      ctx.lineWidth = "1";
      ctx.strokeStyle = "black";
      ctx.rect(offsetX, offsetY, 50, 50);
      ctx.stroke();
      ctx.fill();
    }
  }
}

function dfs(maze, start, end) {
  console.log("DFS MAZE:", ...maze);
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const path = [];
  const visitedArray = [];

  function dfsHelper(x, y) {
    if (
      x < 0 ||
      y < 0 ||
      x >= rows ||
      y >= cols ||
      maze[x][y] === "X" ||
      visited[x][y]
    ) {
      return false;
    }

    path.push([x, y]);
    visited[x][y] = true;
    visitedArray.push([x, y]);

    if (x === end[0] && y === end[1]) {
      return true;
    }

    // Explore neighbors (up, right, down, left)
    const directions = [
      [-1, 0], // up
      [0, 1], // right
      [1, 0], // down
      [0, -1], // left
    ];

    for (const [dx, dy] of directions) {
      if (dfsHelper(x + dx, y + dy)) {
        return true;
      }
    }

    path.pop();
    return false;
  }

  dfsHelper(start[0], start[1]);
  return { path, visitedArray };
}

function bfs(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [[start]];
  const visitedArray = [];

  visited[start[0]][start[1]] = true;
  visitedArray.push(start);

  const directions = [
    [-1, 0], // up
    [0, 1], // right
    [1, 0], // down
    [-1, 0], // left
  ];

  while (queue.length > 0) {
    const path = queue.shift();
    const [x, y] = path[path.length - 1];

    if (x === end[0] && y === end[1]) {
      return { path, visitedArray };
    }

    for (const [dx, dy] of directions) {
      const newX = x + dx;
      const newY = y + dy;

      if (
        newX >= 0 &&
        newY >= 0 &&
        newX < rows &&
        newY < cols &&
        maze[newX][newY] !== "X" &&
        !visited[newX][newY]
      ) {
        visited[newX][newY] = true;
        visitedArray.push([newX, newY]);
        queue.push([...path, [newX, newY]]);
      }
    }
  }

  return { path: [], visitedArray }; // Return empty array if no path is found
}
