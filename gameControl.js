window.addEventListener('load',function(){
const canvas = document.getElementById("gameView");
const contex = canvas.getContext('2d');

canvas.width = 1500;
canvas.height= 500;

class InputHandler
{ 
constructor(Game){
    this.game = Game;

    window.addEventListener("keydown",e=>
    {
        console.log(e.key);
        if((e.key === 'd' ||//for going right
         e.key === 'a' ||//for going left
         e.key === 'x' ||
         e.key === ' ')// to sprint/run
         && this.game.pressedKey.indexOf(e.key) === -1)
        {
            this.game.pressedKey.push(e.key);
            console.log(this.game.pressedKey);
            
        }
       
    });
    window.addEventListener('keyup',e =>
    {
        
       if(this.game.pressedKey.indexOf(e.key)>-1)
       {
        this.game.pressedKey.splice(this.game.pressedKey.indexOf(e.key),1)
       }
      
    });
}
}
class Projectile 
{

}
class Player
{
    constructor(Game)
    {
        
        this.game = Game;
        this.width = 50;
        this.length = 50;
        this.x = 10;
        this.y = 450;
        this.moveSpeed = 3;
        this.sprintSpeed =3;
        this.Speed;
        this.jump=this.y- 150;
        this.isGrounded = true;
        this.jumpUp = false;

    }
    Update()
    {
    if(this.game.pressedKey.includes('x'))
    {
        this.Speed = this.moveSpeed +this.sprintSpeed;
    }
    else
    {
        this.Speed = this.moveSpeed;
    }

    if(this.game.pressedKey.includes('d') && this.x < canvas.width-this.width)
    {
        this.x += this.Speed;
    }
    else if(this.game.pressedKey.includes('a') && this.x > 0)
    {
        this.x -= this.Speed;
    }
    if((this.game.pressedKey.includes(' ') && this.isGrounded === true) || (this.isGrounded === true && this.jumpUp === false))
    {
         this.y -= 5;
         this.jumpUp =false;
         if(this.y <= this.jump)
         {
            this.isGrounded = false;
            this.jumpUp =true
         }
         
    }
    if( this.y < 450 && this.isGrounded === false)
    {
        this.y +=5;
    }
    else
    {
        this.isGrounded = true;
    }

    }

    Draw(Context)
    {
        Context.fillStyle = "green";
        Context.fillRect(this.x, this.y, this.width, this.length);
        

    }

}
class Enemy 
{

}

class Layer
{

}
class Background 
{

}
class PlayerUI
{

}
class EnemyStats
{

}
class Game
{
    constructor(width, length)
    {
        this.width = width;
        this.length = length;
        this.player = new Player(this);
        this.inputHandler = new InputHandler(this);
        this.pressedKey = [];
    }
    Update()
    {
        this.player.Update();

    }
    Draw(Context)
    {
        this.player.Draw(Context);
    }
}

const game = new Game(canvas.width, canvas.height);

 function playGame()
 {
    contex.clearRect(0, 0, canvas.width, canvas.height)
    game.Update();
    game.Draw(contex);
    requestAnimationFrame(playGame);
 }

 playGame();

});
