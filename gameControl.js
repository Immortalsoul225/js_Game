window.addEventListener('load',function(){ // runs only after all resources are loaded
const canvas = document.getElementById("gameView");
const contex = canvas.getContext('2d');//initalizes the cannvas /game view

// height and witdth of the canvas
canvas.width = 1500;
canvas.height= 500;

class InputHandler// handels all player inpusts

{ 
constructor(Game){
    this.game = Game;

    window.addEventListener("keydown",e=>
    {
       
        if((e.key === 'd' ||//for going right
         e.key === 'a' ||//for going left
         e.key === 'x' ||// to sprint/run
         e.key === ' ') // for jump
         && this.game.pressedKey.indexOf(e.key) === -1)
        {
            this.game.pressedKey.push(e.key);
            
        }
        else if(e.key === "w")
        {
            this.game.player.longRang();
        } 
        if(e.key === "e")
        {
            this.game.meeleAttack= true;
        
            
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
constructor(game,x,y)
{
    this.game = game;
    this.x = x;
    this.y = y;
    this.width= 20;
    this.height =20;
    this.speed= 10;
    this.initposX=x;
    this.deleteProjectile = false;
   
}
Update()
{
    this.x +=this.speed;
    
    if(this.x > this.initposX + 500)
    {
        this.deleteProjectile =true;
        
    }

}
Draw(Context)
{
    
    Context.fillStyle="red";
    Context.fillRect(this.x,this.y,this.width,this.height);

}

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
        this.RangedAttacks = [];
      
    }
    Update()
    {
    if(this.game.pressedKey.includes('x'))
    {
        
        if(this.game.stamina > 0)
        {
            this.Speed = this.moveSpeed +this.sprintSpeed;
            this.game.stamina-= 3;
           
        }
        else
        {
            this.Speed = this.moveSpeed ;
        }
      
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
    if(((this.game.pressedKey.includes(' ') && this.isGrounded === true) && this.y >= 450)||
     (this.isGrounded === false && this.jumpUp === false))
    {
         this.y -= 5;
         this.isGrounded =false;
         if(this.y <= this.jump)
         {
            this.isGrounded = true;
            this.jumpUp= true;

            
         }
         
    }
    if( this.y < 450 && this.jumpUp === true)
    {
        this.y +=5;
    }
    else if(this.y >= 450 && this.jumpUp === true)
    {
        
        this.jumpUp =false;
    }
    
    if(this.RangedAttacks.length >0)
    {
        
        this.RangedAttacks.forEach(Projectile => {
            Projectile.Update();
            

    
        });
    }
    
    this.RangedAttacks =this.RangedAttacks.filter(Projectile =>!Projectile.deleteProjectile);

    }

    Draw(Context)
    {
        Context.fillStyle = "green";
        Context.fillRect(this.x, this.y, this.width, this.length);
        
        this.RangedAttacks.forEach(Projectile => {
            Projectile.Draw(Context);
        });
      
        if( this.game.meeleAttack === true)
        {
            Context.fillStyle = "red";
            Context.fillRect(this.x+50, this.y, this.width -25 , this.length);
            if(this.game.meeletime >30 )
            {
                this.game.meeletime=0;
                this.game.meeleAttack =false;
            }
           else
           {
            this.game.meeletime +=1;
           } 
          
        }

    }
    longRang(){
        
      if(this.game.mana >0)
      {
        this.RangedAttacks.push(new Projectile(this.game,this.x+50,this.y+15));
        this.game.mana --;
        
      }
     
        
    }
   

}
class EnemyTower
{
constructor(game)
{
    this.game = game;
    this.width =20;
    this.length = 80;
    this.x = 500;
    this.y = canvas.height - this.length;
      
    this.EnemyAttack =[];
}

Update()
{
 
}
Draw(Context)
{
    Context.fillStyle = "red";
    Context.fillRect(this.x, this.y, this.width, this.length);
}



}

class Layer
{

}
class Background 
{

}
class PlayerUI
{
 constructor (game)
 {
    this.game = game;
    this.fontSize = 20;
    this.fontFamily= "inkfree";
    this.manaColor = "blue";
    this.staminaColor = "grey";
    

 }
 Draw(Context){
    Context.fillStyle= this.manaColor;
    for(let i=0; i<this.game.mana; i++)
    {
    
        Context.fillRect(20+ 10* i,50,5,10);
    }
    Context.fillStyle= this.staminaColor;
    for(let i=0; i<this.game.stamina; i++)
    {
        Context.fillRect(20+ 2* i,70,5,10);
    }
 }
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
        this.playerUI = new PlayerUI(this);
        this.enemyTower = new EnemyTower(this);
        this.pressedKey = [];
        this.mana = 5;
        this.manaRegenInterval =2000;
        this.manaRegenTimer =0;
        this.maxMana =5;
        this.stamina = 150;
        this.staminaRegenInterval =1000;
        this.maxStamina =150;
        this.staminaRegenTimer=0;
        this.meeleAttack = false;
        this.meeletime= 0;
    }
    Update(deltaTime)
    {
        this.player.Update();
        //for mana regen
    
        if(this.manaRegenTimer> this.manaRegenInterval)
       {
        if(this.mana < this.maxMana)
        {
            this.mana+=1;
        }
        this.manaRegenTimer =0;
       }
       else
       {
        this.manaRegenTimer +=deltaTime;
       }
       //===
      //for stamina regen
      if(this.staminaRegenTimer> this.staminaRegenInterval)
       {
        if(this.stamina < this.maxStamina)
        {
            this.stamina+=30;
        }
        this.staminaRegenTimer =0;
       }
       else
       {
        this.staminaRegenTimer +=deltaTime;
       }
       if(this.stamina>this.maxStamina)
       {
        this.stamina=this.maxStamina;
       }
    //===
      

    }
    Draw(Context)
    {
        this.player.Draw(Context);
        this.playerUI.Draw(Context);
        this.enemyTower.Draw(Context);
    }
     checkCollision(obj1,obj2)
       {
        return(
                obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.height &&
                obj1.y + obj1.height > obj2
                 

        );
       } 
}

const game = new Game(canvas.width, canvas.height);
let lastTime =0;

 function playGame(timeStamp)
 {
     const deltaTime =timeStamp -lastTime;
     lastTime =timeStamp;
     
    contex.clearRect(0, 0, canvas.width, canvas.height)
    game.Update(deltaTime);
    game.Draw(contex);
    requestAnimationFrame(playGame);
 }

 playGame(0);

});
