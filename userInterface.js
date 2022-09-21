const towerPreview = document.getElementById('towerPreview');
const pctx = towerPreview.getContext('2d');

var selection = undefined
function setSelection(selectionString){
    selection = selectionString;
    console.log(selection)
    statsMenu.show = false;
};

var mouseX = undefined;
var mouseY = undefined;
document.addEventListener('mousemove',(event)=>{
    mouseX = (event.x - towerPreview.offsetLeft)*towerPreview.width/towerPreview.clientWidth
    mouseY = (event.y)*towerPreview.height/towerPreview.clientHeight
    mouseX = Math.floor(mouseX);
    mouseY = Math.floor(mouseY);
    drawPreview(mouseX, mouseY);
});
function drawPreview(x,y){
    if(selection==undefined){
        pctx.clearRect(0,0,towerPreview.width, towerPreview.height);
        drawStats();
        return
    }
    
    let intersecting = checkIntersecting(x,y);
    pctx.clearRect(0,0,towerPreview.width, towerPreview.height);
    if(cash<towers[selection].cost||intersecting){    
        pctx.strokeStyle = 'red';
    }else{
        pctx.strokeStyle = 'green';
    }
    pctx.lineWidth = 1;
    let size = towers[selection].size
    let range = towers[selection].range
    pctx.setLineDash([])
    pctx.strokeRect(x - size/2 + 0.5, y - size/2 + 0.5, size, size);
    pctx.setLineDash([5,5])
    pctx.beginPath();
    pctx.arc(x + 0.5, y + 0.5,range,0, 2*Math.PI);
    pctx.stroke();
}
var canPlace = true;
function placeTower(){
    if(selection==undefined){
        if(checkTowerClicked(mouseX,mouseY)){statsMenu.show = true};
        return
    }
    
    if(cash<towers[selection].cost||checkIntersecting(mouseX,mouseY)){
        canPlace = false;
        if(checkTowerClicked(mouseX, mouseY)){
            statsMenu.show = true;
            selection = undefined;
        }
        return
    }
    cash-=towers[selection].cost;
    cashUpdate();
    new TowerGen(selection, mouseX, mouseY);
}
function checkIntersecting(x,y){
    let intersecting = false;
    let selfMinX = x - towers[selection].size/2;
    let selfMaxX = x + towers[selection].size/2;
    let selfMinY = y - towers[selection].size/2;
    let selfMaxY = y + towers[selection].size/2;
    for(let i = 0; i<TowerGen.arr.length;i++){
        let intersectingX = false;
        let intersectingY = false;
        let other = TowerGen.arr[i];
            let otherMinX = other.x - other.size/2
            let otherMaxX = other.x + other.size/2
            let otherMinY = other.y - other.size/2
            let otherMaxY = other.y + other.size/2
        if(selfMinX >= otherMaxX || selfMaxX <= otherMinX){}else{intersectingX = true}
        if(selfMinY >= otherMaxY || selfMaxY <= otherMinY){}else{intersectingY = true}
        if(intersectingX&&intersectingY){intersecting = true; i=TowerGen.arr.length}
    }
    for(let i = 0; i<track.segments; i++){
        let selfSize = towers[selection].size

        let point1 = track.shape[i]
        let point2 = track.shape[i+1]

        point1 = [point1[0] - x, point1[1] - y];
        point2 = [point2[0] - x, point2[1] - y];

        let angle = Math.atan2(point2[0] - point1[0], point2[1] - point1[1]);

        point1 = [
            Math.cos(angle)*point1[0] - Math.sin(angle)*point1[1], 
            Math.cos(angle)*point1[1] + Math.sin(angle)*point1[0]
        ]
        point2 = [
            Math.cos(angle)*point2[0] - Math.sin(angle)*point2[1], 
            Math.cos(angle)*point2[1] + Math.sin(angle)*point2[0]
        ]
        let distance = Math.abs(point1[0]+point2[0])/2;

        let segmentLength = track.segmentLengths[i];
        let maxDist = segmentLength+track.width/2+selfSize/2
        

        let inBetween = Math.abs(point1[1])<maxDist&&Math.abs(point2[1])<maxDist;
        if(inBetween&&distance<track.width/2 + selfSize/2){intersecting = true}
    }
    return intersecting
}

var statsMenu = {
    show:false,
    facing:'left',
    x:0,
    y:0,
    tower:{},
}

function drawStats(){
    if(!statsMenu.show){return}
    let message = `${statsMenu.tower.name} ROF:${statsMenu.tower.rof}ms, damage:${statsMenu.tower.projectile.damage}, Range${statsMenu.tower.range}, Target:${targetString[statsMenu.tower.target]}`
    let upgradedMessage = undefined
    if(statsMenu.tower.upgrades!=undefined){
        if(statsMenu.tower.upgrades[statsMenu.tower.level+1]){
            upgradedMessage = `Upgrade Cost:$${statsMenu.tower.upgrades[statsMenu.tower.level+1].cost}`
        }
    }
    if(statsMenu.facing=='right'){
        pctx.font = '12px serif';
        pctx.fillStyle = 'yellow'
        pctx.fillText('<'+ message, statsMenu.x+0.5 + statsMenu.tower.size/2, statsMenu.y+0.5 + statsMenu.tower.size/2);
        if(upgradedMessage){
            pctx.fillText('<'+ upgradedMessage, statsMenu.x+0.5 + statsMenu.tower.size/2, statsMenu.y+0.5 + statsMenu.tower.size/2+13);
        }
    }else{
        pctx.font = '12px serif';
        pctx.fillStyle = 'yellow'
        pctx.fillText(message+'>', statsMenu.x+0.5-message.length*6, statsMenu.y+0.5 + statsMenu.tower.size/2);
        if(upgradedMessage){
            pctx.fillText(upgradedMessage+'>', statsMenu.x+0.5-upgradedMessage.length*6, statsMenu.y+0.5 + statsMenu.tower.size/2+13);
        }
    }
    pctx.setLineDash([]);
    pctx.strokeStyle = 'yellow';
    pctx.strokeRect(statsMenu.x-statsMenu.tower.size/2, statsMenu.y-statsMenu.tower.size/2, statsMenu.tower.size, statsMenu.tower.size);
    pctx.setLineDash([5,5]);
    pctx.beginPath();
    pctx.arc(statsMenu.x, statsMenu.y, statsMenu.tower.range, 0, Math.PI*2)
    pctx.stroke()
}

function checkTowerClicked(x,y){
    let towerClicked = undefined;
    let intersecting = false;
    
    let selfMinX = x
    let selfMaxX = x
    let selfMinY = y
    let selfMaxY = y
    if(selection==undefined){
        selfMinX = x - 2;
        selfMaxX = x + 2;
        selfMinY = y - 2;
        selfMaxY = y + 2;
    }else{
        selfMinX = x - towers[selection].size/2;
        selfMaxX = x + towers[selection].size/2;
        selfMinY = y - towers[selection].size/2;
        selfMaxY = y + towers[selection].size/2;
    
    }

    console.log('check')
    for(let i = 0; i<TowerGen.arr.length;i++){
        let intersectingX = false;
        let intersectingY = false;
        let other = TowerGen.arr[i];
            let otherMinX = other.x - other.size/2
            let otherMaxX = other.x + other.size/2
            let otherMinY = other.y - other.size/2
            let otherMaxY = other.y + other.size/2
        if(selfMinX >= otherMaxX || selfMaxX <= otherMinX){}else{intersectingX = true}
        if(selfMinY >= otherMaxY || selfMaxY <= otherMinY){}else{intersectingY = true}
        if(intersectingX&&intersectingY){intersecting = true;towerClicked = other; i=TowerGen.arr.length}
    }
    if(intersecting){
        if(x>towerPreview.width/2){
            statsMenu.facing = 'left'
        }else{
            statsMenu.facing = 'right'
        }
        statsMenu.x = towerClicked.x
        statsMenu.y = towerClicked.y
        statsMenu.tower = towerClicked;
        return towerClicked
    }else{
        statsMenu.show = false;
        return false
    }
}

function upgradeTower(){
    if(!statsMenu.show){return}
    statsMenu.tower.upgrade();
    drawPreview();
    cashUpdate();
}

function changeTarget(){
    if(!statsMenu.show){return}
    statsMenu.tower.target++
    if(statsMenu.tower.target>targetString.length-1){
        statsMenu.tower.target = 0;
    }
    drawPreview();
}