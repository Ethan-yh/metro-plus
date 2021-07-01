const express = require('express');
const router = express.Router();
const { LineFaultModel } = require('../db/mongoModel')

router.post('/uploadLineFault', async (req, res) => {
    console.log(req.body)
    await LineFaultModel.create(req.body);

    res.send({
        status: 0
    })
});

// 
router.post('/getLineFaultDate', async (req, res) => {
    const date = req.body.date;
    let d1, d2;
    if (!date) {
        d1 = new Date(Date.now());
        d2 = new Date(Date.now());
    } else {
        d1 = new Date(date);
        d2 = new Date(date);
    }
    d1.setHours(0);
    d1.setMinutes(0);
    d1.setSeconds(0);
    d2.setHours(0);
    d2.setMinutes(0);
    d2.setSeconds(0);
    d2.setDate(d2.getDate() + 1);
    const docs = await LineFaultModel.find({ time: { $gte: d1, $lte: d2 } });

    res.send({
        status: 0,
        records: docs
    })
});



module.exports = router;