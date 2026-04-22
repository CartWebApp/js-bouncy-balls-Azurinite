// BOUNCY BALL SETTINGS
const density = 1;



// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
// getContext('2d') enables use of 2d drawing graphic methods on the canvas

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate random number
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function findHypotenuse(x, y) {
  return Math.sqrt(x * x + y * y)
}

function Ball(x, y, velX, velY, color, size) {
  // Using "this" turns the function into an class (name of function is now a class)
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

Ball.prototype.draw = function() {
  ctx.beginPath(); // draw a shape on the paper
  ctx.fillStyle = this.color; // define shape's color
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // trace arc ; draw circumference?
  ctx.fill(); // finish drawing the path we started at .beginPath() ; fill in the circle?
}

Ball.prototype.update = function() {
  // Check if ball has reached any of the four edges of the canvas
    // Inside of if statements: make the ball travel in the opposite direction

  // *** This only updates properties of the balls, you need to redraw at new position with .draw()

  // size is more like radius - add size to make ball bounce off of its perimeter
  if ((this.x + this.size) >= width) { // right edge
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) { // left edge edge
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) { // bottom edge
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) { // top edge
    this.velY = -(this.velY);
  }
  // From this we can assume (0,0) is the left-top of the canvas

  this.x += this.velX;
  this.y += this.velY;
}

Ball.prototype.collisionDetect = function() {
  // class method so this = checked ball

  // Loop through all the balls (in all these for loops you really can just use "for of" loops.. but this doc is old, right?)
  // We need to check if the
  for (let j = 0; j < balls.length; j++) {
    // If we are not iterating over the ball we want, (becus we don't want to check if a ball is colliding with itself)
    const iteratedBall = balls[j]
    if (!(this === iteratedBall)) {
      // Calculate using a distance check to see if they're close enough to be considered colliding
      // Woah, calculus :'). Average rate of change
      const dx = this.x - iteratedBall.x;
      const dy = this.y - iteratedBall.y;
      // Pythagorean Theorem
      const distance = findHypotenuse(dx, dy);

      if (distance < this.size + iteratedBall.size) {
        // Balls bounce off each other when they collide
        // Density equation: p = m/v --> m = pv, (okay i'm actually calculating area and not volume but just nevermind that alright)
        const thisMass = 3 //((4/3) * Math.PI * this.size^3) * density;
        const iteratedMass = 3 //((4/3) * Math.PI * iteratedBall.size^3) * density;
        const thisVelInitial = findHypotenuse(this.velX, this.velY);
        // These equations are derived from the conservation of momentum and energy equations (we are simulating elastic collisions)
        const thisVelFinal = ((thisMass-iteratedMass)*thisVelInitial)/(thisMass+iteratedMass);
        const iteratedVelFinal = (2*thisMass*thisVelInitial)/(thisMass + iteratedMass);
        // Split into x and y components
        // I would turn this into a function but somehow the code breaks when I try it
        const thisInitialAngleFromHorizontal = Math.atan2((this.y - iteratedBall.y),(this.x - iteratedBall.x)) //Math.atan2(this.velY, this.velX)
        console.log(thisInitialAngleFromHorizontal)
        const thisFinalAngleFromHorizontal = (Math.PI) - thisInitialAngleFromHorizontal;
        const thisVelFx = thisVelFinal * Math.cos(thisFinalAngleFromHorizontal);
        const thisVelFy = thisVelFinal * Math.sin(thisFinalAngleFromHorizontal);

        // Set ball to the new velocity
        this.velX = thisVelFx;
        this.velY = thisVelFy;

        const iteratedInitialAngleFromHorizontal = Math.atan2((iteratedBall.y - this.y),(iteratedBall.x - this.x))
        console.log(iteratedInitialAngleFromHorizontal)
        const iteratedFinalAngleFromHorizontal = (Math.PI) - iteratedInitialAngleFromHorizontal;
        const iteratedVelFx = iteratedVelFinal * Math.cos(iteratedFinalAngleFromHorizontal);
        const iteratedVelFy = iteratedVelFinal * Math.sin(iteratedFinalAngleFromHorizontal);

        iteratedBall.velX = iteratedVelFx;
        iteratedBall.velY = iteratedVelFy;
      }
    }
  }
}


function loop() {
  // .fillStyle tells what color to make the rectangle we create below
  // It is slightly transparent to allow you to see trails of the balls
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  // Draw a rectangle to cover up the previous frame's drawing - This prevents you from seeing previous keyfames of the bouncing balls
  ctx.fillRect(0, 0, width, height); 

  // Now loop through each of the balls to move balls to new positions
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  // Recursive function: recall itself to infinitely loop
  requestAnimationFrame(loop);

  // Question: Why does this function not crash? There's no delay in the recursion, is there?
}



let balls = [];

while (balls.length < 2) {
  // Create a new ball whenever there are less than 25 balls
  let size = random(70,70);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size), // x
    random(0 + size,height - size), // y
    random(0,5), // velX
    random(0,5), // velY
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')', // color
    size //..size
  );

  balls.push(ball);
}

loop()