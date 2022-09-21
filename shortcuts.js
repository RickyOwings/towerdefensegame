const short = {
    dist:(point1, point2)=>{
        let dx = point2[0] - point1[0]
        let dy = point2[1] - point1[1]
        return Math.sqrt(dx**2 + dy**2)
    },
    distObj:(obj1, obj2)=>{
        let dx = obj2.x - obj1.x
        let dy = obj2.y - obj1.y
        return Math.sqrt(dx**2 + dy**2)
    },
    angle:(point1, point2)=>{
        let dx = point1[0] - point2[0]
        let dy = point1[1] - point2[1]
        return Math.atan2(dy, dx)
    },
    checkEqualArr:(array,value)=>{
        if(array[0] == undefined){return false}
        if(value == undefined){return false}
        for(let i = 0; i<array.length; i++){
            if(array[i] == value){
                return true;
            }
        }
        return false;
    },
    forceObj:(obj1, obj2, mag)=>{
        let dx = obj2.x - obj1.x
        let dy = obj2.y - obj1.y
        let dist = Math.sqrt(dx**2 + dy**2)
        return {
            x:dx*mag/dist,
            y:dy*mag/dist
        }
    }
}