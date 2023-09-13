function showtips()
{
   var show = document.getElementById("tips");
   if (show.style.display === "none") {
    show.style.display = "block";
  } else {
    show.style.display = "none";
  }
}

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
    this.playerBullet = document.getElementById("playerBullet");
    this.game = game;
    this.x = x;
    this.y = y;
    this.width= 20;
    this.length =20;
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
    
    Context.drawImage(this.playerBullet,this.x,this.y);
}

}
class MeeleRange 
{
    constructor(game)
    {
        this.sword = document.getElementById("sword");
        this.game = game;
        this.width = 25;
        this.x= this.game.x + 50;
        this.y = this.game.y;
        this.length =50;
    }
    Update()
    {
        this.x= this.game.x + 50;
        this.y = this.game.y;
        
    }
    Draw(Context)
    { 
        
        Context.drawImage(this.sword,this.x,this.y);
    }
}
class Player
{
    constructor(Game)
    {
        this.character_left = document.getElementById('character_left');
        this.character_right = document.getElementById('character_right');
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
        this.meeleRange = new MeeleRange(this);
        
        
      
    }
    Update()
    {
    if(this.game.pressedKey.includes('x') && (this.game.pressedKey.includes('a') ||
    this.game.pressedKey.includes('d')))
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
        this.game.charcterDirection=true;
    }
    else if(this.game.pressedKey.includes('a') && this.x > 0)
    {
        this.x -= this.Speed;
        this.game.charcterDirection=false;
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
            
            if(this.game.checkCollision(this.game.guard,Projectile))
            { 
                Projectile.deleteProjectile = true;
                
            }
            Projectile.Update();
            
            if(this.game.checkCollision(this.game.trigger,Projectile))
            {
                this.game.trigger.isShielded = false;
            }
            

    
        });
    }
    
    this.RangedAttacks =this.RangedAttacks.filter(Projectile =>!Projectile.deleteProjectile);
//meele attack for gard

    if(!this.game.trigger.isShielded  &&  this.game.meeleAttack === true)
    {
        
        if(this.game.checkCollision(this.game.guard,this.meeleRange)) 
        {
                this.game.trigger.isShielded =true;
                this.game.guard.guardLives -=1;
                if(this.game.guard.guardLives <0)
                {
                    this.game.gameComplete = true;
                }
        }
    }
    


    }

    Draw(Context)
    {
        
       if(!this.game.charcterDirection)
       {
        Context.drawImage(this.character_left,this.x,this.y);
       }
       else
       {
        Context.drawImage(this.character_right,this.x,this.y);
       }
        this.meeleRange.Update();
        this.RangedAttacks.forEach(Projectile => {
            Projectile.Draw(Context);
        });
      
        if( this.game.meeleAttack === true)
        {
            
            
            this.meeleRange.Draw(Context);
            
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
class EnemyProjectile extends Projectile
{
    constructor(game,x,y)
    {
        super(game,x,y);
        this.towerBullet = document.getElementById("towerBullet");
        this.speed =3;
    }
    Update()
{
    
    this.x -=this.speed;
    
    if(this.x < this.initposX - 500)
    {
        this.deleteProjectile =true;
        
    }

}
Draw(Context)
{
  
    Context.drawImage(this.towerBullet,this.x-30,this.y);
}
}

class EnemyTower
{
constructor(Game)
{
    this.tower = document.getElementById("tower");
    this.game = Game;
    this.width =20;
    this.length = 80;
    this.x = 700;
    this.y = canvas.height - this.length;
    this.EnemyAttack =[];
    this.enemeyAttack();
   
}

Update()
{
    if(this.EnemyAttack.length >0)
    {
        
        this.EnemyAttack.forEach(EnemyProjectile => {
           
           
            if(this.game.checkCollision(this.game.player,EnemyProjectile))
            {
             
                EnemyProjectile.deleteProjectile =true;
                
                this.game.gameOver();
                
            }
            EnemyProjectile.Update(); 
        });
    }
    
    this.EnemyAttack =this.EnemyAttack.filter(EnemyProjectile =>!EnemyProjectile.deleteProjectile);
}
Draw(Context)
{

    Context.drawImage(this.tower,this.x-30,this.y+10);
    this.EnemyAttack.forEach(EnemyProjectile => {
        EnemyProjectile.Draw(Context);
    });
}

enemeyAttack(){
        
   
      this.EnemyAttack.push(new EnemyProjectile(this.game,this.x,this.y+15));
      this.EnemyAttack.push(new EnemyProjectile(this.game,this.x,this.y+50));

      

  }


}
class Guard
{
constructor(game)
{
this.guard_left = document.getElementById("guard_left");
this.guard_right = document.getElementById("guard_right");
this.game = game;
this.width = 50;
this.length = 50;
this.x = 1000;
this.y = canvas.height - this.length;
this.initposX =this.x;
this.direction=true;
this.speed=3;
this.maxmove =200;
this.guardLives = 0;

}
Update()
{
    if(this.x >=(this.initposX + this.maxmove * 2))
    {
        this.direction = false;
    }
    else if(this.x <=(this.initposX - this.maxmove))
    {
        this.direction = true;
    }
if(this.direction)
{
this.x +=this.speed;
}
else
{
    this.x -=this.speed;
}
if(this.game.checkCollision(this.game.player, this))
{ 
   
    if(!this.game.gameComplete)
{
    this.game.gameOver();
}
}
}
Draw(Context)
{
 

    
  if(!this.direction)
  {
    Context.drawImage(this.guard_left,this.x,this.y);
  }
  else
  {
    Context.drawImage(this.guard_right,this.x,this.y);
  }
    
}



}
class Trigger 
{
    constructor(game)
    {
        this.shield = document.getElementById("shield");
        this.brokenShield = document.getElementById("brokenShield");
        this.game = game;
        this.width = 40;
        this.length = 40;
        this.x = canvas.width - this.width;
        this.y = canvas.height - this.length - 125;
        this.removeShieldTimer = 0 ;
        this.removeShieldinterval = 5 * 1000;
        this.isShielded = true;
    }
    Draw(Context)
    {
        if(!this.isShielded)
        {
            Context.drawImage(this.brokenShield,this.x,this.y);
        }
        else
        {
            Context.drawImage(this.shield,this.x,this.y);
        }
       
        
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
    this.manaColor = "cyan";
    this.staminaColor = "white";
    

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
        this.guard = new Guard(this);
        this.trigger = new Trigger(this);
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
        this.enemyAttackTimer=0;
        this.enemyAttackInterval =2000 ;
        this.gameComplete = false;
        this.charcterDirection = true;
    }
    Update(deltaTime)
    {
        this.player.Update();
        this.guard.Update();
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
    //for emeny attack 
    if(this.enemyAttackTimer> this.enemyAttackInterval)
    {
       
        this.enemyTower.enemeyAttack();
        this.enemyAttackTimer =0;
        
    } 
    else
    {
        this.enemyAttackTimer+=deltaTime;
    }
    this.enemyTower.Update();

       //
       // remove shiled
       if(this.trigger.removeShieldTimer> this.trigger.removeShieldinterval)
       {
          
           this.trigger.isShielded = true;
           this.trigger.removeShieldTimer = 0;
           
       } 
       else
       {
           this.trigger.removeShieldTimer +=deltaTime;
       }
       //game end conditon
      
       if(this.gameComplete && this.player.x >(canvas.width - this.player.width -20))
       {
        this.gameFinished();
        this.gameComplete = false;
       }

    }
    Draw(Context)
    {
        this.player.Draw(Context);
        this.playerUI.Draw(Context);
        this.enemyTower.Draw(Context);
       if (!this.gameComplete)
    {
        this.guard.Draw(Context);
    }
        this.trigger.Draw(Context);
    }
     checkCollision(obj1,obj2)
       {
      
        return(
                obj1.x < obj2.x + obj2.width &&
                obj1.x + obj1.width > obj2.x &&
                obj1.y < obj2.y + obj2.length &&
                obj1.y + obj1.length > obj2.y
                 

        );
       
       } 
       gameOver(){
        window.location.reload();
       
       }
       gameFinished(){
        if(confirm("YOU HAVE FINISHED THE LEVEL!! Do you want to play again??"))
        {
            window.location.reload();
        }
        else
        {
            window.close();
        }

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
