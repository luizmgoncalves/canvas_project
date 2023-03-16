class Cano{
    constructor(pos_x){
        this.gap = 300

        this.x = pos_x
        this.y = Math.random() * (SCREEN_HEIGHT-this.gap)
        
        this.length = 100

        this.passed = false

        this.color = "rgb(0, 255, 0)"

        this.uimage = document.getElementById("up_pipe");
        this.dimage = document.getElementById("down_pipe");

        this.w = 191
        this.h = 2000

        this.vx = 6
    }

    draw(ctx){
        
        //ctx.fillStyle = this.color
        //ctx.fillRect(this.x, 0, this.w, this.y)

        ctx.drawImage(this.dimage, this.x, this.y-this.h, this.w, this.h)

        //ctx.fillRect(this.x, this.y+this.gap, this.length, SCREEN_HEIGHT-(this.y+this.gap))

        ctx.drawImage(this.uimage, this.x, this.y+this.gap, this.w, this.h)
    }

    update_pos(){
        this.x -= this.vx
        if (this.x+this.w < 0){
            this.x = SCREEN_WIDTH
            this.y = Math.random() * (SCREEN_HEIGHT-this.gap)
            this.passed = false
        }
    }
}


class Button {
    constructor(pos_x, pos_y, width, height, color, darker_color, text){
        this.x = pos_x
        this.y = pos_y
        this.w = width
        this.h = height

        this.text = text
        this.color = color
        this.dcolor = darker_color

        this.state = "none" // over/none

        this.rad = 40

        this.action = ()=>{}
    }

    draw(ctx){
        ctx.fillStyle = this.state== "none" ? this.color : this.dcolor

        ctx.beginPath();

        ctx.roundRect(this.x, this.y, this.w, this.h, this.rad)

        ctx.fill()

        ctx.closePath()

        ctx.fillStyle = "rgb(0, 0, 0)"

        ctx.fillText(this.text, this.x+this.w/10, this.y+this.h/1.9, this.w/10*8)
    }

    collide(x, y){
        if (x >= this.x && x <= this.x+this.w){
            if (y >= this.y && y <= this.y+this.h){
                return true
            }
        }

        return false
    }
}

class Player{
    constructor (){
        this.w = 140

        this.h = 95

        this.pos_x = SCREEN_WIDTH/2 - this.w/2
        this.pos_y = 0
        this.vx = 0
        this.vy = 1

        this.image = document.getElementById("source");

        this.score = 0

        this.total_x = ()=>{return this.w}
        this.total_y = ()=>{return this.h}

        this.init_x = ()=>{return this.pos_x}
        this.init_y = ()=>{return this.pos_y}

        this.lineWidth = 5
    }

    update_pos(){
        this.pos_x += this.vx
        this.pos_y += this.vy
        if (this.pos_y < 0){
            this.pos_y = 0
            this.vy = 0
        }
        if (this.pos_y + this.h > SCREEN_HEIGHT){
            this.pos_y = SCREEN_HEIGHT - this.h
            this.vy = 0
        }

        if (this.pos_x < 0){
            this.pos_x = 0
            this.vx = 0
        }
        if (this.pos_x + this.w > SCREEN_WIDTH){
            this.pos_x = SCREEN_WIDTH - this.w
        }
    }

    update_vel(){
        this.vy += GRAVITY
        if (STATE.up){
            this.vy = -15
        }
        if (STATE.right){
            this.vx = 5
        }
        if (STATE.left){
            this.vx = -5
        }
        this.vx *= 0.96
    }

    clear(ctx){
        ctx.clearRect(this.init_x(), this.init_y(), this.total_x(), this.total_y())
    }
    draw(ctx, fill){
        ctx.fillStyle = this.color
        //ctx.beginPath()
        ctx.save()
        ctx.translate(this.pos_x+this.w/2, this.pos_y+this.h/2)

        ctx.rotate(((this.vy < 0 ? this.vy * 2 : this.vy) * Math.PI) / 180);

        ctx.translate(-(this.pos_x+this.w/2), -(this.pos_y+this.h/2))

        ctx.drawImage(this.image, this.pos_x, this.pos_y, this.w, this.h)

        ctx.restore()
        
        /*arc(this.pos_x+this.radius, this.pos_y+this.radius, this.radius, 0, Math.PI*2, true)
        if (fill){
            ctx.fill()
        }*/
        //ctx.lineWidth = this.lineWidth;
        //ctx.stroke()
        //ctx.closePath()
    }

    test_passed(cano){
        if (this.pos_x > (cano.x + cano.w) && !cano.passed){
            this.score ++
            cano.passed =  true
            console.log(this.score)
        }
    }

    collide(cano){
        let v1 = this.pos_x
        let v2 = v1 + this.w

        let between = false

        cano.color = "rgb(0, 255, 0)"

        if(v1 >= cano.x && v1 <= (cano.x + cano.length)){
            
            between = true
        }

        if(v2 >= cano.x && v2 <= (cano.x + cano.length)){
            between = true
        }

        if(v1 < cano.x && v2 > (cano.x + cano.length)){
            between = true
        }

        // testes para saber se o player está entre as pontas do cano (no plano x)

        if (!between){ // se ele não estiver retorna falso
            return false
        }

        v1 = this.pos_y
        v2 = this.pos_y + this.h

        if (v1 <= cano.y || v2 >= (cano.y + cano.gap)){
            cano.color = "rgb(255, 0, 0)"
            this.score = 0
            cano.passed = true
            return true
        }

        


    }
}

function  getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect(), // abs. size of element
      scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
      scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y
  
    return {
      x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
      y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

function mouse_move_handler(event){
    for (let i=0; i<ALL_BUTTONS.length; i++){
        let pos = getMousePos(screen, event)
        if(ALL_BUTTONS[i].collide(pos.x, pos.y)){
            ALL_BUTTONS[i].state = "over"
        }else{
            ALL_BUTTONS[i].state = "none"
        }
    }
}

function mouse_click_handler(event){
    for (let i=0; i<ALL_BUTTONS.length; i++){
        let pos = getMousePos(screen, event)
        if(ALL_BUTTONS[i].collide(pos.x, pos.y)){
            ALL_BUTTONS[i].action()
            return
        }
    }

    STATE[mouse.clicked] = true
}

function mouse_unclick_handler(event){
    STATE[mouse.clicked] = false
}


GRAVITY = 1.7

ALL_BUTTONS = []

SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080

var player = new Player()

var canos = []

for (let i=0; i<3; i++){
    canos[i] = new Cano(SCREEN_WIDTH + (SCREEN_WIDTH / 3) * i)
}



var keys = {w: 'up', a: 'left', s: 'down', d: 'right'}

var mouse = {clicked: 'up'}

var STATE = {up: false, left: false, right: false}

document.addEventListener('keydown', function(event){
    if (event.key in keys){
        STATE[keys[event.key]] = true
    }
})

document.addEventListener('keyup', function(event){
    if (event.key in keys){
        STATE[keys[event.key]] = false
    }
})

var screen = document.getElementById("screen")

if (screen.getContext){
    var ctx = screen.getContext('2d');
}

ctx.font = "bold 48px Arial";

init_button = new Button(100, 100, 1000, 200, "rgb(255, 255, 0)", "rgb(200, 200, 0)", "Para iniciar aperte qualquer botão.")

init_button.action = game_init

ALL_BUTTONS[0] = init_button

screen.addEventListener("mousemove", mouse_move_handler)

screen.addEventListener("mousedown", mouse_click_handler)

screen.addEventListener("mouseup", mouse_unclick_handler)

//ctx.fillText("Controle o pássaro com WASD", 50, 180);

document.addEventListener('keypress', game_init)

init_window = setInterval(
    function(){
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
        init_button.draw(ctx)
    }, 20)




function game_init(){
    clearInterval(init_window)
    setInterval(game_loop, 20)

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    document.removeEventListener('keypress', game_init)
}

function game_loop(){
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    ctx.fillStyle = player.score > 0 ? "rgb(0, 0, 0)" : "rgb(255, 0, 0)"
    ctx.fillText(`Score = ${player.score}`, SCREEN_WIDTH/2, 90);


    for (let i=0; i<3; i++){
        canos[i].draw(ctx)
        canos[i].update_pos()
    }
    

    player.update_pos()

    for (let i=0; i<3; i++){
        collided = player.collide(canos[i])
        player.test_passed(canos[i])
    }

    player.update_vel()
    player.draw(ctx, true)
}