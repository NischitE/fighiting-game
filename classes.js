class Sprite{
    constructor({position,imageSrc,scale=1,framesMax=1,offset={x:0,y:0}}){
        this.position=position;
        this.width=50;
        this.height=150;
        this.image=new Image()
        this.image.src=imageSrc
        this.scale=scale
        this.framesMax=framesMax
        this.framesCurrent=0;
        this.framesElapsed=0;
        this.framesHold=5;
        this.offset=offset

        
    }

    draw(){
        c.drawImage(
            this.image,
            this.framesCurrent*(this.image.width / this.framesMax),
            0,
            this.image.width/this.framesMax,
            this.image.height,
            this.position.x-this.offset.x,
            this.position.y-this.offset.y,
            this.image.width /this.framesMax*this.scale,
            this.image.height*this.scale
            )
    }
    animateframes(){
        this.framesElapsed++
        if(this.framesElapsed % this.framesHold ===0){
            if(this.framesCurrent<this.framesMax-1){
                
                this.framesCurrent++
            }
            else{
                this.framesCurrent=0
            }
        }
    }

    update(){
        this.draw()
        this.animateframes()
    }
}
class Fighter extends Sprite{
    constructor({
        position,
        velocity,
        color='red',
        offset,
        imageSrc,scale=1,
        framesMax=1,
        sprites,
        attackBox={offset:{},width:undefined,height:undefined}
    }){
        super({position,imageSrc,scale,framesMax,offset})
        this.framesCurrent=0;
        this.framesElapsed=0;
        this.framesHold=15;
        this.velocity=velocity;
        this.width=50;
        this.height=150;
        this.lastKey;
        this.attackBox={
            pos:{
                x:this.position.x,
                y:this.position.y
            },
            offset:attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color=color;
        this.isAttacking;
        this.health=100;
        this.sprites=sprites
        for(const sprite in sprites){
            sprites[sprite].image=new Image()
            sprites[sprite].image.src=sprites[sprite].imageSrc

        }
       
    }
    
    
    update(){
        this.draw()
        this.animateframes()

        this.attackBox.pos.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.pos.y=this.position.y + this.attackBox.offset.y;
        // c.fillStyle()='red';
        // c.fillRect(this.position.x,this.position.y,this.width,this.height)

        // c.fillRect(this.attackBox.pos.x,this.attackBox.pos.y,this.attackBox.width,this.attackBox.height)

        this.position.x+=this.velocity.x;
        this.position.y+=this.velocity.y;
        
        if(this.position.y + this.height + this.velocity.y >=canvas.height-20){
            this.velocity.y=0;
            this.position.y=406
        }
        else{
            this.velocity.y+=gravity;
        }
        // console.log(this.position.y) 406
    }

    attack(){
        this.switchSprites('attack1')
        this.isAttacking=true;


        setTimeout(() => {
            this.isAttacking=false
        }, 100);
    }

    switchSprites(sprite){
        if(this.image===this.sprites.attack1.image && this.framesCurrent< this.sprites.attack1.framesMax-1)
            return
        switch(sprite){
            case 'idle':    
                if(this.image!==this.sprites.idle.image){
                    this.image=this.sprites.idle.image
                    this.framesMax=this.sprites.idle.framesMax
                    this.framesCurrent=0
                }
                break
            case 'run':if(this.image!==this.sprites.run.image){
                this.image=this.sprites.run.image
                this.framesMax=this.sprites.run.framesMax
                this.framesCurrent=0
            }
                break
            case 'jump':if(this.image!==this.sprites.jump.image){
                this.image=this.sprites.jump.image
                this.framesMax=this.sprites.jump.framesMax
                this.framesCurrent=0

            }
                break

            case 'fall':
                if(this.image!==this.sprites.fall.image){
                    this.image=this.sprites.fall.image
                    this.framesMax=this.sprites.fall.framesMax
                    this.framesCurrent=0
                }
                break
            case 'attack1':
                    if(this.image!==this.sprites.attack1.image){
                        this.image=this.sprites.attack1.image
                        this.framesMax=this.sprites.attack1.framesMax
                        this.framesCurrent=0
                    }
                    break

            
        }
    }
}