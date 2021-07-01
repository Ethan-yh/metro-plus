const express = require('express');
const router = express.Router();
const fs = require('fs');
const execSync = require('child_process').execSync;

const { PassEntryModel } = require('../db/mongoModel');

// 上传站点进站量
router.post('/uploadPassEntry', async (req, res) => {

    await PassEntryModel.create(req.body);

    res.send({
        status: 0,
    });
})

// 上传全部站点进站量
router.post('/uploadPassEntryAll', async (req, res) => {

    await PassEntryModel.insertMany(req.body);


    res.send({
        status: 0,
    });
})

// 获取站点最近进站量
router.post('/getPassEntry', async (req, res) => {
    const timeRange = 5 * 60 * 1000;

    const station_id = req.body.station_id;
    console.log('查询站点进站量:', station_id);
    // const poss = line_id
    const docs = await PassEntryModel.find({ station_id: station_id, time: { $gte: Date.now() - timeRange } });
    const item = docs.sort((a, b) => b.time - a.time)[0]

    res.send({
        status: 0,
        record: item
    });
})



// 获取全部站点进站量
router.post('/getPassEntryAll', async (req, res) => {
    const timeRange = 5 * 60 * 1000;

    console.log('查询全部站点进站量');
    // const poss = line_id
    const date1 = new Date();
    const minutegroup = parseInt((date1.getHours() * 60 + date1.getMinutes()) / 5)
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);

    const date2 = new Date();
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setDate(date2.getDate() + 1)


    const docs = await PassEntryModel.find({ $and: [{ time: { $gte: date1, $lte: date2 } }, { minutegroup: minutegroup }] });

    res.send({
        status: 0,
        records: docs
    });
})

// 获取全部站点某天进站量
router.post('/getPassEntryAllDay', async (req, res) => {

    console.log('查询全部站点某天进站量');
    // const poss = line_id
    console.log(req.body)
    if (!req.body.date) {
        return res.send({
            status: -1,
            msg: '没有日期参数'
        })
    }
    const d1 = new Date(req.body.date);
    const d2 = new Date(req.body.date);
    d2.setDate(d2.getDate() + 1)
    const docs = await PassEntryModel.find({ $and: [{ time: { $gte: d1 } }, { time: { $lte: d2 } }] });

    res.send({
        status: 0,
        records: docs
    });
})

// 获取全部站点某天某时间进站量
router.post('/getPassEntryAllTime', async (req, res) => {

    console.log('查询全部站点某天进站量');
    // const poss = line_id
    console.log(req.body)
    if (!req.body.date) {
        return res.send({
            status: -1,
            msg: '没有日期参数'
        })
    }
    const d1 = new Date(req.body.date);
    d1.setHours(0);
    const d2 = new Date(req.body.date);
    d2.setDate(d2.getDate() + 1);
    d2.setHours(0);

    const minutegroup = req.body.minutegroup;
    console.log(d1)
    console.log(d2)

    const docs = await PassEntryModel.find({ $and: [{ time: { $gte: d1 } }, { time: { $lte: d2 } }, { minutegroup: minutegroup }] });


    res.send({
        status: 0,
        records: docs
    });
})

// 获取全部站点某天进站量
router.post('/getPassEntryAllDay', async (req, res) => {

    console.log('查询全部站点某天进站量');
    // const poss = line_id
    console.log(req.body)
    if (!req.body.date) {
        return res.send({
            status: -1,
            msg: '没有日期参数'
        })
    }
    const d1 = new Date(req.body.date);
    const d2 = new Date(req.body.date);
    d2.setDate(d2.getDate() + 1)
    const docs = await PassEntryModel.find({ $and: [{ time: { $gte: d1 } }, { time: { $lte: d2 } }] });

    res.send({
        status: 0,
        records: docs
    });
})

// 预测进站量
router.post('/predictEntry', async (req, res) => {

    const timeRange = 5 * 60 * 1000;

    console.log('预测站点进站量');
    const station_id = req.body.station_id;
    // const poss = line_id
    const date1 = new Date();
    const minutegroup = parseInt((date1.getHours() * 60 + date1.getMinutes()) / 5)
    date1.setDate(16);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);

    const date2 = new Date();
    date1.setDate(16);
    date2.setHours(0);
    date2.setMinutes(0);
    date2.setSeconds(0);
    date2.setDate(date2.getDate() + 1)

    const docs0 = await PassEntryModel.find({ $and: [{ time: { $gte: date1, $lte: date2 } }, { minutegroup: minutegroup - 2 }, { station_id: station_id }] });
    const item0 = docs0[0];
    const docs1 = await PassEntryModel.find({ $and: [{ time: { $gte: date1, $lte: date2 } }, { minutegroup: minutegroup - 1 }, { station_id: station_id }] });
    const item1 = docs1[0];
    const docs2 = await PassEntryModel.find({ $and: [{ time: { $gte: date1, $lte: date2 } }, { minutegroup: minutegroup }, { station_id: station_id }] });
    const item2 = docs2[0];
    const param = { preX: [item1.entry, item2.entry] };
    fs.writeFileSync('./data/param.json', JSON.stringify(param));
    const output = execSync('python ./entryPredict.py');
    const result = {};

    // const preResult = require('../data/result.json');
    const preResult = JSON.parse(fs.readFileSync('./data/result.json'));
    result.station_id = station_id;
    result.data = [];
    result.data.push(item0.entry)
    result.data.push(item1.entry)
    result.data.push(item2.entry)
    result.data.push(preResult.preY[0])
    result.data.push(preResult.preY[1])

    res.send({
        status: 0,
        result: result
    });
})

module.exports = router