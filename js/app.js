const canvas = document.querySelector("canvas"); // grabs canvas element
// console.log(canvas)

const c = canvas.getContext("2d"); // this function is used to access the canvas tags 2D drawing functions that will be implemented later for the game

canvas.width = window.innerWidth;
canvas.height = window.innerHeight; // takes up width and height of window

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    }; // how fast the player will move along the canvas axes

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
    }
  }
}

const player = new Player(); // instantiate player from Player class
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

  if (keys.arrowLeft.pressed && player.position.x >= 0) {
    player.velocity.x = -5;
  } else if (
    keys.arrowRight.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 5;
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
      break;
  }
});
