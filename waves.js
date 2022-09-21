const startRoundButton = document.getElementById('startRound');
const roundCounter = document.getElementById('round')

var round = 0;

const waves = [
    [//round1
        {level:0,count:20,interval:400},
    ],
    [//round2
        {level:0,count:30,interval:200},
    ],
    [//round3
        {level:0,count:30,interval:200},
        {count:1, interval:1000},
        {level:1,count:2,interval:500},
        {count:1, interval:1000},
        {level:0,count:30,interval:200},
        {level:1,count:2,interval:500},
    ],
    [//round4
        {level:1, count:100, interval:400}
    ],
    [//round5
        {level:1, count:150, interval:300}
    ],
    [//round6
        {level:1, count:150, interval:100},
        {level:2, count:25, interval:150},
        {level:1, count:150, interval:100},
        {level:2, count:25, interval:150},
    ],
    [//round7
        {level:0, count:500, interval:40},
    ],
    [//round8
        {level:2, count:300, interval:200}
    ],
    [//round9
        {level:2, count:100, interval:200},
        {level:1, count:50, interval:40},
        {level:2, count:100, interval:150}
    ],
    [//round10
        {level:0, count:10,interval:10},
        {count:1, interval:7000},
        {level:2,count:200,interval:150}
    ],
    [//round11
        {level:2,count:100,interval:150},
        {level:3,count:10,interval:400},
        {level:2,count:100,interval:200}
    ],
    [//round12
        {level:0,count:1,interval:1000}
    ],
    [//round13
        {level:3,count:300,interval:300}
    ],
    [//round14
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
        {level:3,count:5,interval:50},
        {count:1,interval:1000},
    ],
    [//round15
        {level:4,count:10,interval:500}
    ],
    [//round 16
        {level:4,count:20,interval:400}
    ],
    [//round 17
        {level:3,count:100,interval:100},
        {level:4,count:4,interval:50},
        {level:3,count:100,interval:100},
        {level:4,count:8,inverval:50}
    ]
]



var currentWave = undefined;
var waveIndex = 0;
var enemiesSpawned = 0;
var waveOngoing = false;

function startRound(){
    if(waveOngoing){return}
    waveOngoing = true;

    roundCounter.innerHTML = `Round ${round+1}`
    startRoundButton.innerHTML = 'Wait till next round!'
    if(round>waves.length-1){
        currentWave = waves[waves.length-1]
    }else{
        currentWave = waves[round];
    }
    waveIndex = 0;
    
    setTimeout(summonloop,500)
}
function summonloop(){
    let interval = undefined;
    if(currentWave[waveIndex] == undefined&&Enemy.arr.length==0){
        waveOngoing = false;
        startRoundButton.innerHTML = 'Start Round'
        round++
        cash+=100;
        cashUpdate();
        return
    }
    
    if(currentWave[waveIndex] == undefined){
        interval = 1000;
    }else{
        interval = currentWave[waveIndex].interval
        if(currentWave[waveIndex].level!=undefined){
            new Enemy(currentWave[waveIndex].level)
        }
        enemiesSpawned++
        if(enemiesSpawned>=currentWave[waveIndex].count){
            waveIndex++
            enemiesSpawned = 0;
        }
    }
    setTimeout(summonloop,interval)
}