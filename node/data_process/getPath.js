const { getPath, getEdge, updateMetroData } = require('./caculatePath')
const edge = require('../data/edge.json')
const metro_data = require('../data/metro_data.json')
const fs = require('fs')

getEdge(edge)

stations = metro_data['stations']

docs = []

for(let i in stations){
    const o_station = stations[i];
    for(let j in stations){
        const d_station = stations[j];
        if(o_station.id==d_station.id){
            continue;
        }
        const pathItem = {};
        pathItem.od = {o_sid: o_station.id, d_sid: d_station.id};
        pathItem.paths = []
        // console.log('oid', o_station.id)
        pathItem.paths.push(getPath(metro_data, o_station.id, d_station.id))
        docs.push(pathItem)
    }
}

fs.writeFileSync('../data/path.json', JSON.stringify(docs, null, 4), 'utf8');

