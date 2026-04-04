 const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const cw = 10;                 
const w = canvas.width;
const h = canvas.height;

let score = 0;
let d = "right";        
let gameLoop;
let gameOver = false;

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
            let color = (i === 0) ? "#00ff00" : "lime"; // Head brighter
            paint_cell(this.array[i].x, this.array[i].y, color);
        }
    }

    move(speed = 1) {
        let head = { x: this.array[0].x, y: this.array[0].y };

        if (d === "right") head.x+=speed;
        else if (d === "left") head.x-=speed;
        else if (d === "up") head.y-=speed;
        else if (d === "down") head.y+=speed;

        this.array.unshift(head);

        this.array.pop();
    }
}

// Create random food
class food{
            constructor(x,y){
             this.x=x;
             this.y=y;
            }

  create_food(){
   paint_cell(this.x, this.y, "orange");
}

move_food(){
    this.x+=0;
    this.y+=0;
}
}

Snake = new Snake();
food = new food(Math.floor(Math.random() * (w / cw)), Math.floor(Math.random() * (h / cw)));

  Snake.create();

let requestId;

function animate() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
    Snake.move();
    wallCollisionCheck();
    foodCollisionCheck();
    Snake.draw();
    food.create_food();
    food.move_food();
    if (!gameOver) {
        requestId = requestAnimationFrame(animate);
    }
}

function stopanimation() {
    cancelAnimationFrame(requestId);
}

function wallCollisionCheck() {
    let head = Snake.array[0];
    if (head.x < 0 || head.x >= w / cw || head.y < 0 || head.y >= h / cw) {
        stopanimation();
            gameOver = true;
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over! Score: " + score, w / 2 -150, h / 2);
    }
}

function foodCollisionCheck() {
    let head = Snake.array[0];
    if (head.x === food.x && head.y === food.y) {
        score++;
        food.x = Math.floor(Math.random() * (w / cw));
        food.y = Math.floor(Math.random() * (h / cw));
        Snake.array.push({ x: head.x, y: head.y }); // Grow snake
    }
}

animate();