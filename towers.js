const towerBoard = document.getElementById('towers');
const tctx = towerBoard.getContext('2d');

const targetString =['first', 'strong', 'last', 'close']

const explosion = {
    speed:0,
    pen:100,
    damage:1,
    size:60,
    color:'#ffaa00aa',
    onhit:'nothing',
    life:100,
}

const minionExplosion = {
    speed:0,
    pen:100,
    damage:1,
    size:20,
    color:'#aaffaaaa',
    onhit:'nothing',
    life:500,
}


var shootSound = new Audio('shoot.mp3')
shootSound.volume = 0.1

var flameThrowerSound = new Audio('Flamethrower.wav')
flameThrowerSound.volume = 0.1

var tubeSound = new Audio('TubeSound.mp3')
tubeSound.volume = 0.1

var explosionSound = new Audio('explosion.mp3')
explosionSound.volume = 0.1

var thumperSound = new Audio('thumper.mp3')
explosionSound.volume = 0.1

var sorcererKill = new Audio('SorcererKill.mp3')
sorcererKill.volume = 0.04

const towers = {
    'shooter':{
        name:'shooter',
        type:'projectile',
        hasBarrel:true,
        barrel:{
            width:4,
            height:12,
            dx:2,
            dy:2,
            color:'white',
            border:true,
            borderColor:'black',
            angle:0,
            knockback:1,
        },
        projectile:{
            type:'normal',
            speed:0.3,
            pen:0,
            damage:1,
            size:2,
            color:'orange',
            onhit:'nothing',
            life:2000,
        },
        size:10,
        color:'white',
        shootSound:'shootSound',
        border:true,
        borderColor:'black',
        rof:500,
        range:50,
        accuracy:0,
        upgrades:[
            {//buy 1
                cost:100,
                range:60,
                rof:400,
                barrel:{
                    height:14
                },
                projectile:{
                    speed:0.4,
                    pen:1,
                }
            },
            {//buy 2
                cost:400,
                range:80,
                rof:400,
                barrel:{
                    height:16
                },
                projectile:{
                    pen:2,
                    speed:0.6,
                    damage:1.2
                }
            },
            {
                cost:600,
                range:90,
                rof:300,
                projectile:{
                    damage:1.5,
                    speed:0.7
                }
            },
            {
                cost:1500,
                range:120,
                rof:100,
                barrel:{
                    height:20
                },
                projectile:{
                    speed:0.8,
                    pen:2,
                    damage:2,
                }
            },
            {
                cost:4000,
                range:150,
                rof:40,
                barrel:{
                    width:6,
                    dx:3,
                    height:25,
                },
                projectile:{
                    damage:4,
                    size:4,
                }
            }
        ],
        cost:300,
    },
    'bombThrower':{
        name:'bombThrower',
        type:'projectile',
        hasBarrel:true,
        barrel:{
            width:8,
            height:12,
            dx:4,
            dy:4,
            color:'white',
            border:true,
            borderColor:'black',
            angle:0,
            knockback:1,
        },
        projectile:{
            type:'normal',
            speed:0.2,
            pen:0,
            damage:1,
            size:8,
            color:'orange',
            onhit:'expload',
            life:1500,
        },
        upgrades:[
            {
                cost:200,
                range:85,
                rof:700,
                projectile:{
                    damage:2,
                },
                barrel:{
                    height:20
                }
            },
            {
                cost:400,
                range:95,
                rof:600,
                projectile:{
                    damage:5,
                    speed:0.4
                },
                barrel:{
                    height:24
                }
            },
            {
                cost:15000,
                range:200,
                rof:100,
                color:'black',
                borderColor:'white',
                projectile:{
                    color:'red',
                    damage:10,
                    speed:0.5
                },
                barrel:{
                    height:28,
                    color:'black',
                    borderColor:'white'
                }
            }
        ],
        shootSound:'tubeSound',
        size:14,
        color:'white',
        border:true,
        borderColor:'black',
        rof:1000,
        range:80,
        accuracy:0,
        cost:300,
    },
    'thumper':{
        name:'thumper',
        type:'aoe',
        hasBarrel:true,
        barrel:{
            width:14,
            height:4,
            dx:7,
            dy:4,
            color:'white',
            border:true,
            borderColor:'black',
            angle:0,
            knockback:1,

        },
        projectile:{
            type:'normal',
            speed:0,
            pen:100,
            damage:1,
            size:60,
            color:'#ffaa00aa',
            onhit:'nothing',
            life:100,
        },
        
        size:10,
        color:'white',
        border:true,
        borderColor:'black',
        rof:1000,
        range:40,
        accuracy:0,
        shootSound:'thumperSound',
        upgrades:[
            {
                cost:300,
                rof:800,
                range:45,
                projectile:{
                    size:70
                }
            },
            {
                cost:600,
                rof:600,
                range:50,
                projectile:{
                    size:75
                }
            },
            {
                cost:800,
                rof:400,
                range:55,
                projectile:{
                    size:80
                }
            },
            {
                cost:8000,
                projectile:{
                    damage:0.2,
                },
                rof:50,
            }
        ],
        cost:300,
    },
    'flamethrower':{
        name:'flamethrower',
        type:'projectile',
        hasBarrel:true,
        barrel:{
            width:4,
            height:6,
            dx:2,
            dy:2,
            color:'#ff0000',
            border:true,
            borderColor:'white',
            angle:0,
            knockback:0,
        },
        projectile:{
            type:'normal',
            speed:0.2,
            pen:0,
            damage:0.05,
            size:6,
            color:'#ff440055',
            onhit:'nothing',
            life:400,
        },
        size:10,
        color:'#222222',
        border:true,
        borderColor:'white',
        rof:10,
        range:40,
        accuracy:1.5,
        shootSound:'flamethrower',
        upgrades:[
            {
                cost:200,
                range:70,
                projectile:{
                    speed:0.25,
                    pen:1
                },
                barrel:{
                    width:6,
                    dx:3
                }
            },
            {
                cost:500,
                range:80,
                rof:4,
                accuracy:1.2,
                projectile:{
                    damage:0.6,
                    size:8,
                    speed:0.4
                }
            }
        ],
        cost:500,
    },
    'sorcerer':{
        name:'sorcerer',
        type:'minions',
        hasBarrel:true,
        barrel:{
            width:6,
            height:6,
            dx:3,
            dy:3,
            color:'#ff00ff',
            border:true,
            borderColor:'black',
            angle:0,
            knockback:1,
        },
        projectile:{
            type:'minion',
            speed:0.08,
            pen:4,
            damage:0.05,
            size:2,
            color:'#ffaaffaa',
            onhit:'nothing',
            life:15000,
            range:25,
        },
        minionCount:0,
        maxMinions:100,
        size:10,
        color:'#555555',
        border:true,
        borderColor:'black',
        rof:100,
        range:25,
        accuracy:0,
        upgrades:[
            {
                cost:800,
                barrel:{
                    color:'#33aaff'
                },
                projectile:{
                    damage:0.16,
                    speed:0.1,
                    life:30000,
                    color:'#aaaaffaa'
                },
                rof:50,
                maxMinions:200,
                range:60,
            },
            {
                cost:6000,
                rof:100,
                maxMinions:50,
                projectile:{
                    onhit:'minionexpload',
                    color:'#aaffaaaa',
                    size:4,
                    pen:1,
                },
                barrel:{
                    color:"#aaffaa"
                }
            }
        ],
        cost:400,
    },
}

function TowerGen(name, x, y){
    for(const [key, value] of Object.entries(towers[name])){
        if(typeof towers[name][key] == 'object'){
            this[key] = {};
            Object.assign(this[key], value)
            
        }else{
            this[key] = value;
        }
    }
    this.x = x+0.5;
    this.y = y+0.5;

    this.target = 0;
    this.level = -1;
    this.shootTimer = 0;

    TowerGen.arr.push(this);
}

TowerGen.arr = [];

TowerGen.prototype.draw = function(){
    
    tctx.fillStyle = this.color;
    tctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)

    if(this.border){
        tctx.strokeStyle = this.borderColor
        tctx.lineWidth = 1;
        tctx.strokeRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size)
    }

    if(this.hasBarrel){
        let x = this.x
        let y = this.y
        tctx.translate(x,y);
        tctx.rotate(this.barrel.angle)
        tctx.translate(-x, -y);
        tctx.fillStyle = this.barrel.color;
        tctx.fillRect(x - this.barrel.dx,y - this.barrel.dy,this.barrel.width, this.barrel.height);
        tctx.fillStyle = this.barrel.color;
        if(this.barrel.border){
            tctx.strokeStyle = this.barrel.borderColor;
            tctx.strokeRect(x - this.barrel.dx,y - this.barrel.dy,this.barrel.width, this.barrel.height);
        }
        tctx.translate(x,y);
        tctx.rotate(-this.barrel.angle)
        tctx.translate(-x, -y);
    }

}

TowerGen.prototype.update = function(progress){
    if(this.shootTimer<0){
        switch(this.type){
            case 'projectile':
                this.normalUpdate(progress);
            break;
            case 'minions':
                this.minionUpdate(progress);
            break;
            case 'aoe':
                this.normalUpdate(progress);
            break;
        }
    }else{
        this.shootTimer -= progress
        this.barrel.dy = this.barrel.height*this.shootTimer*this.barrel.knockback/this.rof
    }
}

TowerGen.prototype.minionUpdate = function(progress){
    if(this.minionCount<this.maxMinions){
        this.summon()
        this.minionCount++
    }
}
TowerGen.prototype.summon = function(){
    let minion = new ProjectileGen(this.x-this.range*Math.random(), this.y,Math.PI,this.projectile)
    minion.target = {
        x: this.x,
        y: this.y
    }
    minion.master = this
    this.shootTimer = this.rof;
}



TowerGen.prototype.normalUpdate = function(progress){
    let targetArray = [];
    switch(this.target){
        case 0:
            targetArray = Enemy.arr
        break;
        case 1:
            targetArray = Enemy.arrStrong
        break;
        case 2:
            targetArray = Enemy.arrLast
        break;
        case 3:
            targetArray = this.closest();
        break;
    }
    for(let i = 0; i<targetArray.length; i++){
        let enemy = targetArray[i];
        if(this.inRange(enemy)){
            let distance = short.distObj(this,enemy)
            let target = this.lead(enemy, distance);
            if(this.overkill(enemy)){
                this.setEnemyTargeted(enemy,distance);
            }
            this.setEnemyShotAt(enemy, distance);
            this.setBarrelAngle(target);
            this.shoot();
            break;

        }
    }
}

TowerGen.prototype.setEnemyTargeted = function(enemy, distance){
    enemy.targeted = true;
    setTimeout(()=>{enemy.targeted = false},distance/this.projectile.speed)
}

TowerGen.prototype.setEnemyShotAt = function(enemy, distance){
    enemy.shotAt+=this.damage;
    setTimeout(()=>{enemy.shotAt-=this.damage},distance/this.projectile.speed)
}

TowerGen.prototype.shoot = function(){
    switch(this.type){
        case 'projectile':
            new ProjectileGen(this.x, this.y, this.barrel.angle, this.projectile)
            this.shootTimer = this.rof;
            this.barrel.dy += this.barrel.height*this.shootTimer*this.barrel.knockback/this.rof
        break;
        case 'aoe':
            new ProjectileGen(this.x, this.y, 0, this.projectile);
            this.shootTimer = this.rof
            this.barrel.dy += this.barrel.height*this.shootTimer*this.barrel.knockback/this.rof
        break;
    }
    switch(this.shootSound){
        case 'shootSound':
            shootSound.pause()
            shootSound.currentTime=0;
            shootSound.play()
        break;
        case 'flamethrower':
            flameThrowerSound.pause()
            flameThrowerSound.currentTime=0;
            flameThrowerSound.play()
        break;
        case'tubeSound':
            tubeSound.pause()
            tubeSound.currentTime=0;
            tubeSound.play()
        break;
        case'thumperSound':
            thumperSound.pause()
            thumperSound.currentTime=0;
            thumperSound.play()
        break;
        default:
        break;
    }
        
    
}

TowerGen.prototype.setBarrelAngle = function(target){
    this.barrel.angle = short.angle([this.x, this.y], [target.x, target.y])+Math.PI/2+(Math.random()*(this.accuracy - this.accuracy*0.5));
}

TowerGen.prototype.inRange = function(object){
    return short.dist([this.x, this.y], [object.x, object.y])<this.range&&!object.targeted
}

TowerGen.prototype.lead = function(enemy, distance){
    return {
        x:enemy.x + enemy.xV*distance/this.projectile.speed,
        y:enemy.y + enemy.yV*distance/this.projectile.speed
    }
}
TowerGen.prototype.closest = function(){
    let arrayClosest = Enemy.arr.slice();

    arrayClosest.sort(function(a, b){
        return short.distObj(this, a) - short.dist(this,b);
    });

    return arrayClosest;
}

//if the enemy is too weak to bet shot at by more than one tower
TowerGen.prototype.overkill = function(enemy){
    return enemy.health-enemy.shotAt<=this.projectile.damage&&enemy.level==0
}

TowerGen.prototype.upgrade = function(){
    if(this.upgrades==undefined){return}
    let upgradeIndex = this.level + 1
    if(this.upgrades[upgradeIndex]==undefined){return}
    let upgrade = this.upgrades[upgradeIndex];
    if(cash<upgrade.cost){return}

    //Object.assign(this,upgrade)


    for(const [key, value] of Object.entries(upgrade)){
        if(typeof this[key] == 'object'){
            for(const [key1, value1] of Object.entries(upgrade[key])){
                Object.defineProperty(this[key],[key1],{
                    value:value1,
                    writable:true
                })
            }
        }else{
            this[key] = value;
        }
    }
    this.level++
    cash-=upgrade.cost
}

TowerGen.prototype.sell = function(){
    let sellValue = towers[this.name].cost
    for(let i = 0; i<this.level+1; i++){
        sellValue+=towers[this.name].upgrades[i].cost;
    }
    sellValue=sellValue*0.9;
    console.log(sellValue)
    cash+=sellValue;
    cashUpdate();
    TowerGen.arr.splice(this,1);
}








function ProjectileGen(x,y,angle,projectile){
    Object.assign(this, projectile)
    //console.log(this.color)

    this.seed = Math.random()

    this.x = x;
    this.y = y;
    this.xV = Math.cos(angle + Math.PI/2)*this.speed;
    this.yV = Math.sin(angle + Math.PI/2)*this.speed;
    //console.log(this.speed)
    this.health = this.pen
    this.angle = angle + Math.PI/2;
    this.life = this.life;
    this.enemySeedsHit = [];
    ProjectileGen.arr.push(this);
}
ProjectileGen.arr = [];

ProjectileGen.prototype.update = function(progress){
    if(this.x>towerBoard.width||this.x<0||this.y>towerBoard.height||this.y<0||this.health<0||this.life<=0){
        this.die();
    }
    for(let i = 0; i<Enemy.arr.length; i++){
        if(!short.checkEqualArr(this.enemySeedsHit, Enemy.arr[i].seed)){
            let enemy = Enemy.arr[i]
            if(short.dist([this.x, this.y], [enemy.x, enemy.y])<this.size/2+enemy.size/2){
                if(this.type == 'minion'){
                    sorcererKill.pause();
                    sorcererKill.currentTime = 0;
                    sorcererKill.play();
                    if(this.onhit=='minionexpload'){
                        this.willExpload = true;
                        this.die();
                    }
                }
                enemy.damage(this.damage);
                this.enemySeedsHit.push(enemy.seed);
                this.health--
            }
        }
    } 
    this.x+=this.xV * progress;
    this.y+=this.yV * progress;
    this.life-=progress
    if(this.type == 'minion'){
        this.minionUpdate(progress)
    }
}

ProjectileGen.prototype.minionUpdate = function(progress){
    if(this.target==undefined){this.target = this.die()}
    let force = short.forceObj(this,this.target,this.speed/400)
    let enemyArr = [];
    switch(this.master.target){
        case 0:
            enemyArr = Enemy.arr
        break;
        case 1:
            enemyArr = Enemy.arrLast
        break;
        case 2:
            enemyArr = this.master.closest();
        break;
        case 3:
            enemyArr = Enemy.arrStrong
        break;
    }
    for(let i = 0; i<enemyArr.length; i++){
        let enemy = enemyArr[i];
        if(short.distObj(this,enemy)<this.range){
            this.target = enemy
        }
    }

    this.xV+=force.x*progress
    this.yV+=force.y*progress
}
ProjectileGen.prototype.draw = function(){
    tctx.fillStyle = this.color;
    tctx.translate(this.x, this.y);
    tctx.rotate(this.angle);
    tctx.translate(-this.x, -this.y);
    tctx.fillRect(this.x-this.size/2, this.y-this.size/2, this.size, this.size)
    tctx.translate(this.x, this.y);
    tctx.rotate(-this.angle);
    tctx.translate(-this.x, -this.y);
}

ProjectileGen.prototype.die = function(){
    if(this.onhit=='expload'){
        new ProjectileGen(this.x, this.y,0,explosion)
        explosionSound.pause()
        explosionSound.currentTime=0;
        explosionSound.play()
    }
    if(this.type == 'minion'){
        this.master.minionCount--
    }
    if(this.onhit=='minionexpload'&&this.willExpload){
        new ProjectileGen(this.x, this.y,0,minionExplosion)
        explosionSound.pause()
        explosionSound.currentTime=0;
        explosionSound.play()
    }

    let seed = (element)=>element.seed == this.seed; 

    let index = ProjectileGen.arr.findIndex(seed);

    ProjectileGen.arr.splice(index,1);
    delete this
}







let lastRenderTower = 0;

function towerLoop(timestamp){
    let progress = timestamp - lastRenderTower;
    lastRenderTower = timestamp;
    tUpdate(progress);
    tDraw();
    if(isAlive()){
        window.requestAnimationFrame(towerLoop);
    }
}
window.requestAnimationFrame(towerLoop);

function tUpdate(progress){
    for(let i = 0; i<TowerGen.arr.length; i++){
        TowerGen.arr[i].update(progress)
    }
    for(let i = 0; i<ProjectileGen.arr.length; i++){
        ProjectileGen.arr[i].update(progress);
    }
}

function tDraw(){
    tctx.clearRect(0,0,towerBoard.width, towerBoard.height);
    for(let i = 0; i<ProjectileGen.arr.length; i++){
        ProjectileGen.arr[i].draw();
    }
    for(let i = 0; i<TowerGen.arr.length; i++){
        TowerGen.arr[i].draw();
    }
}