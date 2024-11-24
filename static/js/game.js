const images = {
    "tube": '/static/images/tube.png', 
    "background": '/static/images/background.png'
}


const birdImages = ['/static/images/bird/0.png', '/static/images/bird/1.png', '/static/images/bird/2.png']

let loaded_images = 0;

const canvas = document.getElementById("screen");

let canvasW;
let canvasH;
let bird;
let tubes = [];
let tubesCounter = 50;

let score = 0





class Bird {
    constructor (x, y) {
        this.x = x
        this.y = y
        this.image = birdImages[2]
        this.gravity = 1;
        this.jump_power = 15;
        this.is_jump = false
        this.is_alive = true

    }

    draw (ctx) {
    
        ctx.drawImage(this.image, this.x - 17, this.y - 12, 34, 24)
    }

    changePosition () {
        if (this.is_jump) {
            this.gravity = 1
            this.jump() 
        }
        else {
            this.image = birdImages[2]
        }
        this.y += this.gravity
        this.gravity += 0.5
    }

    jump () {
        this.y -= this.jump_power
        if (this.jump_power > 7) {
            this.image = birdImages[0]
        }
        else {
            this.image = birdImages[1]
        }
        if (this.jump_power > 0) {
            this.jump_power -= 1
        }
        else {
            this.jump_power = 12
            this.is_jump = false
        }
    }

    dieOrChangeScore () {
        if (this.y > 680) {
            this.is_alive = false
        } 
        if (this.y < 20) {
            this.is_alive = false
        } 

        for (let i = 0; i < tubes.length; i++) {
            let tube = tubes[i]
            if (tube.upTube.x <= this.x && tube.upTube.x + 50 >= this.x) {

                if (tube.upTube.y + 375 > this.y) {
                
                    this.is_alive = false
                }
                else if (tube.downTube.y < this.y) {
                    
                    this.is_alive = false
                }

                if (!tube.is_passed && tube.upTube.y + 350 < this.y && tube.invisTube.y + 350 + tube.upTube.y > this.y) {
                    score += 1
                    tube.is_passed = true
                }
            }
        }
    }
}



function pressed_space(e) {
    if (e.keyCode == 32) {

        bird.is_jump = true
        bird.jump_power = 12
    }
}


class Tube {
    constructor (x, y, is_draw) {
        this.x = x
        this.y = y
        this.image = images.tube
        this.speed = 5
        this.is_draw = is_draw

    }

    move () {
        this.x -= this.speed
    }

    draw (ctx) {
        if (this.is_draw) {
            ctx.drawImage(this.image, this.x, this.y, 50, 375)
        }
    }
}

class TubeGroup {
    constructor (upTube, downTube, invisTube) {
        this.upTube = upTube
        this.downTube = downTube
        this.invisTube = invisTube
        this.is_passed = false
    }

    draw (ctx) {
        this.upTube.draw(ctx)
        this.downTube.draw(ctx)
        this.invisTube.draw(ctx)
    }
    move () {
        this.upTube.move()
        this.downTube.move()
        this.invisTube.move()
    }
}


function generateTube() {
    upTubeDownY = random(250, 350)
    widthBetweenTubes = random(100, 400)
    let upTube = new Tube(canvasW, upTubeDownY - 350, true)
    let downTube = new Tube(canvasW, upTubeDownY + widthBetweenTubes, true)
    let invisTube = new Tube(canvasW, widthBetweenTubes, false)
    let tube = new TubeGroup(upTube, downTube, invisTube)
    tubes.push(tube)

}

function removeTube() {
    for (let i = 0; i < tubes.length; i++) {
        if (tubes[i].upTube.x < -60) {
            tubes.shift(i)
        }
    }
}

function drawTubes(ctx) {
    tubes.forEach((tube) => {
        tube.draw(ctx)
    })
}

function updateTubes() {
    tubes.forEach((tube) => {
        tube.move()
    })
}


function drawScore(ctx) {
    ctx.font = "48px serif";
    let textSize = ctx.measureText(score)
    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillText(score, canvasW - 50 - textSize.width, 50);
}










function loadAllImages() {

    Object.keys(images).forEach((image_title) => {
        let img = new Image()

        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === Object.keys(images).length) {
                startGame()
            }
        });
        img.src = images[image_title]
        images[image_title] = img
    })
}

function loadBirdImages() {

    for (let i = 0; i < birdImages.length; i++) {
        let img = new Image()

        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === birdImages.length) {
                loaded_images = 0
                loadAllImages()
                

            }
        });
        img.src = birdImages[i]
        birdImages[i] = img
    }
}





function random(a, b) {
    return Math.random() * (b - a) + a
}


function makeFullscreen() {
    canvas.width = 700
    canvas.height = 700

    canvasW = canvas.width
    canvasH = canvas.height
}


function drawBackground(ctx) {
    ctx.drawImage(images.background, 0, 0, canvasW, canvasH)
}


function drawFrame() {
    makeFullscreen()

    const ctx = canvas.getContext("2d")

    drawBackground(ctx)
    bird.draw(ctx)
    drawTubes(ctx)
    drawScore(ctx)

    if (bird.is_alive) {

        if (tubesCounter == 50) {
            tubesCounter = 0
            generateTube()
        }
        tubesCounter += 1
        bird.changePosition()
    
        updateTubes()
    }
    bird.dieOrChangeScore()

    if (!bird.is_alive) {
        document.getElementById('message').style.display = "block"
        document.getElementById('score').innerText = "YOUR SCORE: " + score
    }
    

}



function reStartGame() {
    document.getElementById('message').style.display = "none"
    score = 0
    tubesCounter = 50
    tubes = []
    makeFullscreen()
    bird = new Bird(canvasW/2, canvasH/2)

    addEventListener('keydown', pressed_space)
}




function startGame() {
    document.getElementById('message').style.display = "none"
    score = 0
    tubesCounter = 50
    tubes = []
    makeFullscreen()
    bird = new Bird(canvasW/2, canvasH/2)
    setInterval(drawFrame, 20)

    addEventListener('keydown', pressed_space)
}

loadBirdImages()
