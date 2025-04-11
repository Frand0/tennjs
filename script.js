// initialize canvas
let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;

const MAX_COMPUTER_SPEED = 2;

// the ball
const BALL_SIZE = 5;
let ballPosition;

let xSpeed;
let ySpeed;

function initBall() {
    ballPosition = { x: 100, y: 50 };
    xSpeed = 4;
    ySpeed = 2;
}

//paddles

const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 20;
const PADDLE_OFFSET = 10;

let leftPaddleTop = 10;
let rightPaddleTop = 30;

//scoring

let leftScore = 0;
let rightScore = 0;

let gameOver = false;

document.addEventListener("mousemove", e => {
    rightPaddleTop = e.y - canvas.offsetTop;
});

// draw function to draw canvas and ball with one call
function draw() {
    // Fill canvas with black for background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);

    // The rest remains white
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

    //Draw scores
    ctx.font = "30px monospace";
    ctx.textAlign = "left";
    ctx.fillText(leftScore.toString(), 50, 50);
    ctx.textAlign = "right";
    ctx.fillText(rightScore.toString(), width - 50, 50);
};

// left paddle opponent follows top and bottom points of ball

function followBall() {
    let ball = {
        top: ballPosition.y,
        bottom: ballPosition.y + BALL_SIZE
    };
    let leftPaddle = {
        top: leftPaddleTop,
        bottom: leftPaddleTop + PADDLE_HEIGHT
    };

    if (ball.top < leftPaddle.top) {
        leftPaddleTop -= MAX_COMPUTER_SPEED;
    } else if (ball.bottom > leftPaddle.bottom) {
        leftPaddleTop += MAX_COMPUTER_SPEED;
    };
};


function update() {
    ballPosition.x += xSpeed;
    ballPosition.y += ySpeed;
    followBall();
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

//adjust angle the ball bounces back at if it hits top or bottom of paddle

function adjustAngle(distanceFromTop, distanceFromBottom) {
    if (distanceFromTop < 0) {
        // ball hits top of paddle, reduce ySpeed
        console.log("Top hit!");
        ySpeed -= 0.5;
    } else if (distanceFromBottom < 0) {
        // ball hits bottom of paddle, increase ySpeed
        console.log("Bottom hit!");
        ySpeed += 0.5;
    };
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
        let distanceFromTop = ball.top - leftPaddle.top;
        let distanceFromBottom = leftPaddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        xSpeed = Math.abs(xSpeed);
    }

    if (checkPaddleCollision(ball, rightPaddle)) {
        //right p collision
        let distanceFromTop = ball.top - rightPaddle.top;
        let distanceFromBottom = rightPaddle.bottom - ball.bottom;
        adjustAngle(distanceFromTop, distanceFromBottom);
        xSpeed = -Math.abs(xSpeed);
    };

    if (ball.left < 0) {
        rightScore++;
        initBall();
    };

    if (ball.right > width) {
        leftScore++;
        initBall();
    };

    if (leftScore > 9 || rightScore > 9) {
        gameOver = true;
    };

    if (ball.left < 0 || ball.right > width) {
        xSpeed = -xSpeed;
    };

    if (ball.top < 0 || ball.bottom > height) {
        ySpeed = -ySpeed;
    };
};

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", width / 2, height / 2);
}

function gameLoop() {
    draw();
    update();
    checkCollision();

    if (gameOver) {
        draw();
        drawGameOver();
    } else {
        setTimeout(gameLoop, 25);
    };
};

initBall();
gameLoop();
