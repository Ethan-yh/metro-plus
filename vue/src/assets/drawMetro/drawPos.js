import Q from '../../lib/qunee-es.js';

var graph;
var line;
var stations;
var poss;
const DISTANCE = 50;
const ORI_XY = { x: 0, y: 0 };
var stationNodes = {};
var size = 6;

function drawStations() {
    for (let i in stations) {
        const station = stations[i];
        var node = graph.createNode(station.name, ORI_XY.x + i * DISTANCE, ORI_XY.y);
        node.movable = false;
        node.image = require('./images/right.png')
        node.size = { width: 16 }
        node.zIndex = 10;
        node.mtype = 'station';
        node.data = station;

        // node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_TOP);
        // node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
        // node.setStyle(Q.Styles.LABEL_ROTATE, Math.PI / 2);

        node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FFF");
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#000");

        stationNodes[station.id] = node;
    }
}

function drawLine() {
    var stations = line.stations;
    var node = graph.createNode(null);
    node.lineName = line.name;
    node.tooltip = line.name;
    node.lineColor = line.color;
    node.mtype = 'line';
    node.data = line;
    
    //node.lineDirection = line.direction;
    node.movable = false;
    node.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
    node.setStyle(Q.Styles.LABEL_COLOR, line.color);
    //node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
    node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);
    node.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
    node.anchorPosition = null;
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, line.color);
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
    node.setStyle(Q.Styles.SHAPE_STROKE, size);
    node.setStyle(Q.Styles.EDGE_CORNER, Q.Consts.EDGE_CORNER_ROUND);
    node.setStyle(Q.Styles.EDGE_CORNER_RADIUS, 100);

    var path = new Q.Path();



    for (let i = 0; i < stations.length; i++) {
        var station = stationNodes[stations[i].id];
        if (station) {
            var x = station.x,
                y = station.y;
            if (i == 0) {
                path.moveTo(x, y);
            } else {
                path.lineTo(x, y);
            }
        }
    }

    path.validate();
    node.image = path;
    return node;
}

function drawTrains()
{
    for(let i in poss){
        const trainPos = poss[i];
        const lPos = {x:stationNodes[trainPos.left_sid].x, y:stationNodes[trainPos.left_sid].y}
        const rPos = {x:stationNodes[trainPos.right_sid].x, y:stationNodes[trainPos.right_sid].y}
        const pos = {x:(lPos.x+rPos.x)/2, y:lPos.y-20};

        console.log('pos:', pos)
        var node = graph.createNode(null, pos.x, pos.y);
        node.tooltip = trainPos.train_id;
        node.movable = false;
        node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
        node.image = require('./images/train.png');
        node.size = { width: 25 };
        node.mtype = 'train';
        node.data = trainPos.train_id;
        

        node.zIndex = 10;

        node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FFF");
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#000");

    }
}



// function drawPassVol(passVol)
// {
//     for(let i in passVol.vols){
//         const vol = passVol.vols[i];
//         const pos = {x:ORI_XY.x+i*20, y:ORI_XY.y+40};

//         var node = graph.createNode(vol, pos.x, pos.y);
//         node.movable = false;
//         node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.CENTER_BOTTOM);
//         node.image = require('./images/train.png');
//         node.size = { width: 25 };
//         node.mtype = 'passVol';
//         node.data = vol;
        

//         node.zIndex = 10;

//         node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FFF");
//         node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#000");

//     }
// }


function drawPos(canvas, posData) {
    canvas.innerHTML = "";
    graph = new Q.Graph(canvas);
    line = posData.line;
    stations = line.stations;
    poss = posData.poss;
    drawStations();

    drawLine();

    drawTrains();

    graph.zoomToOverview();

    return graph;
}

export default drawPos;