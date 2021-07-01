const express = require('express');
const router = express.Router();
const { StationModel } = require('../db/mongoModel')

router.post('/getStation', async (req, res) => {
    const id = req.body.id;
    const stations = await StationModel.find({ $or: [{ id: req.body.id }, { name: req.body.name }] }, { _id: 0, _v: 0 });

    res.send({
        status: 0,
        stations: stations
    })
});

router.post('/getAllStations', async (req, res) => {
    const stations = await StationModel.find({}, { _id: 0, _v: 0 });

    res.send({
        status: 0,
        stations: stations
    })
});

module.exports = router;