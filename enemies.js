const enemyBoard = document.getElementById('enemies');
const ectx = enemyBoard.getContext('2d');

var hidden = false;

document.addEventListener('visibilitychange', ()=>{
    if(document.hidden){
        hidden = true;
        loop(0);
    }else{
        hidden = false;
    }
})



var enemyDeath = new Audio('Enemydeath.mp3')
enemyDeath.volume = 0.04

var health = 100;

function isAlive(){
    if(health<=0){
        ectx.font = '40px serif';
        ectx.fillStyle = 'red';
        ectx.fillText('Ur ded', 205, 300);
        ectx.font = '15px serif';
        ectx.fillText('refresh to start again', 200, 315);
        return false
    }
    return true
}

var cash = 500;
function cashUpdate(){document.getElementById('cash').innerHTML = `Cash: $${cash}`}
cashUpdate();
const healthDoc = document.getElementById('health');
function updateHealth()  {healthDoc.innerHTML = `Health: ${health}`}
updateHealth()

function update(progress){
    for(let i = 0; i < Enemy.arr.length; i++){
        Enemy.arr[i].update(progress)
    }
    setSortedEnemyArrs();
}

function draw(){
    ectx.clearRect(0,0,enemyBoard.width, enemyBoard.height)
    for(let i = 0; i < Enemy.arr.length; i++){
        Enemy.arr[i].draw()
    }
}

var lastRender = 0;
function loop(timestamp){
    let progress = timestamp - lastRender;
    lastRender = timestamp;
    update(progress);
    draw();
    if(isAlive()){
    window.requestAnimationFrame(loop);
    }
}
window.requestAnimationFrame(loop);

const enemyStats = [
    {   // level 0
        speed:0.1,
        type:'normal',
        health:1,
        color:'red',
        size:8,
        extraAfterDeath:0,
    },
    {   // level 1
        speed:0.15,
        type:'normal',
        health:1,
        color:'blue',
        size:10,
        extraAfterDeath:0,
    },
    {   // level 2
        speed:0.2,
        type:'normal',
        health:1,
        color:'#33ff00',
        size:12,
        extraAfterDeath:0,
    },
    {   // level 3
        speed:0.22,
        type:'normal',
        health:1,
        color:'#ffff00',
        size:12,
        extraAfterDeath:0,
    },
    {   // level 4
        speed:0.08,
        type:'normal',
        health:10,
        color:'#aa4400',
        size:14,
        extraAfterDeath:5,
    },
    {   // level 5
        speed:0.03,
        type:'normal',
        health:200,
        color:'#aaffaa',
        size:25,
        extraAfterDeath:10,
    },
    {   // level 6
        speed:0.029,
        type:'normal',
        health:400,
        color:'red',
        size:27,
        extraAfterDeath:5,
    },
]

function Enemy(level, distance){
    if(distance==undefined){distance = 0}
    this.seed = Math.random()
    this.level = level
    let stats = enemyStats[this.level];
    this.speed = stats.speed;
    this.type = stats.type;
    this.health = stats.health;
    this.color = stats.color;
    this.size = stats.size;
    this.extraAfterDeath = stats.extraAfterDeath;

    this.targeted = false;
    this.shotAt = 0;

    this.x = track.shape[0][0];
    this.y = track.shape[0][1];

    this.segment = 0;
    this.segDist = distance;
    this.totalDist = distance;

    Enemy.arr.push(this)
}

Enemy.prototype.setStats = function(newLevel){
    this.level = newLevel;
    let stats = enemyStats[newLevel];
    this.speed = stats.speed;
    this.type = stats.type;
    this.health = stats.health;
    this.color = stats.color;
    this.size = stats.size;
    this.extraAfterDeath = stats.extraAfterDeath;
}

Enemy.arr = [];
Enemy.arrStrong = [];
Enemy.arrLast = [];

function setSortedEnemyArrs(){

    Enemy.arr.sort(function(a, b){
        return b.totalDist - a.totalDist;
    });

    Enemy.arrStrong = Enemy.arr.slice();
    Enemy.arrLast = Enemy.arr.slice();

    Enemy.arrStrong.sort(function(a, b){
        return a.level - b.level;
    });

    Enemy.arrLast.sort(function(a, b){
        return a.totalDist - b.totalDist;
    });
}

Enemy.prototype.update = function(progress){
    this.segDist+=this.speed * progress;
    this.totalDist+=this.speed * progress;

    if(this.segDist>track.segmentLengths[this.segment]&&this.segment == track.segments - 1){
        this.die(true);
        return
    }
    while(this.segDist>track.segmentLengths[this.segment]){
        this.segDist-=track.segmentLengths[this.segment];
        this.segment++
    }
    this.x = track.shape[this.segment][0] + track.xFactor[this.segment] * this.segDist;
    this.y = track.shape[this.segment][1] + track.yFactor[this.segment] * this.segDist;

    this.xV = track.xFactor[this.segment] * this.speed;
    this.yV = track.yFactor[this.segment] * this.speed;


    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
}

Enemy.prototype.draw = function(){
    ectx.fillStyle = this.color;
    ectx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    ectx.strokeStyle = '#000000aa'
    ectx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
}
Enemy.prototype.die = function(damageHealth){
    if(damageHealth){
        health-=this.level+1;
        updateHealth()
    }
    let seed = (element)=>element.seed == this.seed; 
    let index = Enemy.arr.findIndex(seed);
    Enemy.arr.splice(index,1)
    delete this;
}
Enemy.prototype.damage = function(damage){
    this.health-=damage;
    while(this.health<=0){
        cash++
        cashUpdate();
        if(this.extraAfterDeath>1){
            for(let i = 0; i<this.extraAfterDeath; i++){
                new Enemy(this.level-1, this.totalDist - i*enemyStats[this.level-1].size)
            }
        }
        enemyDeath.pause();
        enemyDeath.currentTime = 0;
        enemyDeath.play();
        this.level--;
        let tempHealth = this.health;
        if(this.level<0){
            this.die();
            return
        }
        this.setStats(this.level);
        this.health+=tempHealth;
    }
}
