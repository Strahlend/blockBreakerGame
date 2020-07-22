//Program Name: Block Game
//Author: Eric Deering

//Mentions: Mozilla Team, Block Breaker Tutorial; David Bau, seed random

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

Math.seedrandom();

function ball(_x, _y)
{
    this.x = _x;
    this.y = _y;
    this.ballspeed = 2;
    this.dx = 1 * this.ballspeed;
    this.dy = -1 * this.ballspeed;
    this.active = true;
    this.hit = true;
}

var ballArray = [];

var newBall = new ball(canvas.width/2, canvas.height-30);
newBall.dx = Math.floor(Math.random() * 4);
let flip = Math.floor(Math.random() * 2)
if (flip == 0)
{
    newBall.dx = -newBall.dx;
}
ballArray.push(newBall);

//ball collision detection
var ballRadius = 4;

//paddle properties
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

//user input
var rightPressed = false;
var leftPressed = false;

//brick properties
var brickRowCount = 30;
var brickColumnCount = 16;
var brickWidth = 25;
var brickHeight = 12;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 5;

//scoreboard
var score = 0;

//for preventing game over lock up
var gameReset = true;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++)
{
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++)
    {
        bricks[c][r] = {x: 0, y: 0, status: 1};
    }
}

function drawBall()
{
    for (var i = 0; i < ballArray.length; i++)
    {
        if (ballArray[i].active == true)
        {
            ctx.beginPath();
            ctx.arc(ballArray[i].x, ballArray[i].y, ballRadius, 0, Math.PI*2);
            ctx.fillStyle = "#AC10FE";
            ctx.fill();
            ballArray[i].hit = false;
            ctx.closePath();
        }
    }
}

function drawPaddle()
{
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#AC10FE";
    ctx.fill();
    ctx.closePath();
}

function drawBricks()
{
    for (var c = 0; c < brickColumnCount; c++)
    {
        for (var r = 0; r < brickRowCount; r++)
        {
            if (bricks[c][r].status == 1)
            {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#AC10FE";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function collisionDetection()
{
    for (var c = 0; c < brickColumnCount; c++)
    {
        for (var r = 0; r < brickRowCount; r++)
        {
            var b = bricks[c][r];
            if (b.status == 1)
            {
                // calculations with array
                for (var i = 0; i < ballArray.length; i++)
                {
                    var p = ballArray[i];
                    var offset = 1;
                    if (p.x + offset > b.x + brickPadding / 2 && p.x - offset < b.x + brickWidth + brickPadding / 2 && p.y - offset > b.y - brickPadding / 2 && p.y + offset < b.y + brickHeight + brickPadding / 2 && p.hit == false)
                    {
                        if (p.x > b.x && p.x < b.x + brickWidth)
                        {
                            p.dx = -p.dx;
                            p.dy = -p.dy;
                        }
                        else
                        {
                            p.dy = -p.dy;
                        }
 
                        b.status = 0;
                        p.hit = true;
                        score++;
                        if (score == brickRowCount * brickColumnCount + 2)
                        {
                            alert("You Win, Congratulations!");
                            document.location.reload();
                        }
                    }
                }
            }
        }
    }
}

function drawScore()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function generateBall()
{
    //instantiate ball at the paddle moving upwards at a random angle

    var ballLimit = 10;
    var activeBalls = 0;

    let createBall = new ball(paddleX + paddleWidth/2, canvas.height - 40);
    createBall.dy = Math.floor(Math.random() * 2) + 2;
    while (createBall.dy > -1)
    {
        createBall.dy = -createBall.dy;
    }
    var leftOrRight = Math.floor(Math.random() * 2);
    if (leftOrRight == 0)
    {
        createBall.dx = -createBall.dx;
    }
    for (var i = 0; i < ballArray.length; i++)
    {
        let b  = ballArray[i];
        if (b.active == true)
        {
            activeBalls++;
        }
    }
    if (activeBalls < ballLimit)
    {
        ballArray.push(createBall);
    }
}

function draw()
{
    //erase everything in this rectangle
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //drawing code
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();

    //bounce of top wall compatible will ball array
    for (var i = 0; i < ballArray.length; i++)
    {
        if (ballArray[i].y + ballArray[i].dy < ballRadius)
        {
            ballArray[i].dy = -ballArray[i].dy;
        }
    }

    //game over and paddle bounce compatible with arrays
    for (var i = 0; i < ballArray.length; i++)
    {
        //ball hits bottom of cavas
        if (ballArray[i].y + ballArray[i].dy > canvas.height)
        {
            ballArray[i].active = false;

            for (var j = 0; j < ballArray.length; j++)
            {
                if (ballArray[j].active == true)
                {
                    break;
                }
                if (j+1 == ballArray.length && gameReset == true)
                {
                    gameReset = false;
                    //console.log("game over");
                    alert ("Game Over");
                    document.location.reload();
                }
            }
        }
        //ball hits paddle
        if (ballArray[i].y + ballArray[i].dy > canvas.height - paddleHeight)
        {
            if (ballArray[i].x > paddleX && ballArray[i].x < paddleX + paddleWidth && ballArray[i].active == true)
            {
                ballArray[i].dy = -ballArray[i].dy;
                ballArray[i].dx = ballArray[i].x - (paddleX + paddleWidth / 2);
                while (ballArray[i].dx > 6 || ballArray[i].dx < -6)
                {
                    ballArray[i].dx = ballArray[i].dx / 2;
                }
                generateBall();
            }
        }
    }

    //bounce off left or right side
    for (var i = 0; i < ballArray.length; i++)
    {
        if (ballArray[i].x + ballArray[i].dx > canvas.width-ballRadius || ballArray[i].x + ballArray[i].dx < ballRadius)
        {
            ballArray[i].dx = -ballArray[i].dx;
        }
    }

    //paddle movement
    if (rightPressed)
    {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width)
        {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if (leftPressed)
    {
        paddleX -= 7;
        if (paddleX < 0)
        {
            paddleX = 0;
        }
    }

    //ball movement
    for (var i = 0; i < ballArray.length; i++)
    {
        ballArray[i].x += ballArray[i].dx;
        ballArray[i].y += ballArray[i].dy;
    }

    //generate the next frame
    requestAnimationFrame(draw);
}
//listen for key down and key up
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//mouse listener
document.addEventListener("mousemove", mouseMoveHandler, false);

//intital touch listener
document.addEventListener("touchstart", handleStart, false);
//continous touch while moving listener
document.addEventListener("touchmove", handleMove, false);


//input functions
function keyDownHandler(e) 
{
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d")
    {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a")
    {
        leftPressed = true;
    }
}

function keyUpHandler(e)
{
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d")
    {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key =="a")
    {
        leftPressed = false;
    }
}

function mouseMoveHandler(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function handleStart(e)
{
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function handleMove(e)
{
    var relativeX = e.touches[0].clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width)
    {
        paddleX = relativeX - paddleWidth / 2;
    }
    console.log(e.touches[0].clientX);
}

//old way to draw frames
//setInterval(draw, 10);

//new way to draw frames
//get new frame now incorporated in the draw function
draw();