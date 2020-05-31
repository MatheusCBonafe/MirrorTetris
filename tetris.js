const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
var ranking = [];
let totalScore = 0;
let scoreIncrease = 500;
var difficultyCounter = 0;
var difficultyArray = ["Easy", "Medium", "Hard", "Challenging", "Expert"];
var gameMap = null;


const tPiece = [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 1],
];

const lPiece = [
    [0, 2, 0],
    [0, 2, 0],
    [0, 2, 2],
];

const iPiece = [
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
    [0 ,0, 3, 0, 0],
];

const zPiece = [
    [0 ,0, 0],
    [4, 4, 0],
    [0, 4, 4],
];

const sPiece = [
    [0, 0, 0],
    [0, 6, 6],
    [6, 6, 0],
];

const square = [
    [7, 7],
    [7, 7],
];

const jPiece = [
    [0, 8, 0],
    [0, 8, 0],
    [8, 8, 0],
];

const uPiece = [
    [0, 0, 0],
    [9, 0, 9],
    [9, 9, 9],
];

const player = {
    position: {x: 0, y: 0},
    matrix: null,
    name: null,
}

const matrixDimensions = {
    width: 0,
    height: 0,
}

let dropRate = 0;
let dropInterval = 1000;
let lastTime = 0;
var dropController = 0;
var piece = 0;
let pause = false;

var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");
var totalSeconds = 0;

if (!pause){
    setInterval(setTime, 1000);
} 

function setTime() {
  ++totalSeconds;
  seconds.innerHTML = stringTime(totalSeconds % 60);
  minutes.innerHTML = stringTime(parseInt(totalSeconds / 60));
}

function stringTime(sec) {
  var secString = sec + "";
  if (secString.length < 2) {
    return "0" + secString;
  } else
    return secString;
}

function blockDrop() {
    player.position.y--;

    if (collide(gameMap, player)) {
        player.position.y++;
        matrixJoin(gameMap, player);
        resetBlockPosition();
        gameMapSweep();
    }

    dropRate = 0;
}

function randomGenerator() {
    piece = Math.floor(Math.random() * (9 - 1) + 1);
    return piece;
}

function getCurrentScore() {
    let havePoints = true;
    let nRows = 0;
    let ri = [];

    gameMap.map(function(row) {
        havePoints = true;

        row.map(function (el) {
            if (el == 0) { havePoints = false; }
        })
        if (havePoints) {
            console.log(gameMap.indexOf(row))
            nRows++;
            ri.push(gameMap.indexOf(row))
        }
    })

    ri.reverse()
    return (10 * nRows * nRows);
}

function resetBlockPosition() {
    randomGenerator();

    totalScore += getCurrentScore();
    difficulty.innerHTML = difficultyArray[difficultyCounter];
    scoreBoard.innerHTML = totalScore;
    if (totalScore / scoreIncrease >= 1 && totalScore !== 0 && totalScore != dropController) {
        if (dropInterval > 200) {
            difficultyCounter++;
            dropInterval -= 200;
        } else if (dropInterval > 20) {
            dropInterval -= 20;
        }
        dropController = totalScore;
        scoreIncrease += 500;
    }

  switch(piece) {
    case 1:
      player.matrix = tPiece;
      break;
    case 2:
      player.matrix = lPiece;
      break;
    case 3:
      player.matrix = iPiece;
      break;
    case 4:
      player.matrix = zPiece;
      break;
    case 5:
      player.matrix = square;
      break;
    case 6:
      player.matrix = sPiece;
      break;
    case 7:
      player.matrix = jPiece;
      break;
    case 8:
      player.matrix = uPiece;
      break;
    }

  player.position.y = gameMap.length - player.matrix.length;
  player.position.x = (gameMap[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    endGame();
}

function endGame() {
    if (collide(gameMap, player)) {
        gameMap.forEach(row => row.fill(0));
        alert("End game");
        let dropInterval = 1000;

        ranking.push("°", player.name, totalScore, difficultyArray[difficultyCounter], parseInt(totalSeconds / 60), totalSeconds % 60, "<br>");

        totalSeconds = 0;
        totalScore = 0;
        difficultyCounter = 0;
        difficulty.innerHTML = difficultyArray[difficultyCounter];
        scoreBoard.innerHTML = totalScore;
        rankingJog.innerHTML = ranking.join(" ");
          }
  }

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(gameMap,  {x: 0, y: 0});
    drawMatrix(player.matrix, player.position);
}

function collide(gameMap, player) {
    const m = player.matrix;
    const o = player.position;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (gameMap[y + o.y] &&
                gameMap[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function update(time = 0) {
    const interval = time - lastTime;

    dropRate = dropRate + interval;

    if (dropRate > dropInterval && !pause) {
      blockDrop();
  }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function matrixJoin(gameMap, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                gameMap[y + player.position.y][x + player.position.x] = value;
            }
        });
    });
}

function createMatrix(width, height) {
    const matrix = [];
    while (height--) {
        matrix.push(new Array(width).fill(0));
    }
    return matrix;
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = 'purple';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 2) {
                context.fillStyle = 'blue';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 3) {
                context.fillStyle = 'cyan';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 4) {
                context.fillStyle = 'green';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 5) {
                context.fillStyle = 'yellow';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 6) {
                context.fillStyle = 'brown';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 7) {
                context.fillStyle = 'pink';
                context.fillRect(x + offset.x,
                                 y + offset.y, 1, 1);
            } else if (value === 8) {
              context.fillStyle = 'gray';
              context.fillRect(x + offset.x,
                               y + offset.y, 1, 1);
            } else if (value === 9) {
              context.fillStyle = 'olive';
              context.fillRect(x + offset.x,
                               y + offset.y, 1, 1);
              }
    });
});
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 27) {
        if (pause) {
            pause = false;
        }else{
            pause = true;
        }
    }

   if (event.keyCode === 37) {
    player.position.x = player.position.x - 1;
    if (collide(gameMap, player)) {
        player.position.x = player.position.x + 1;
        }
    } else if (event.keyCode === 39) {
        player.position.x = player.position.x + 1;
        if (collide(gameMap, player)) {
            player.position.x = player.position.x - 1;
            }
    } else if (event.keyCode === 38){
        player.position.y = player.position.y - 1;
        if (collide(gameMap, player)) {
            player.position.y++;
            matrixJoin(gameMap, player);
            resetBlockPosition();
            gameMapSweep();
        }
    } else if (event.keyCode === 32) {
        rotate(player.matrix);
    }
});

function rotate(matrix) {
    const x = Math.floor(matrix.length / 2);
    const y = matrix.length - 1;
    for (let i = 0; i < x; i++) {
       for (let j = i; j < y - i; j++) {
          k = matrix[i][j];
          matrix[i][j] = matrix[y - j][i];
          matrix[y - j][i] = matrix[y - i][y - j];
          matrix[y - i][y - j] = matrix[j][y - i]
          matrix[j][y - i] = k
       }
    }
}

function gameMapSweep() {
    outer: for (let y = 0; y < gameMap.length-1; ++y) {
        for (let x = 0; x < gameMap[y].length; ++x) {
            if (gameMap[y][x] === 0) {
                continue outer;
            }
        }

        const row = gameMap.splice(y, 1)[0].fill(0);
        gameMap.push(row);
       --y;
    }
}

function setUserName() {
    var name = prompt("Please, tell us your name!", "");
    var element = document.getElementById('userName');

    if (name == null || name == "") {
        name = "Joãozinho"
        element.innerHTML = name;
    } else {
        element.innerHTML = name;
    }
    player.name = name;
}

function gameDimensions() {
    if(confirm("Press 'OK' for a 10x20 game and 'Cancel' for a 22x44 one")) {
        matrixDimensions.width = 10;
        matrixDimensions.height = 20;
    } else {
        matrixDimensions.width = 22;
        matrixDimensions.height = 44;
    }
}

function createGameMap() {
    gameMap = createMatrix(matrixDimensions.width, matrixDimensions.height);
    var canvasMap = document.getElementById('tetris');
    if (matrixDimensions.width === 10) {
        width = matrixDimensions.width * 15;
        height = matrixDimensions.height * 15;
        context.scale(30, 8);
    } else {
        width = matrixDimensions.width * 12;
        height = matrixDimensions.height * 12;
        context.scale(13.6, 3.4);
    }
    canvasMap.style.width = `${width}px`;
    canvasMap.style.height = `${height}px`;
}

gameDimensions();
createGameMap();
resetBlockPosition();
update();
setUserName();
