const express = require('express');
const router = express.Router();

const { PassVolModel, LineModel } = require('../db/mongoModel');

// 上传列车拥挤度
router.post('/uploadPassVol', async (req, res) => {

    await PassVolModel.create(req.body);

    res.send({
        status: 0,
    });
})

// 上传全部列车拥挤度
router.post('/uploadPassVolAll', async (req, res) => {

    await PassVolModel.insertMany(req.body);


    res.send({
        status: 0,
    });
})

// 获取列车拥挤度
router.post('/getPassVol', async (req, res) => {
    const timeRange = 5 * 60 * 1000;

    const train_id = req.body.train_id;
    console.log('查询列车乘客量:', train_id);
    // const poss = line_id
    const docs = await PassVolModel.find({ train_id: train_id, time: { $gte: Date.now() - timeRange } });
    const item = docs.sort((a, b) => b.time - a.time)[0]

    res.send({
        status: 0,
        record: item
    });
})

function getLineVol(docs){
    let vol = 0;
    for(let i in docs){
        const doc = docs[i];
        vol+=doc.vols[0];
    }
    vol/=docs.length;
    return parseInt(vol*100)/100;
}

// 获取线路拥挤度
router.post('/getAllLinePassVol', async (req, res) => {
    const timeRange = 5 * 60 * 1000;

    const time1 = Date.now();
    const time2 = time1 - timeRange;
    const time3 = time2 - timeRange;
    const time4 = time3 - timeRange;
    const time5 = time4 - timeRange;
    const time6 = time5 - timeRange;

    const lines = await LineModel.find();
    const lineVols = {};

    for (let i in lines) {
        const line = lines[i];
        const docs1 = await PassVolModel.find({ line_id: line.id, time: { $gte: time2, $lte: time1 } });
        const docs2 = await PassVolModel.find({ line_id: line.id, time: { $gte: time3, $lte: time2 } });
        const docs3 = await PassVolModel.find({ line_id: line.id, time: { $gte: time4, $lte: time3 } });
        const docs4 = await PassVolModel.find({ line_id: line.id, time: { $gte: time5, $lte: time4 } });
        const docs5 = await PassVolModel.find({ line_id: line.id, time: { $gte: time6, $lte: time5 } });
        lineVols[line.name] = {}
        lineVols[line.name]['color'] = line.color;
        lineVols[line.name]['records'] = []
        lineVols[line.name]['records'].push(getLineVol(docs5))
        lineVols[line.name]['records'].push(getLineVol(docs4))
        lineVols[line.name]['records'].push(getLineVol(docs3))
        lineVols[line.name]['records'].push(getLineVol(docs2))
        lineVols[line.name]['records'].push(getLineVol(docs1))
    }


    

    res.send({
        status: 0,
        lineVols:lineVols
    });
})



module.exports = router