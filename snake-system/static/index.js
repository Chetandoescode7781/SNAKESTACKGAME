const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const gameContainer = document.getElementById("game-container");
 
 canvas.width = window.innerHeight * 0.8;
 canvas.height = window.innerHeight * 0.8;  
 gameContainer.style.width = canvas.width + "px";
 gameContainer.style.height = canvas.height + "px";
const cw = 10; 
const w = canvas.width;
const h = canvas.height;

let score = 0;
let d = "right"; 
let requestId;
let gameOver = false;
let isPaused = false;
let isimmune=false;
let immuneCounter=0;
let playerName = "";

canvas.style.backgroundColor = "#000";


function paint_cell(x, y, color = "lime") {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}


class Snake {
    constructor() {
        this.array = [];
    }

    create() {
        this.array = [];
        for (let i = 4; i >= 0; i--) {
            this.array.push({ x: i, y: 0 });
        }
    }

    draw() {
        for (let i = 0; i < this.array.length; i++) {
            let color = (i === 0) ? "#00ff00" : "lime"; 
            paint_cell(this.array[i].x, this.array[i].y, color);
        }
    }

    move() {
        let head = { x: this.array[0].x, y: this.array[0].y };

        if (d === "right") head.x++;
        else if (d === "left") head.x--;
        else if (d === "up") head.y--;
        else if (d === "down") head.y++;

        this.array.unshift(head);
       
    }
}

class Food {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.reset();
    }

    reset() {
        this.x = Math.floor(Math.random() * (w / cw));
        this.y = Math.floor(Math.random() * (h / cw));
    }

    draw(color = "orange") {
        paint_cell(this.x, this.y, color);
    }
}

const snakeInstance = new Snake();
const foodInstance = new Food();
const immunefood = new Food();

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    
    if ((key === "w" || e.key === "ArrowUp") && d !== "down") d = "up";
    else if ((key === "s" || e.key === "ArrowDown") && d !== "up") d = "down";
    else if ((key === "a" || e.key === "ArrowLeft") && d !== "right") d = "left";
    else if ((key === "d" || e.key === "ArrowRight") && d !== "left") d = "right";

   
    if (key === "p" && (gameOver || !requestId)) {
       play();
    }

   
    if (e.code === "Space" && !gameOver) {
        if (!isPaused) {
            stopanimation();
            isPaused = true;
            ctx.fillStyle = "yellow";
            ctx.font = "30px Arial";
            ctx.textAlign = "center";
           ctx.fillText("PAUSED ", w / 2, h / 2);
           ctx.fillText("Press Space to Resume", w / 2, h / 2 + 40);

        } else {
            isPaused = false;
            animate();
        }
    }

  
    if (key === "r") restartGame();
});


let fps = 8; // Control speed
let now;
let then = Date.now();
let interval = 1000 / fps;
let delta;

function animate() {
    if (gameOver || isPaused) return;

    requestId = requestAnimationFrame(animate);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snakeInstance.move();
        
      if (isimmune) {
              immuneCounter--;
              if (immuneCounter <= 0) {
               isimmune = false;
               }
              }
         checkCollisions(); 
       if(score > 0 && score % 3 == 0){immuneCollisionCheck();}
       else foodCollisionCheck();
        snakeInstance.draw();
       if(score > 0 && score % 3 == 0){immunefood.draw("blue");}
       else  foodInstance.draw();

       document.getElementById("score").textContent = score;
 
    }
}

function stopanimation() {
    cancelAnimationFrame(requestId);
    requestId = null;
}

function checkCollisions() {
    let head = snakeInstance.array[0];
     
    if(isimmune){
    if (head.x < 0) {
       head.x = (w / cw) - 1;
       }
     else if (head.x >= w / cw) {
         head.x = 0;   
    }
     if (head.y < 0) {
        head.y = (h / cw) - 1;
         }
          else if (head.y >= h / cw) {
         head.y = 0;
        }
    }
     else {if (head.x < 0 || head.x >= w / cw || head.y < 0 || head.y >= h / cw) {
        endGame("WALL");
        return true;
        }

     
    for (let i = 1; i < snakeInstance.array.length; i++) {
        if (head.x === snakeInstance.array[i].x && head.y === snakeInstance.array[i].y) {
            endGame("SELF");
            return true;
        }
    }}
  
}

function foodCollisionCheck() {
    let head = snakeInstance.array[0];
    if (head.x === foodInstance.x && head.y === foodInstance.y) {
        score++; 
        foodInstance.reset();
        
    } else {
        snakeInstance.array.pop();
    }
}

function immuneCollisionCheck() {
    let head = snakeInstance.array[0];
    if (head.x === immunefood.x && head.y === immunefood.y) {
        score++; 
        isimmune = true;
        immuneCounter = 10 * fps; 
        foodInstance.reset();
        immunefood.reset();

         } else {
        snakeInstance.array.pop();
    }
}


function endGame(cause) {
    gameOver = true;
    stopanimation();
    
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER (" + cause + ")", w / 2, h / 2);
    ctx.fillText("Score: " + score, w / 2, h / 2 + 40);
    ctx.fillText("Press 'R' to Restart", w / 2, h / 2 + 80);
    sendScore(cause);
}

function restartGame() {
    stopanimation();
    gameOver = false;
    isPaused = false;
    score = 0;
    d = "right";
    snakeInstance.create();
    foodInstance.reset();
    animate();
}

function play(){
      snakeInstance.create();
      restartGame();  
}

function startingScreen() {
    ctx.fillStyle = "green";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press 'P' to Start", w / 2, h / 2);
}


startingScreen();

function startGame() {
    document.getElementById("rule_container").style.display = "none";
    document.getElementById("game-container").style.display = "block";
    document.getElementById("score-container").style.display = "block";
    document.getElementById("immunebar").style.display="block";
    document.getElementById("time_container").style.display="block";
    play();
}

function sendScore(cause) {
    const data = {
        score: score,
        cause: cause
    };
    fetch('http://127.0.0.1:5000/add_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Score saved to history:', result);
    })
    .catch((error) => {
        console.error('Error saving score:', error);
    });
}


