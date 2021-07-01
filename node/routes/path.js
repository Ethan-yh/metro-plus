const express = require('express');
const router = express.Router();
const { getPath, getEdge, updateMetroData } = require('../data_process/caculatePath')
const edge = require('../data/edge.json')
const metro_data = require('../data/metro_data.json')


router.post('/getPath', async (req, res) => {

    const o_sid = req.body.o_sid;
    const d_sid = req.body.d_sid;
    if (o_sid == d_sid) {
        return res.send({
            status: -1,
            msg: '首尾不能相同'
        })
    }
    getEdge(edge);
    const ret = getPath(metro_data, o_sid, d_sid);

    res.send({
        status: 0,
        path: ret
    })
});





module.exports = router;