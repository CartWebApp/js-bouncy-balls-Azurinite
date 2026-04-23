// I spent way more time than I should've on this.
/* Some personal reflection comments from me: 
Why did I do this :') it was pretty fun though

This was my attempt to make the balls collide off each other with real physics, including conservation of momentum and KE.
This assumes all collisions are perfectly elastic, of course

It works really well - the direction is accurate, and so are the final speeds accounting for transfer of momentum. 
The only issue is that sometimes balls will stick into each other.
I think this happens when the balls clip into each other too far for their new velocities to bounce them out.
I already invested like 5 hours so I probably won't fix it, but...
It's kind of fun to watch when it happens though, it's like a random event, and sometimes the clumps explode.

I used the Socratic AI tutor method a LOT to help me.
I have the full conversation saved and it's pretty interesting.
I would recommend the method for any mathematical/physics calculations that are difficult to understand.
I learnt how to compute dot notations given x and y components, calculate unit vectors/normals, and apply those in equations.

*/

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
      // Woah, calculus :'). Rate of change
      const dx = this.x - iteratedBall.x;
      const dy = this.y - iteratedBall.y;
      // Pythagorean Theorem
      let distance = findHypotenuse(dx, dy);
      const limit = this.size + iteratedBall.size;

      // Now this is where the logic for balls bouncing off each other is
      if (distance < limit) {
        distance = limit;
        /* ^ Act as if balls are colliding exactly on their perimeters
        lessons some of the loss of speed and clipping behaviors;
        remove this if you want to see some funny stuff */


        // Density equation: p = m/v --> m = pv, (This is just assuming theyre all spheres)
        // I actually just removed "p" since it doesn't really effect anything... so actually this mass is just volume. But don't tell anyone that, alright?
        const thisMass = ((4/3) * Math.PI * this.size**3); 
        const iteratedMass = ((4/3) * Math.PI * iteratedBall.size**3);

        // Find normalized center-to-center vectors
        const nx = dx/distance
        const ny = dy/distance
        // Find dot product (measures how much the vectors point in the same direction)
        const thisDotProduct = (this.velX*nx) + (this.velY*ny);
        const iteratedDotProduct = (iteratedBall.velX*nx) + (iteratedBall.velY*ny);
        // Now apply the vector to 1D equations
        // These equations are derived from the conservation of momentum and energy equations (we are simulating elastic collisions)
        const thisSpeedFinal = ((thisMass-iteratedMass)*thisDotProduct + (2*iteratedMass*iteratedDotProduct))/(thisMass+iteratedMass);
        const iteratedSpeedFinal = ((thisMass-iteratedMass)*iteratedDotProduct + (2*thisMass*thisDotProduct))/(thisMass + iteratedMass);

        // Now this is where the actual physics applications come in
        // Split the discovered 1D scalar velocity back into x and y components
        const thisVelFxNorm = nx * thisSpeedFinal;
        const thisVelFyNorm = ny * thisSpeedFinal;

        // original velocity = normal component + perpendicular component
        // perpendicular = original - normal
        const thisVelXPerp = this.velX - (nx*thisDotProduct);
        const thisVelYPerp = this.velY - (ny*thisDotProduct);
        const thisVelFx = thisVelFxNorm + thisVelXPerp;
        const thisVelFy = thisVelFyNorm + thisVelYPerp;
        // Set ball to the new velocity
        this.velX = thisVelFx;
        this.velY = thisVelFy;


        // Repeated with iterated ball
        const iteratedVelFxNorm = nx * iteratedSpeedFinal;
        const iteratedVelFyNorm = ny * iteratedSpeedFinal;
        const iteratedVelXPerp = iteratedBall.velX - (nx*iteratedDotProduct);
        const iteratedVelYPerp = iteratedBall.velY - (ny*iteratedDotProduct);
        const iteratedVelFx = iteratedVelFxNorm + iteratedVelXPerp;
        const iteratedVelFy = iteratedVelFyNorm + iteratedVelYPerp;
        iteratedBall.velX = iteratedVelFx;
        iteratedBall.velY = iteratedVelFy;

        this.draw();
        iteratedBall.draw();
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

while (balls.length < 30) {
  // Create a new ball whenever there are less than 25 balls
  let size = random(10,30);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size,width - size), // x
    random(0 + size,height - size), // y
    random(-10,10), // velX
    random(-10,10), // velY
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')', // color
    size //..size
  );

  balls.push(ball);
}

loop()