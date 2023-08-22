const background = document.getElementById('background');
const bCTX = background.getContext('2d');

const trackShape = [
    [0, 100],
    [450, 100],
    [500, 150],
    [500, 500],
    [455, 500],
    [455, 170],
    [430, 145],
    [100, 145],
    [100, 300],
    [400, 300],
    [400, 500],
    [300, 500],
    [300, 250],
    [200, 250],
    [200, 500],
    [0, 500],
]

function TrackMaker(shape, color, width) {
    this.shape = shape;
    this.color = color;
    this.width = width;

    this.svgString += '0'
    this.svg = new Path2D(this.svgString);

    this.segments = shape.length - 1;

    this.segmentLengths = [];
    this.xFactor = [];
    this.yFactor = [];
    this.totalLength = 0;
    for (let i = 0; i < shape.length - 1; i++) {
        let dX = shape[i + 1][0] - shape[i][0]
        let dY = shape[i + 1][1] - shape[i][1]
        let dist = Math.sqrt(dX ** 2 + dY ** 2)
        this.segmentLengths.push(dist);
        this.xFactor.push(dX / dist);
        this.yFactor.push(dY / dist);
        this.totalLength += dist;
    }
}

TrackMaker.prototype.draw = function () {
    bCTX.lineWidth = this.width;
    bCTX.strokeStyle = this.color;
    bCTX.moveTo(this.shape[0][0], this.shape[0][1]);
    for (let i = 1; i < this.shape.length; i++) {
        bCTX.lineTo(this.shape[i][0], this.shape[i][1]);
    }
    bCTX.stroke();
}

bCTX.fillStyle = 'grey';
bCTX.fillRect(0, 0, background.width, background.height)


let track = new TrackMaker(trackShape, 'black', 30);
track.draw();
