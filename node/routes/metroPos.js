const { time } = require('console');
const express = require('express');
const router = express.Router();
// const mysql = require('../db/mysql');
const { StationModel, LineModel, TrainPosModel } = require('../db/mongoModel');

// 上传列车位置
// router.post('/', (req, res)=>{
//     const {trainId, time, lineId, leftStaId, rightStaId} = req.body.trainId;
// })

// 获取某线路最近的列车位置
router.post('/', async (req, res) => {
    const timeRange = 5 * 60 * 1000;



    const line_id = req.body.line.id;
    console.log(line_id)
    // const poss = line_id
    const poss = await TrainPosModel.find({ line_id: line_id, time: { $gte: Date.now() - timeRange } });
    console.log(poss)
    res.send({
        status: 0,
        poss: poss
    })
})

module.exports = router