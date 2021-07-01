var metroData;
var edge;

function getEdge(e) {
    edge = e;
}

function PathToLine(pathNode) {
    this.curPath = [];
    this.path = [];
    this.bestNum;
    this.transferNum = 0;
    this.pathNode = pathNode;

    this.traceback = function(i, lastPathId) {
        if (this.transferNum > this.bestNum) {
            return;
        }
        if (i == this.pathNode.length) {

            // this.path = [];
            this.path = JSON.parse(JSON.stringify(this.curPath));


            this.bestNum = this.transferNum;

            return;
        }
        var stationId1 = this.pathNode[i - 1];
        var stationId2 = this.pathNode[i];


        edge[stationId1][stationId2].forEach((eId) => {

            // if (!this.curPath[eId]) {
            //     this.curPath[eId] = [];
            // }
            //换乘数量+1
            if (eId != lastPathId) {
                this.curPath.push({ lineId: eId, stationIds: [] });
                this.transferNum++;
            }
            this.curPath[this.curPath.length - 1].stationIds.push('' + stationId2);

            this.traceback(i + 1, eId);

            this.curPath[this.curPath.length - 1].stationIds.pop();
            // this.curPath[eId].pop();
            if (eId != lastPathId) {
                this.transferNum--;
            }
            if (!this.curPath[this.curPath.length - 1].stationIds.length) {
                this.curPath.pop();
            }
            // if (!Object.keys(this.curPath[eId]).length) {
            //     delete this.curPath[eId];
            // }
        })
    }

    this.getPath = function() {
        this.traceback(1, null);


        // var count = 0;
        // var lastLineId;
        for (let i = 0; i < this.path.length; i++) {
            if (i == 0) {
                this.path[i].stationIds.unshift(pathNode[0]);
                continue;
            }
            this.path[i].stationIds.unshift(this.path[i - 1].stationIds[this.path[i - 1].stationIds.length - 1]);
        }
        // for (let pathLine in this.path) {
        //     if (count == 0) {
        //         pathLine.unshift(pathNode[0]);
        //         lastLineId = lineId;
        //         count++;
        //         continue
        //     }
        //     pathLine.unshift(this.path[lastLineId][this.path[lastLineId].length - 1]);
        //     lastLineId = lineId;
        //     count++;
        // }


        return JSON.parse(JSON.stringify(this.path));
    }
}

// 避免多次换乘到同一线路
function aviodSameLine(pathNode) {
    var tempPathNode = pathNode.slice();
    var flag = 1;

    for (let i = 0; i < pathNode.length; i++) {
        for (let j = pathNode.length - 1; j >= 0 && j > i; j--) {

            var samePathNode = onSameLinePathNode(pathNode[i], pathNode[j]);
            if (samePathNode) {

                tempPathNode.splice(i, j - i + 1);
                for (let k = samePathNode.length - 1; k >= 0; k--) {
                    tempPathNode.splice(i, 0, samePathNode[k]);
                }
            }
        }
    }
    return tempPathNode;
}

function getPathNode(start, end, prev) {
    var pathNode = [];
    var t = end;

    while (t) {
        pathNode.unshift(t);

        t = prev[t];
    }
    pathNode.unshift(start);

    return pathNode;
}

function findStationById(id) {
    stations = metroData.stations;
    for (let i = 0; i < stations.length; i++) {
        if (stations[i].id == '' + id) {
            return JSON.parse(JSON.stringify(stations[i]));
        }
    }
    return null;
}

function onSameLinePathNode(start, end) {
    var lineId = null;
    var pathNode = [];
    var startStation = findStationById(start);
    var endStation = findStationById(end);
    startStation.lines.forEach((l1) => {
        endStation.lines.forEach((l2) => {
            if (l1.id == l2.id) {
                lineId = l1.id;
            }
        });

    });

    var firstIndex = -1;
    var endIndex = -1;
    if (lineId) {
        var lineStations;
        metroData.lines.forEach((line) => {
            if (line.id == lineId) {
                lineStations = line.stations;
            }
        });
        lineStations.forEach((lineStation, index) => {
            if (lineStation.id == start) {
                firstIndex = index;
            }
            if (lineStation.id == end) {
                endIndex = index;
            }
        });

        if (firstIndex >= 0 && endIndex >= 0) {
            if (firstIndex < endIndex) {
                for (let i = firstIndex; i <= endIndex; i++) {
                    pathNode.push(lineStations[i].id);
                }
            } else {
                for (let i = firstIndex; i >= endIndex; i--) {
                    pathNode.push(lineStations[i].id);
                }
            }
            return pathNode;
        }
        return null;
    }

}

function dijstra(start, end) {
    var prev = {}; //记录前驱
    var dist = {}; //记录距离
    var flag = {}; //记录是否以及找到路径

    var distance = metroData.distance;
    var num = Object.keys(distance).length

    for (let key in distance) {
        flag[key] = 0;
        prev[key] = 0;
        dist[key] = distance[start][key];

    }

    flag[start] = 1;
    dist[start] = 0;


    for (let i = 0; i < num; i++) {
        min = Number.MAX_VALUE;
        var t;
        for (let key in distance) {
            if (!flag[key] && dist[key] && dist[key] < min) {
                min = dist[key];
                t = key;
            }
        }
        flag[t] = 1;
        if (t == end) {
            var pathNode = getPathNode(start, end, prev);
            return pathNode;
        }

        for (let key in distance) {
            if (distance[t][key]) {
                if (!dist[key] || dist[key] > min + distance[t][key]) {
                    dist[key] = min + distance[t][key];
                    prev[key] = t;
                }
            }
        }
    }


}


function getPath(_metroData, start, end) {
    // var pathNode = onSameLinePathNode(start, end);
    // if (!pathNode) {
    //     console.log('未得到共线路径')
    //     pathNode = dijstra(start, end);
    //     // pathNode = aviodSameLine(pathNode);
    // }
    if (!metroData) {
        metroData = _metroData;
    }
    pathNode = dijstra(start, end);
    var ptl = new PathToLine(pathNode);
    var path = ptl.getPath();
    return path;

}

function updateMetroData(_metroData) {
    metroData = _metroData;
}

module.exports = { getPath, getEdge, updateMetroData };