const canvas = document.querySelector('canvas') // grabs canvas element
// console.log(canvas)

const c = canvas.getContext('2d') // this function is used to access the canvas tags 2D drawing functions that will be implemented later for the game

canvas.width = window.innerWidth
canvas.height = window.innerHeight // takes up width and height of window

class Player {
    constructor() {
        this.position = {
            x: 200,
            y: 200
        } // where the player will be positioned on the canvas
        
        this.velocity = {
            x: 0,
            y: 0
        } // how fast the player will move along the canvas axes

        // this.image = none yet
        this.width = 100
        this.height = 100 // player will have box collision detection
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height) // temp player is red box
    }
}

const player = new Player() // instantiate player from Player class

player.draw() // player is now on canvas

