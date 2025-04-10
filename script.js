// initialize canvas
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;



// the ball
const BALL_SIZE = 5;
let ballPosition = { x: 20, y: 30 };

let xSpeed = 4;
let ySpeed = 2;

//paddles

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 20;
const PADDLE_OFFSET = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

document.addEventListener("mousemove", e => {
    rightPaddleTop = e.y - canvas.offsetTop;
});

// draw function to draw canvas and ball with one call
function draw() {
    // Fill canvas with black for background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // The rrest remains white
    ctx.fillStyle = "white";

    // Draw ball
    ctx.fillRect(ballPosition.x, ballPosition.y, BALL_SIZE, BALL_SIZE);

    // Draw paddles
    ctx.fillRect(
        PADDLE_OFFSET,
        leftPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );

    ctx.fillRect(
        width - PADDLE_WIDTH - PADDLE_OFFSET,
        rightPaddleTop,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
    );
};

function update() {
    ballPosition.x += xSpeed;
    ballPosition.y += ySpeed;
};

function checkPaddleCollision(ball, paddle) {
    //check if paddle and ball overlap horz or vert
    return (
        ball.left < paddle.right &&
        ball.right > paddle.left &&
        ball.top < paddle.bottom &&
        ball.bottom > paddle.top
    );
};

// check when ball collides and reverse speed
function checkCollision() {
    let ball = {
        left: ballPosition.x,
        right: ballPosition.x + BALL_SIZE,
        top: ballPosition.y,
        bottom: ballPosition.y + BALL_SIZE
    }

    let leftPaddle = {
        left: PADDLE_OFFSET,
        right: PADDLE_OFFSET + PADDLE_WIDTH,
        top: leftPaddleTop,
        bottom: leftPaddleTop + PADDLE_HEIGHT
    };

    let rightPaddle = {
        left: width - PADDLE_WIDTH - PADDLE_OFFSET,
        right: width - PADDLE_OFFSET,
        top: rightPaddleTop,
        bottom: rightPaddleTop + PADDLE_HEIGHT
    };

    if (checkPaddleCollision(ball, leftPaddle)) {
        //left p collision
        xSpeed = Math.abs(xSpeed);
    }

    if (checkPaddleCollision(ball, rightPaddle)) {
        //right p collision
        xSpeed = -Math.abs(xSpeed);
    }

    if (ball.left < 0 || ball.right > width) {
        xSpeed = -xSpeed;
    };
    if (ball.top < 0 || ball.bottom > height) {
        ySpeed = -ySpeed;
    };
};

ballMove = false;

function gameLoop() {
    draw();
    update();
    checkCollision();
    // call again after timeout
    setTimeout(gameLoop, 30);
    if (ballMove == true) {
        xSpeed = 0;
        ySpeed = 0;
    };
};

function resetGame() {
    xSpeed = 4;
    ySpeed = 2;
    ballMove = false;
    clearTimeout(gameLoop);
    ctx.clearRect(0, 0, width, height);
};



//Start, pause buttons

document.querySelector("#startGame").addEventListener("click", e => {
    resetGame();
    gameLoop();
});


document.querySelector("#pauseGame").addEventListener("click", e => {
    ballMove = true;
});













