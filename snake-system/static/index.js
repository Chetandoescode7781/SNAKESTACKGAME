 const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

const cw = 10;                    // Cell width
const w = canvas.width;
const h = canvas.height;

let snake_array = [];
let food = {};
let score = 0;
let d = "right";                  // Current direction
let gameLoop;

// Create initial snake
function create_snake() {
    snake_array = [];
    for (let i = 4; i >= 0; i--) {
        snake_array.push({ x: i, y: 0 });
    }
}

// Create random food
function create_food() {
    food = {
        x: Math.round(Math.random() * (w - 20) / cw),
        y: Math.round(Math.random() * (h - 20) / cw)
    };
}

// Paint a single cell
function paint_cell(x, y, color = "lime") {
    ctx.fillStyle = color;
    ctx.fillRect(x * cw, y * cw, cw, cw);
    ctx.strokeStyle = "#111";
    ctx.strokeRect(x * cw, y * cw, cw, cw);
}
function paint() {
    // Clear canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, w, h);

    // Draw snake
    for (let i = 0; i < snake_array.length; i++) {
        let color = (i === 0) ? "#00ff00" : "lime";   // Head brighter
        paint_cell(snake_array[i].x, snake_array[i].y, color);
    }

    // Draw food
    paint_cell(food.x, food.y, "red");
}

// Initialize and show design
create_snake();
create_food();
paint();