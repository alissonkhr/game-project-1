const canvas = document.querySelector("canvas"); // grabs canvas element
// console.log(canvas)

const c = canvas.getContext("2d"); // this function is used to access the canvas tags 2D drawing functions that will be implemented later for the game

canvas.width = 1024;
canvas.height = 576; // takes up width and height of window

const gravity = 0.5;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 1,
    }; // how fast the player will move along the canvas axes

    this.opacity = 1;

    const playerImage = new Image();
    playerImage.src = "./images/link.png";
    playerImage.onload = () => {
      const scale = 0.1;
      this.image = playerImage;
      this.width = playerImage.width * scale;
      this.height = playerImage.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height,
      }; // where the player will be positioned on the canvas (bottom center)
    };
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.save();
    c.globalAlpha = this.opacity;
    if (this.image)
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    c.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity;
      else this.velocity.y = 0;
    }
  }
}

class Particle {
  constructor({ position, velocity, radius, color }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.opacity -= 0.01;
  }
}

class Jar {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    }; // how fast the jar will move down the canvas

    const jarImage = new Image();
    jarImage.src = "./images/jar.png";
    jarImage.onload = () => {
      const scale = 0.044;
      this.image = jarImage;
      this.width = jarImage.width * scale;
      this.height = jarImage.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      }; // where the jar will be positioned on the canvas
    };
  }

  draw() {
    // c.fillStyle = 'blue'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    if (this.image)
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.jars = [];

    // const columns = Math.floor(Math.random() * 4 + 4);
    // const rows = Math.floor(Math.random() * 1 + 1);

    // this.width = columns * 10;

    for (let x = 0; x < 6; x++) {
      for (let y = 0; y < 1; y++) {
        this.jars.push(
          new Jar({
            position: {
              x: x * 196,
              y: 0,
            },
          })
        );
      }
    }
    console.log(this.jars, "jars array");
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 1.5;

    /*if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 24;
    }*/
  }
}

const player = new Player(); // instantiate player from Player class
const grids = [];
const particles = [];
const keys = {
  arrowLeft: {
    pressed: false,
  },
  arrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
//let interval = 1;
let game = {
  over: false,
  active: true,
};
let score = 0;
let lives = 3;
let gameTime = 60;

function createParticles({ object, color }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },

        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },

        radius: Math.random() * 3,

        color: color || "#795548",
      })
    );
  }
}

function animatePlayer() {
  if (!game.active) return;
  requestAnimationFrame(animatePlayer);
  c.fillStyle = "tan";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  particles.forEach((particle, i) => {
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });
  grids.forEach((grid) => {
    grid.update();
    grid.jars.forEach((jar, i) => {
      jar.update({ velocity: grid.velocity });

      // removes jars when player collides
      if (
        player.position.y + player.height >= jar.position.y &&
        player.position.y <= jar.position.y + jar.height &&
        player.position.x + player.width >= jar.position.x &&
        player.position.x <= jar.position.x + jar.width
      ) {
        lives -= 1;
        $("#livesEle").html(lives);
        createParticles({
          object: player,
          color: "red",
        });
        //console.log("collide");
        setTimeout(() => {
          grid.jars.splice(i, 1);
        }, 0);

        setTimeout(() => {
          if (lives === 0) {
            player.opacity = 0;
            game.over = true;
            clearInterval(gameCounter);
          }
        }, 0);

        setTimeout(() => {
          if (lives === 0) game.active = false;
        }, 2000);
      } else if (
        player.position.y + player.height <= jar.position.y &&
        player.position.y <= jar.position.y + jar.height &&
        player.position.x + player.width >= jar.position.x &&
        player.position.x <= jar.position.x + jar.width
      ) {
        score += 1;
        $("#scoreEle").html(score);
        createParticles({
          object: jar,
        });
        //console.log("collide");
        setTimeout(() => {
          grid.jars.splice(i, 1);
        }, 0);
      } else if (jar.position.y >= canvas.height) {
        setTimeout(() => {
          grid.jars.splice(i);
        }, 0);
      }
    });
  });

  if (keys.arrowLeft.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (
    keys.arrowRight.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
  } else if (keys.space.pressed && player.position.y <= canvas.height) {
    player.velocity.y = -7;
  } else {
    player.velocity.x = 0;
  }
  // spawning enemies
  if (frames % 400 === 0) {
    grids.push(new Grid());
    //interval = Math.floor(Math.random() * 800 + 600);
  }

  frames++;
}

const gameCounter = setInterval(gameTimer, 1000);

function gameTimer() {
  gameTime = gameTime - 1;
  if (gameTime <= -1) {
    clearInterval(gameCounter);
    player.opacity = 0;
    game.over = true;
    game.active = false;
    return;
  }
  $("#timerEle").html(`${gameTime} seconds`);
}

animatePlayer();

window.addEventListener("keydown", (event) => {
  if (game.over) return;
  switch (event.key) {
    case "ArrowLeft":
      console.log("left");
      keys.arrowLeft.pressed = true;
      break;
    case "ArrowRight":
      console.log("right");
      keys.arrowRight.pressed = true;
      break;
    case " ":
      console.log("space");
      keys.space.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowLeft":
      console.log("left");
      keys.arrowLeft.pressed = false;
      break;
    case "ArrowRight":
      console.log("right");
      keys.arrowRight.pressed = false;
      break;
    case " ":
      console.log("space");
      keys.space.pressed = false;
      break;
  }
});
