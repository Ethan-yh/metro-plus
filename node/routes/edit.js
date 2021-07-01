const express = require('express');
const router = express.Router();
const { LineModel, StationModel } = require('../db/mongoModel');
const edit = require('../dataedit/edit');
const metro_data = require('../data/metro_data.json')

async function refreshDB(){
    const newMetroData = edit.getMetroData();
    const lines = newMetroData['lines']
    const stations = newMetroData['stations']

    global.redis.set('metro_data', JSON.stringify(newMetroData));

    await LineModel.deleteMany({});
    await StationModel.deleteMany({});

    for(let i in lines){
        const line = lines[i];
        const item1 = JSON.parse(JSON.stringify(line));
        item1['id'] += '-0';
        // console.log(item1)
        await LineModel.create(item1);

        const item2 = JSON.parse(JSON.stringify(line));
        item2['id'] += '-1';
        item2['stations'] = item2['stations'].reverse()

        // console.log(item2)

        await LineModel.create(item2);
    }

    for(let i in stations){
        const station = stations[i];
        await StationModel.create(station);
    }
}

// 增加站点
router.post('/addStation', async (req, res) => {
    const addStation = req.body;
    const ret = edit.addStation(metro_data, addStation);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});

// 编辑站点
router.post('/editStation', async (req, res) => {
    const editStation = req.body;
    const ret = edit.editStation(metro_data, editStation);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();
    
    return res.send({
        status:0,
        msg:ret.message
    });
});

// 获取站点信息
router.post('/getStationInfo', async (req, res) => {
    const getStation = req.body;
    const ret = edit.getStationInfo(metro_data, getStation);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    // refreshDB();
    
    return res.send({
        status:0,
        msg:ret.message,
        stationInfo: ret.stationInfo
    });
});

// 删除站点
router.post('/removeStation', async (req, res) => {
    const removeStation = req.body;
    const ret = edit.removeStation(metro_data, removeStation);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});

// 添加线路
router.post('/addLine', async (req, res) => {
    const addLine = req.body;
    const ret = edit.addLine(metro_data, addLine);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});

// 编辑线路
router.post('/editLine', async (req, res) => {
    const editLine = req.body;
    const ret = edit.editLine(metro_data, editLine);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});

// 获取线路信息
router.post('/getLineInfo', async (req, res) => {
    const getLine = req.body;
    const ret = edit.getLineInfo(metro_data, getLine);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    // refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});

// 删除线路
router.post('/removeLine', async (req, res) => {
    const removeLine = req.body;
    const ret = edit.removeLine(metro_data, removeLine);
    if(ret.status==-1){
        return res.send({
            status:-1,
            msg:ret.message
        })
    }

    refreshDB();

    return res.send({
        status:0,
        msg:ret.message
    });
});



module.exports = router;