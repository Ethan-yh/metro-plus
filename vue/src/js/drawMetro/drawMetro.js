import Q from '../../lib/qunee-es.js';
import png from './images/transfer.png'

// if (!window.getI18NString) { getI18NString = function(s) { return s; } }
var graph;
var size = 6;
var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 8, 8);
var stationNodes = {};
var lineNodes = {};
var pathNodes = [];
var isDisplayPath = 0;
var edge = {};


function drawMetro(canvas, metroData){
    
    graph = new Q.Graph(canvas);
    graph.tooltipDelay = 0;
    // Q.loadJSON("./data/metro_data.json", loadMetroDatas, showError);
    loadMetroDatas(metroData);
    // graph.addCustomInteraction({
    //     onclick: function(evt, graph) {
    //         var element = graph.getElementByMouseEvent(evt);
    //         if (isDisplayPath) {
    //             removePath();
    //             if (startStation) {
    //                 startStation.removeUI(startUI);
    //                 startStation = null;
    //             }
    //             if (endStation) {
    //                 endStation.removeUI(endUI);
    //                 endStation = null;
    //             }
    //             return;
    //         }
    //         if (element) {
    
    //             if (element.stationId) {
    //                 if (!startStation) {
    //                     element.addUI(startUI);
    //                     startStation = element;
    //                 } else if (!endStation) {
    //                     element.addUI(endUI);
    //                     endStation = element;
    //                 } else {
    //                     startStation.removeUI(startUI);
    //                     endStation.removeUI(endUI);
    //                     startStation = element;
    //                     endStation = null;
    //                     element.addUI(startUI);
    //                 }
    //             }
    //         } else {
    
    //             if (startStation) {
    //                 startStation.removeUI(startUI);
    //                 startStation = null;
    //             }
    //             if (endStation) {
    //                 endStation.removeUI(endUI);
    //                 endStation = null;
    //             }
    
    //         }
    
    //     }
    // });
}


//站点偏移方位
var azimuth = {
    'bb': { x: 0, y: size / 2 },
    'tt': { x: 0, y: -size / 2 },
    'rr': { x: size / 2, y: 0 },
    'll': { x: -size / 2, y: 0 },
    'br': { x: size * 0.70707 / 2, y: size * 0.707 / 2 },
    'bl': { x: -size * 0.707 / 2, y: size * 0.707 / 2 },
    'tr': { x: size * 0.707 / 2, y: -size * 0.707 / 2 },
    'tl': { x: -size * 0.707 / 2, y: -size * 0.707 / 2 },
    'BB': { x: 0, y: size },
    'TT': { x: 0, y: -size },
    'RR': { x: size, y: 0 },
    'LL': { x: -size, y: 0 },
    'BR': { x: size * 0.707, y: size * 0.707 },
    'BL': { x: -size * 0.707, y: size * 0.707 },
    'TR': { x: size * 0.707, y: -size * 0.707 },
    'TL': { x: -size * 0.707, y: -size * 0.707 }
};

//label位置
var labelPos = {
    'top': { p: Q.Position.CENTER_TOP, ap: Q.Position.CENTER_BOTTOM },
    'bottom': { p: Q.Position.CENTER_BOTTOM, ap: Q.Position.CENTER_TOP },
    'left': { p: Q.Position.LEFT_MIDDLE, ap: Q.Position.RIGHT_MIDDLE },
    'right': { p: Q.Position.RIGHT_MIDDLE, ap: Q.Position.LEFT_MIDDLE },
    'topleft': { p: Q.Position.LEFT_TOP, ap: Q.Position.RIGHT_BOTTOM },
    'topright': { p: Q.Position.RIGHT_TOP, ap: Q.Position.LEFT_BOTTOM },
    'bottomleft': { p: Q.Position.LEFT_BOTTOM, ap: Q.Position.RIGHT_TOP },
    'bottomright': { p: Q.Position.RIGHT_BOTTOM, ap: Q.Position.LEFT_TOP },
}


// 根据id获取站点
function getStationNode(id) {
    if (id) {
        return stationNodes[id];
    }
    return null;
}

//获取label坐标
function getLabelPos(labelPosKey) {
    if (labelPosKey) {
        return labelPos[labelPosKey];
    }
    return { p: Q.Position.CENTER_BOTTOM, ap: Q.Position.CENTER_TOP }
}

//判断是否是换乘站
function isTransferStation(station) {
    var num = 0;
    station.lines.forEach((l) => {
        if (l.id[0] != 'b')
            num++;
    })
    return num > 1 ? true : false;
}

//创建站点
function createStation(station) {
    var node = graph.createNode(station.name, station.x, station.y)
    node.stationId = station.id;
    node.movable = false;
    node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, getLabelPos(station.labelPos).ap);
    node.setStyle(Q.Styles.LABEL_POSITION, getLabelPos(station.labelPos).p);
    node.zIndex = 10;
    if (isTransferStation(station)) {
        // node.image = "../assets/drawMetro/images/transfer.png";
        // node.image = png;
        node.size = { width: 16 }
    } else {
        node.image = circle;
    }
    node.setStyle(Q.Styles.SHAPE_FILL_COLOR, "#FFF");
    node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, "#000");

    return node;
}

//获取偏移坐标
function toAzimuthXY(stationNode, lineStation) {
    if (stationNode) {
        if (lineStation.azimuth) {
            return { x: stationNode.x + azimuth[lineStation.azimuth].x, y: stationNode.y + azimuth[lineStation.azimuth].y };
        }
        return { x: stationNode.x, y: stationNode.y };
    }
    return null;
}

//保存线路经过的点
function saveLinePoint(node, point, stationId) {
    if (!node['allPoints']) {
        node['allPoints'] = [];
    }
    node['allPoints'].push({ point: point, stationId: stationId });
}

//消除数组重复元素
function removeRepeatArray(arr) {
    return arr.filter(function(item, index, self) {
        return self.indexOf(item) === index;
    });
}

//创建线路
function createLine(line) {
    var stations = line.stations;
    var node = graph.createNode(null);
    node.lineName = line.name;
    node.tooltip = line.name;
    node.lineColor = line.color;
    //node.lineDirection = line.direction;
    node.stations = stations;
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

    node.image = path;

    for (let i = 0; i < stations.length; i++) {
        var station = stationNodes[stations[i].id];
        if (station) {
            var x = station.x,
                y = station.y;

            //避免线重合，坐标要进行偏移
            if (stations[i].azimuth) {
                x += azimuth[stations[i].azimuth].x;
                y += azimuth[stations[i].azimuth].y;
            }
            if (i == 0) {
                path.moveTo(x, y);
                saveLinePoint(node, { x: x, y: y }, stations[i].id);
            } else {

                //保存边数据
                if (!edge[stations[i].id]) {
                    edge[stations[i].id] = {};
                }
                if (!edge[stations[i - 1].id]) {
                    edge[stations[i - 1].id] = {};
                }
                if (!edge[stations[i].id][stations[i - 1].id]) {
                    edge[stations[i].id][stations[i - 1].id] = [];
                }
                if (!edge[stations[i - 1].id][stations[i].id]) {
                    edge[stations[i - 1].id][stations[i].id] = [];
                }
                edge[stations[i].id][stations[i - 1].id].push(line.id);
                edge[stations[i - 1].id][stations[i].id].push(line.id);

                edge[stations[i - 1].id][stations[i].id] = removeRepeatArray(edge[stations[i - 1].id][stations[i].id]);
                var temp;
                temp = i - 2 >= 0 ? getStationNode(stations[i - 2].id) : null;
                var p1 = toAzimuthXY(temp, stations[i - 2]);

                temp = getStationNode(stations[i - 1].id);
                var p2 = toAzimuthXY(temp, stations[i - 1]);

                temp = getStationNode(stations[i].id);
                var p3 = toAzimuthXY(temp, stations[i]);

                temp = i + 1 < stations.length ? getStationNode(stations[i + 1].id) : null;
                var p4 = toAzimuthXY(temp, stations[i + 1]);

                var p = setInflectionPoint(p1, p2, p3, p4);

                if (p) {
                    path.lineTo(p.x, p.y);
                    saveLinePoint(node, { x: p.x, y: p.y }, null);
                }

                path.lineTo(x, y);
                saveLinePoint(node, { x: x, y: y }, stations[i].id);
            }
        }
    }

    return node;
}

//设置透明度
function setTransparent(path) {
    for (let stationId in stationNodes) {
        stationNodes[stationId].setStyle(Q.Styles.ALPHA, 0.1);
    }
    for (let lineId in lineNodes) {
        lineNodes[lineId].setStyle(Q.Styles.ALPHA, 0.1);
    }
    path.forEach((pathLine) => {
        pathLine.stationIds.forEach((stationId) => {
            stationNodes[stationId].setStyle(Q.Styles.ALPHA, 1);
        });
    });

}

//恢复透明度
function resetTransparent() {
    if (!isDisplayPath) {
        for (let stationId in stationNodes) {
            stationNodes[stationId].setStyle(Q.Styles.ALPHA, 1);
        }
        for (let lineId in lineNodes) {
            lineNodes[lineId].setStyle(Q.Styles.ALPHA, 1);
        }
    }
}

function getPathPointsFromLineNode(lineId, stationIds) {


    var points = [];
    var allPointsLength = lineNodes[lineId].allPoints.length;
    var allPoints = [];
    var isCircle = 0;

    for (let i = 0; i < allPointsLength; i++) {
        allPoints[i] = lineNodes[lineId].allPoints[i];
    }

    //首尾相同
    if (allPoints[allPoints.length - 1].stationId == allPoints[0].stationId) {
        isCircle = 1;
        allPoints.pop();
        allPointsLength = allPoints.length;
        for (let i = 0; i < allPointsLength; i++) {
            allPoints[i + allPointsLength] = allPoints[i];
        }
    }


    var firstIndex;
    for (firstIndex = 0; firstIndex < allPoints.length; firstIndex++) {
        if (allPoints[firstIndex].stationId == stationIds[0]) {
            break;
        }

    }




    //向右匹配
    var stationIndex = 0;
    for (let i = firstIndex; i < allPoints.length; i++) {
        var x = allPoints[i].point.x;
        var y = allPoints[i].point.y;
        points.push({ x: x, y: y });
        if (allPoints[i].stationId) {
            if (allPoints[i].stationId == stationIds[stationIndex]) {
                stationIndex++;
            } else {
                break;
            }

        }
        if (allPoints[i].stationId == stationIds[stationIds.length - 1]) {
            break;
        }
    }


    //匹配成功
    if (stationIndex == stationIds.length) {
        return points;
    }
    //向左匹配
    points = []
    stationIndex = 0;
    for (let i = firstIndex + (isCircle ? allPoints.length / 2 : 0); i >= 0; i--) {
        var x = allPoints[i].point.x;
        var y = allPoints[i].point.y;
        points.push({ x: x, y: y });
        if (allPoints[i].stationId) {
            if (allPoints[i].stationId == stationIds[stationIndex]) {
                stationIndex++;
            } else {
                break;
            }

        }
        if (allPoints[i].stationId == stationIds[stationIds.length - 1]) {
            break;
        }
    }

    //匹配成功
    if (stationIndex == stationIds.length) {
        return points;
    }

    return null;
}

function drawPath(path) {
    isDisplayPath = 1;
    setTransparent(path);
    var points = [];

    path.forEach((pathLine) => {
        lineId = pathLine.lineId;
        points = getPathPointsFromLineNode(lineId, pathLine.stationIds);
        var node = graph.createNode(null);
        node.lineName = lineNodes[lineId].lineName;
        node.tooltip = lineNodes[lineId].lineName;
        // node.lineColor = line.color;
        //node.lineDirection = line.direction;
        node.movable = false;
        node.setStyle(Q.Styles.LABEL_FONT_SIZE, 20);
        node.setStyle(Q.Styles.LABEL_COLOR, lineNodes[lineId].lineColor);
        //node.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.LEFT_MIDDLE);
        node.setStyle(Q.Styles.LABEL_POSITION, Q.Position.RIGHT_MIDDLE);
        node.setStyle(Q.Styles.LAYOUT_BY_PATH, true);
        node.anchorPosition = null;
        node.setStyle(Q.Styles.SHAPE_STROKE_STYLE, lineNodes[lineId].lineColor);
        node.setStyle(Q.Styles.SHAPE_FILL_COLOR, null);
        node.setStyle(Q.Styles.SHAPE_STROKE, 10);
        node.setStyle(Q.Styles.EDGE_CORNER, Q.Consts.EDGE_CORNER_ROUND);
        node.setStyle(Q.Styles.EDGE_CORNER_RADIUS, 100);

        var pathImage = new Q.Path();

        node.image = pathImage;

        pathImage.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            pathImage.lineTo(points[i].x, points[i].y)
        }

        pathNodes.push(node);
    });

    var msg = '';
    path.forEach(pathLine => {
        var lineNode = lineNodes[pathLine.lineId];

        msg += '<span style="font-weight:bold;color:' + lineNode.lineColor + '">' + lineNode.lineName + ':' + '</span>';
        var stationIds = pathLine.stationIds;
        msg += stationNodes[stationIds[0]].name;

        for (let i = 1; i < stationIds.length; i++) {
            msg += '-'
            msg += stationNodes[stationIds[i]].name;
        }

        msg += '<br>';
    })

    document.getElementById("transferDlg").innerHTML = msg;
    $('#transferDlg').dialog('open');
}

function removePath() {
    isDisplayPath = 0;
    resetTransparent();
    $('#transferDlg').dialog('close');
    pathNodes.forEach((p) => {
        graph.removeElement(p);
    })

    pathNodes = [];
}

//设置拐点
var setInflectionPoint = function(p1, p2, p3, p4) {
    if (p2 && p3 && needAddPoint(p2, p3)) {
        var so = 0;
        var os = 0;

        so += byPrevPoint(p1, p2, p3).so;
        os += byPrevPoint(p1, p2, p3).os;
        so += byNextPoint(p2, p3, p4).so;
        os += byNextPoint(p2, p3, p4).os;

        var p = os > so ? obliqueStraight(p2, p3) : straightOblique(p2, p3);

        return p;

    }
    return null;
}

//取角度
var getAngle = function(p1, p2, p3) {
    var va = { x: p2.x - p1.x, y: p2.y - p1.y };
    var vb = { x: p2.x - p3.x, y: p2.y - p3.y };
    var angle = Math.acos((vb.x * va.x + vb.y * va.y) / (Math.sqrt(va.x * va.x + va.y * va.y) * Math.sqrt(vb.x * vb.x + vb.y * vb.y))) * 180 / Math.PI;
    return angle;
}

//判断两点之间是否需要加拐点
var needAddPoint = function(p1, p2) {
    var equalX = Math.abs(p1.x - p2.x) < size / 2 ? true : false;
    var equalY = Math.abs(p1.y - p2.y) < size / 2 ? true : false;
    var equalXY = Math.abs(Math.abs(p2.x - p1.x) - Math.abs(p2.y - p1.y)) < size / 2 ? true : false;
    if (equalX || equalY || equalXY) {
        return false;
    } else {
        return true;
    }
}

var byPrevPoint = function(p1, p2, p3) {
    var pso = straightOblique(p2, p3);
    var pos = obliqueStraight(p2, p3);
    var soAngle = p1 ? getAngle(p1, p2, pso) : 0;
    var osAngle = p1 ? getAngle(p1, p2, pos) : 0;
    return { 'so': soAngle, 'os': osAngle };
}

var byNextPoint = function(p2, p3, p4) {
    var pso = straightOblique(p2, p3);
    var pos = obliqueStraight(p2, p3);
    var soAngle = p4 ? getAngle(pso, p3, p4) : 0;
    var osAngle = p4 ? getAngle(pos, p3, p4) : 0;
    return { 'so': soAngle, 'os': osAngle };
}


var straightOblique = function(p1, p2) {
    var pointX, pointY;
    if (Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)) {
        var sign = p2.x > p1.x ? 1 : -1;
        pointX = p2.x - Math.abs(p2.y - p1.y) * sign;
        pointY = p1.y;
    } else {
        var sign = p2.y > p1.y ? 1 : -1;
        pointX = p1.x;
        pointY = p2.y - Math.abs(p2.x - p1.x) * sign;
    }
    return { x: pointX, y: pointY };
}

var obliqueStraight = function(p1, p2) {
    var pointX, pointY;
    if (Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)) {
        var sign = p2.x > p1.x ? 1 : -1;
        pointX = p1.x + Math.abs(p2.y - p1.y) * sign;
        pointY = p2.y;
    } else {
        var sign = p2.y > p1.y ? 1 : -1;
        pointX = p2.x;
        pointY = p1.y + Math.abs(p2.x - p1.x) * sign;
    }
    return { x: pointX, y: pointY };
}

function loadMetroDatas(metroData) {
    Q.forEach(metroData.stations, function(s) {
        var stationNode = createStation(s);
        stationNodes[s.id] = stationNode;

    });

    Q.forEach(metroData.lines, (l) => {
        var lineNode = createLine(l);
        lineNodes[l.id] = lineNode;


    });

    // ipcRenderer.send('edge-data', edge);
    // graph.zoomToOverview();
}

function showError() {
    console.log('Read file error')
}


// Q.loadJSON("./data/metro_data.json", loadMetroDatas, showError);

//起点站UI
// var startUI = new Q.ImageUI('./images/start.png');
// startUI.position = Q.Position.CENTER_TOP;
// startUI.anchorPosition = Q.Position.CENTER_BOTTOM;
// startUI.offsetY = 10;
// startUI.size = { width: 30 };

// //终点站UI
// var endUI = new Q.ImageUI('./images/end.png');
// endUI.position = Q.Position.CENTER_TOP;
// endUI.anchorPosition = Q.Position.CENTER_BOTTOM;
// endUI.offsetY = 10;
// endUI.size = { width: 30 };

var startStation = null;
var endStation = null;



export default drawMetro;

