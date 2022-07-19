const canvas = document.querySelector("canvas"); // grabs canvas element
// console.log(canvas)

const c = canvas.getContext("2d"); // this function is used to access the canvas tags 2D drawing functions that will be implemented later for the game

canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // takes up width and height of window

const gravity = 0.5;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 1,
    }; // how fast the player will move along the canvas axes

    const jarImage = new Image();
    jarImage.src = "./images/link.png";
    jarImage.onload = () => {
      const scale = 0.1;
      this.image = jarImage;
      this.width = jarImage.width * scale;
      this.height = jarImage.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height,
      }; // where the player will be positioned on the canvas (bottom center)
    };
  }

  draw() {
    // c.fillStyle = 'red'
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
    // c.fillStyle = 'red'
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

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 3,
      y: 0,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.jars = [];

    const columns = Math.floor(Math.random() * 4 + 3)
    const rows = Math.floor(Math.random() * 2 + 1)

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.jars.push(
          new Jar({
            position: {
              x: x * 188,
              y: y * 241,
            },
          })
        );
      }
    }
    console.log(this.jars);
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

  }
}

const player = new Player(); // instantiate player from Player class
const grids = [new Grid()];
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

function animatePlayer() {
  requestAnimationFrame(animatePlayer);
  c.fillStyle = "tan";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  grids.forEach((grid) => {
    grid.update();
    grid.jars.forEach((jar) => {
      jar.update();
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
}

animatePlayer();

window.addEventListener("keydown", (event) => {
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
