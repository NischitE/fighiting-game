const canvas=document.querySelector('canvas');
const c=canvas.getContext('2d');

canvas.width=1024
canvas.height=576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity=0.6;

const background=new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc:'backgrond1.jpg'
})
const shop=new Sprite({
    position:{
        x:810,
        y:318
    },
    imageSrc:'shop.png',
    scale:1.5,
    framesMax:6
})

const player=new Fighter({
    position:{
        x:100,
        y:0
    },
    velocity:{
        x:0,
        y:2
    },
    offset:{
        x:100,
        y:0
    },
    
    scale:2.5,
    
    offset:{
        x:200,
        y:70
    },
    sprites:{
        idle:{
            imageSrc:'Idle.png',
            framesMax:10
        },
        run:{
            imageSrc:'Run.png',
            framesMax:8
        },
        jump:{
            imageSrc:'Going Up.png',
            framesMax:3
        },
        fall:{
            imageSrc:'Going Down.png',
            framesMax:3
        },
        attack1:{
            imageSrc:'Attack1.png',
            framesMax:7
        }
    },
    attackBox:{
        offset:{
            x:200,
            y:50
        },
        width:100,
        height:50
    }
})
const enemy=new Fighter({
    position:{
        x:1080,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    color:'blue',
    offset:{
        x:-50,
        y:0
    },
    scale:2.3,
    framesMax:11,
    imageSrc:'knightIdle.png',
    
    offset:{
        x:330,
        y:125,
    },
    sprites:{
        idle:{
            imageSrc:'knightIdle.png',
            framesMax:11
        },
        run:{
            imageSrc:'run1.png',
            framesMax:8
        },
        jump:{
            imageSrc:'KnightJump.png',
            framesMax:3
        },
        fall:{
            imageSrc:'KnightFall.png',
            framesMax:3
        },
        attack1:{
            imageSrc:'Attack2.png',
            framesMax:7
        }
    },
    attackBox:{
        offset:{
            x:-300,
            y:50
        },
        width:100,
        height:50
    }
})

// player.draw()
// enemy.draw()

const keys={
    a:{
        pressed:false,
    },
    d:{
        pressed:false,
    },
    w:{
        pressed:false,
    },
    ArrowLeft:{
        pressed:false,
    },
    ArrowRight:{
        pressed:false,
    },
    ArrowUp:{
        pressed:false,
    }
    
}
function rectangularCollision({
    rectangle1,rectangle2
}){
    return (rectangle1.attackBox.pos.x +   rectangle1.attackBox.width>=rectangle2.position.x && 
            rectangle1.attackBox.pos.x      <=  rectangle2.position.x+rectangle2.width &&
            rectangle1.attackBox.pos.y +   rectangle1.attackBox.height>=rectangle2.position.y &&
            rectangle1.attackBox.pos.y <=  rectangle2.position.y+rectangle2.height
    )

}

function winner({player,enemy,timerId}){
    clearTimeout(timerId)
    document.getElementById("result").style.display='flex';
    if(player.health===enemy.health){
        document.getElementById("result").innerHTML='Tie';
    }
    else if(player.health>enemy.health) {
        document.getElementById("result").innerHTML='Player 1 wins';
    }
    else{
        document.getElementById("result").innerHTML='Player 2 wins';
    }
}

let timer=60
let timerId
function decreaseTimer(){
    if(timer>0){

        timerId=setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    else{
        
        winner({player,enemy});
    }
}


decreaseTimer()


function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()

    player.update()
    enemy.update()

    player.velocity.x=0;
    enemy.velocity.x=0;

    if(keys.a.pressed && player.lastKey==='a'){
        player.velocity.x=-5;
        player.switchSprites('run')
    }
    else if(keys.d.pressed && player.lastKey==='d'){
        player.velocity.x=5;
        player.switchSprites('run')
    }else{
        player.switchSprites('idle')
    }

    if(player.velocity.y<0){
        player.switchSprites('jump')
    }
    else if(player.velocity.y>0){
        player.switchSprites('fall')
    }

     if(keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
        enemy.velocity.x=-5;
        enemy.switchSprites('run')
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
        enemy.velocity.x=5;
        enemy.switchSprites('run')   
    }else{
        enemy.switchSprites('idle')
    }
    
    if(enemy.velocity.y<0){
        enemy.switchSprites('jump')
    }
    else if(enemy.velocity.y>0){
        enemy.switchSprites('fall')
    }

    if(rectangularCollision({rectangle1:player,rectangle2:enemy}) && player.isAttacking){
        enemy.health-=20;
        document.getElementById('enemyHealth').style.width=enemy.health + "%";
        player.isAttacking=false;
    }

    if(rectangularCollision({rectangle1:enemy,rectangle2:player}) && enemy.isAttacking){
        player.health-=20;
        let s=100-player.health;
        document.getElementById('playerHealth').style.width=player.health + "%";
        enemy.isAttacking=false;
    }


    if(enemy.health<=0 || player.health<=0){
        winner({player,enemy,timerId});
    }

}

animate()

window.addEventListener('keydown',(event)=>{
    // console.log(event.key)
    switch(event.key){
        case 'd':
            keys.d.pressed=true;
            player.lastKey='d';
            break;
            
        case 'a':
            keys.a.pressed=true;
            player.lastKey='a';
            break

        case 'w':if(player.velocity.y===0){
            keys.w.pressed=true;
            player.velocity.y=-20
        }
            break

        case 's':
            player.attack();
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            enemy.lastKey='ArrowRight';
            break
            
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            enemy.lastKey='ArrowLeft';
            break

        case 'ArrowUp':if(enemy.velocity.y===0){
            // keys.w.pressed=true;
            enemy.velocity.y=-20
        }
            break
        case 'ArrowDown':
            enemy.attack();
            break
        
    }
})

window.addEventListener('keyup',(event)=>{
    // console.log(event.key)
    switch(event.key){
        case 'd':
            keys.d.pressed=false;
            break
        case 'a':
            keys.a.pressed=false;
            break
        
        case 'ArrowRight':
            keys.ArrowRight.pressed=false;
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
            break
        
    }
})