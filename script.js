class Cano{
    constructor(pos_x){
        this.gap = 300

        this.x = pos_x
        this.y = Math.random() * (SCREEN_HEIGHT-this.gap)
        
        this.length = 100

        this.passed = false

        this.color = "rgb(0, 255, 0)"

        this.vx = 6
    }

    draw(ctx){
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, 0, this.length, this.y)

        ctx.fillRect(this.x, this.y+this.gap, this.length, SCREEN_HEIGHT-(this.y+this.gap))
    }

    update_pos(){
        this.x -= this.vx
        if (this.x+this.length < 0){
            this.x = SCREEN_WIDTH
            this.y = Math.random() * (SCREEN_HEIGHT-this.gap)
            this.passed = false
        }
    }
}


class Player{
    constructor (){
        this.pos_x = 0
        this.pos_y = 0
        this.vx = 0
        this.vy = 1

        this.image = document.getElementById("source");

        this.score = 0

        this.w = 140

        this.h = 95

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
        if (keys.letters['w']){
            this.vy = -15
        }
        if (keys.letters['d']){
            this.vx = 5
        }
        if (keys.letters['a']){
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
        if (this.pos_x > (cano.x + cano.length) && !cano.passed){
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

class Keys{
    constructor(letters){
        this.letters = {}

        for (let i=0; i < letters.length; i++){
            this.letters[letters[i]] = false
        }
    }

}

GRAVITY = 1.7

SCREEN_WIDTH = 1920
SCREEN_HEIGHT = 1080

var screen = document.getElementById("screen")

var player = new Player()

var canos = []

for (let i=0; i<3; i++){
    canos[i] = new Cano(SCREEN_WIDTH + (SCREEN_WIDTH / 3) * i)
}



var keys = new Keys(['w', 'a', 's', 'd'])

console.log(keys.letters)

document.addEventListener('keydown', function(event){
    if (event.key in keys.letters){
        keys.letters[event.key] = true
    }
})

document.addEventListener('keyup', function(event){
    if (event.key in keys.letters){
        keys.letters[event.key] = false
    }
})

if (screen.getContext){
    var ctx = screen.getContext('2d');
}

ctx.font = "bold 48px Arial";
ctx.fillText("Para iniciar aperte qualquer botão", 50, 90);

document.addEventListener('keypress', game_init)

function game_init(){
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