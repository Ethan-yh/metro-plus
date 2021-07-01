var metroData;
const fs = require('fs');
const datafilePath = './data/metro_data.json'

function addStation(_metroData, addStation) {
    var myDate = new Date();
    if (!metroData) {
        metroData = _metroData;
    }
    var stations = metroData.stations;

    for (let i = 0; i < stations.length; i++) {
        if (stations[i].name == addStation.name) {
            return ({
                status: -1,
                message: '该站已存在'
            })
        }
    }
    var id = myDate.getTime();
    const sta = { id: '' + id, name: addStation.name, x: parseInt(addStation.x), y: parseInt(addStation.y), labelPos: addStation.labelPos, lines: [] };
    stations.push(sta);

    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');

    return ({
        status: 1,
        message: '添加新站成功',
        station: sta
    })
}

function editStation(_metroData, editStation) {
    var myDate = new Date();
    var flag = 0;
    if (!metroData) {
        metroData = _metroData;
    }
    var stations = metroData.stations;

    for (let i = 0; i < stations.length; i++) {
        if (stations[i].name == editStation.name) {
            stations[i].x = parseInt(editStation.x);
            stations[i].y = parseInt(editStation.y);
            stations[i].labelPos = editStation.labelPos;
            flag = 1;
            break;
        }
    }

    if (!flag) {
        return ({
            status: -1,
            message: '没有该站'
        })
    }

    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');

    return ({
        status: 1,
        message: '编辑站成功'
    })
}

function getStationInfo(_metroData, getStation) {
    if (!metroData) {
        metroData = _metroData;
    }


    var stations = metroData.stations;

    var stationInfo = {};
    var index;
    for (index = 0; index < stations.length; index++) {
        if (stations[index].name == getStation.name) {
            break;
        }
    }

    if (index >= stations.length) {
        return ({
            status: -1,
            message: '没有该站'
        });
    }

    stationInfo.name = stations[index].name;
    stationInfo.x = stations[index].x;
    stationInfo.y = stations[index].y;
    stationInfo.labelPos = stations[index].labelPos;

    return ({
        status: 1,
        message: '查到该站点信息',
        stationInfo: stationInfo
    });
}

function removeStation(_metroData, removeStation) {
    if (!metroData) {
        metroData = _metroData;
    }
    var stations = metroData.stations;
    var index;
    for (let i = 0; i < stations.length; i++) {
        if (stations[i].name == removeStation.name) {
            index = i;
            break;
        }
    }
    const sta_id = stations[index].id;

    if (index) {
        if (stations[index].lines.length == 0) {
            stations.splice(index, 1);
            fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');
            return ({
                status: 1,
                message: '删除站成功',
                station_id: sta_id
            })
        } else {
            return ({
                status: -1,
                message: '请先删除经过该站的线路'
            })
        }

    } else {
        return ({
            status: -1,
            message: '没有该站'
        })
    }

}

function getStationIdByName(name) {
    for (let i = 0; i < metroData.stations.length; i++) {
        if (metroData.stations[i].name == name) {
            return metroData.stations[i].id;
        }
    }
    return null;
}

//站点偏移方位
var size = 8;
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

function updateStationLine() {
    metroData.stations.forEach((station) => {
        station.lines = [];
        metroData.lines.forEach((line) => {
            line.stations.forEach((lineStation) => {
                if (lineStation.id == station.id) {
                    station.lines.push({ 'id': line.id });
                }
            })
        })
    })
}

function checkDistance(line) {
    var stations = line.stations;
    for (let i = 1; i < stations.length; i++) {
        if (!metroData.distance[stations[i].id][stations[i - 1].id]) {
            metroData.distance[stations[i].id][stations[i - 1].id] = 3;
            metroData.distance[stations[i - 1].id][stations[i].id] = 3;
        }
    }
}

function editLine(_metroData, editLine) {
    if (!metroData) {
        metroData = _metroData;
    }

    var stationAndAzimuths = editLine.stations.split(',');
    var line = {};
    var lines = metroData.lines;

    var index;
    for (index = 0; index < lines.length; index++) {
        if (lines[index].name == editLine.name) {
            break;
        }
    }

    if (index >= lines.length) {
        return ({
            status: -1,
            message: '没有该路线'
        });
    }

    line.name = editLine.name;
    line.color = editLine.color;

    var strIndex1 = editLine.name.search('号线');
    var strIndex2 = editLine.name.search('支线');

    if (strIndex1 > 0) {
        if (strIndex2 > 0) {
            line.id = 'e' + editLine.name.substring(0, strIndex1);
        } else {
            line.id = 'l' + editLine.name.substring(0, strIndex1);
        }
    } else {
        line.id = 'n' + editLine.name;
    }

    line.stations = [];
    if (stationAndAzimuths.length == 1) {
        return ({
            status: -1,
            message: '路线格式错误'
        });
    }

    for (let i = 0; i < stationAndAzimuths.length; i++) {
        var t = stationAndAzimuths[i].split('-');
        if (t.length != 2) {
            return ({
                status: -1,
                message: '路线格式错误'
            });
        }
        if (t[1] != 'null' && !azimuth[t[1]]) {
            return ({
                status: -1,
                message: '偏移格式错误'
            });
        }
        var id = getStationIdByName(t[0]);

        if (id) {
            line.stations.push({ id: id, name: t[0], azimuth: t[1] == 'null' ? null : t[1] });
        } else {
            return ({
                status: -1,
                message: '含有不存在的站'
            });
        }
    }
    checkDistance(line);
    fs.writeFileSync('./data/last_metro_data.json', JSON.stringify(metroData, null, 4), 'utf8');
    lines[index] = line;
    updateStationLine()
    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');


    return ({
        status: 1,
        message: '添加路线成功'
    });
}

function addLine(_metroData, addLine) {
    if (!metroData) {
        metroData = _metroData;
    }

    var stationAndAzimuths = addLine.stations.split(',');
    var line = {};
    var lines = metroData.lines;


    for (let i = 0; i < lines.length; i++) {
        if (lines[i].name == addLine.name) {
            return ({
                status: -1,
                message: '路线已存在'
            });
        }
    }
    line.name = addLine.name;
    line.color = addLine.color;

    var strIndex1 = addLine.name.search('号线');
    var strIndex2 = addLine.name.search('支线');

    if (strIndex1 > 0) {
        if (strIndex2 > 0) {
            line.id = 'e' + addLine.name.substring(0, strIndex1);
        } else {
            line.id = 'l' + addLine.name.substring(0, strIndex1);
        }
    } else {
        line.id = 'n' + addLine.name;
    }

    line.stations = [];
    if (stationAndAzimuths.length == 1) {
        return ({
            status: -1,
            message: '路线格式错误'
        });
    }

    for (let i = 0; i < stationAndAzimuths.length; i++) {
        var t = stationAndAzimuths[i].split('-');
        if (t.length != 2) {
            return ({
                status: -1,
                message: '路线格式错误'
            });
        }
        if (t[1] != 'null' && !azimuth[t[1]]) {
            return ({
                status: -1,
                message: '偏移格式错误'
            });
        }
        var id = getStationIdByName(t[0]);

        if (id) {
            line.stations.push({ id: id, name: t[0], azimuth: t[1] == 'null' ? null : t[1] });
        } else {
            return ({
                status: -1,
                message: '含有不存在的站'
            });
        }
    }
    checkDistance(line);
    fs.writeFileSync('./data/last_metro_data.json', JSON.stringify(metroData, null, 4), 'utf8');
    lines.push(line);
    updateStationLine()
    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');


    return ({
        status: 1,
        message: '添加路线成功'
    });
}

function getLineInfo(_metroData, getLine) {
    if (!metroData) {
        metroData = _metroData;
    }


    var lines = metroData.lines;

    var lineInfo = {};
    var index;
    for (index = 0; index < lines.length; index++) {
        if (lines[index].name == getLine.name) {
            break;
        }
    }

    if (index >= lines.length) {
        return ({
            status: -1,
            message: '没有该路线'
        });
    }

    lineInfo.name = lines[index].name;
    lineInfo.color = lines[index].color;

    var stations = lines[index].stations;

    var lineStationsInfo = '';

    lineStationsInfo += stations[0].name;
    lineStationsInfo += '-';
    lineStationsInfo += stations[0].azimuth;
    for (let i = 1; i < stations.length; i++) {
        lineStationsInfo += ',';
        lineStationsInfo += stations[i].name;
        lineStationsInfo += '-';
        lineStationsInfo += stations[i].azimuth;
    }

    lineInfo.station = lineStationsInfo;

    return ({
        status: 1,
        message: '查到该路线信息',
        lineInfo: lineInfo
    });
}

function removeLine(_metroData, removeLine) {
    if (!metroData) {
        metroData = _metroData;
    }


    var lines = metroData.lines;

    var lineInfo = {};
    var index;
    for (index = 0; index < lines.length; index++) {
        if (lines[index].name == removeLine.name) {
            break;
        }
    }

    if (index >= lines.length) {
        return ({
            status: -1,
            message: '没有该路线'
        });
    }

    fs.writeFileSync('./data/last_metro_data.json', JSON.stringify(metroData, null, 4), 'utf8');

    lines.splice(index, 1);
    updateStationLine();
    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');
    return ({
        status: 1,
        message: '删除路线成功',
        lineInfo: lineInfo
    });
}


function editDistance(_metroData, edge) {
    if (!metroData) {
        metroData = _metroData;
    }

    var stationId1 = getStationIdByName(edge.stationName1);
    var stationId2 = getStationIdByName(edge.stationName2);

    if (!stationId1 || !stationId2) {
        return ({
            status: -1,
            message: '没有该站'
        });
    }



    var distance = metroData.distance;

    if (!distance[stationId1] || !distance[stationId1][stationId2]) {
        return ({
            status: -1,
            message: '两站没有相邻'
        });
    }

    fs.writeFileSync('./data/last_metro_data.json', JSON.stringify(metroData, null, 4), 'utf8');

    distance[stationId1][stationId2] = parseInt(edge.distanceNum);
    distance[stationId2][stationId1] = parseInt(edge.distanceNum);

    fs.writeFileSync(datafilePath, JSON.stringify(metroData, null, 4), 'utf8');
    return ({
        status: 1,
        message: '修改距离成功',
    });
}

function getDistanceInfo(_metroData, edge) {
    if (!metroData) {
        metroData = _metroData;
    }

    var stationId1 = getStationIdByName(edge.stationName1);
    var stationId2 = getStationIdByName(edge.stationName2);

    if (!stationId1 || !stationId2) {
        return ({
            status: -1,
            message: '没有该站'
        });
    }

    var distance = metroData.distance;

    if (!distance[stationId1] || !distance[stationId1][stationId2]) {
        return ({
            status: -1,
            message: '两站没有相邻'
        });
    }

    var distanceInfo = { stationName1: edge.stationName1, stationName2: edge.stationName2, distance: distance[stationId1][stationId2] }
    return ({
        status: 1,
        message: '修改距离成功',
        distanceInfo: distanceInfo
    });
}


function updateMetroData(_metroData) {
    metroData = _metroData;
}

function getMetroData() {
    return metroData;
}


module.exports = {
    addStation,
    editStation,
    getStationInfo,
    removeStation,
    addLine,
    getLineInfo,
    editLine,
    removeLine,
    editDistance,
    getDistanceInfo,
    updateMetroData,
    getMetroData
};