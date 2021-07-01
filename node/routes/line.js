const express = require('express');
const router = express.Router();
const { LineModel } = require('../db/mongoModel')

router.post('/getLine', async (req, res) => {
    const id = req.body.id;
    const lines = await LineModel.find({ $or: [{ id: req.body.id }, { name: req.body.name }] }, { _id: 0, _v: 0 });

    res.send({
        status: 0,
        lines: lines
    })
});

router.post('/getAllLines', async (req, res) => {
    const lines = await LineModel.find({}, { _id: 0, _v: 0 });

    res.send({
        status: 0,
        lines: lines
    })
});

module.exports = router;