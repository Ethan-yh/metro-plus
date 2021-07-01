const mongoose = require('mongoose');

// const LineStaSchema = new mongoose.Schema({
//     line_id: { type: String, unique: true },
//     stations: [{ station_id: { type: String }, station_name: { type: String } }]
// });

// 站点
const StationSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    x: { type: Number },
    y: { type: Number },
    labelPos: { type: String },
    lines: [{ id: { type: String } }]
});

// 线路
const LineSchema = new mongoose.Schema({
    id: { type: String, unique: true },
    name: { type: String },
    color: { type: String },
    stations: [{ id: { type: String }, name: { type: String }, azimuth: { type: String } }]
});

// 列车实时位置
const TrainPosSchema = new mongoose.Schema({
    train_id: { type: String },
    line_id: { type: String },
    left_sid: { type: String },
    right_sid: { type: String },
    time: { type: Date, default: Date.now }
});

// 列车实时拥挤度
const PassVolSchema = new mongoose.Schema({
    train_id: { type: String },
    line_id: { type: String },
    vols: [{ type: Number }],
    time: { type: Date, default: Date.now }
});

// 站点实时入站人数
const PassEntrySchema = new mongoose.Schema({
    station_id: { type: String },
    station_name: { type: String },
    minutegroup: { type: Number },
    entry: { type: Number },
    time: { type: Date, default: Date.now }
});

// 故障信息
const LineFaultSchema = new mongoose.Schema({
    line_name: { type: String },
    msg: { type: String },
    status: { type: String },
    time: { type: Date, default: Date.now }
});

// // 路径
// const PathSchema = new mongoose.Schema({
//     od: {
//         o_sid: { type: String },
//         d_sid: { type: String },
//         unique: true,
//     },
//     paths: [{
//         path: [{ lineId: { type: String }, stationsIds: [{ type: String }] }],
//         costtime: { type: Number },
//         trantime: { type: Number },
//         price: { type: Number }
//     }]
// });

// const LineStaModel = mongoose.model('line', LineStaSchema);
const StationModel = mongoose.model('station', StationSchema);
const LineModel = mongoose.model('line', LineSchema);
const TrainPosModel = mongoose.model('train_pos', TrainPosSchema);
const PassVolModel = mongoose.model('pass_vol', PassVolSchema);
const PassEntryModel = mongoose.model('pass_entry', PassEntrySchema);
const LineFaultModel = mongoose.model('line_fault', LineFaultSchema);
// const PathModel = mongoose.model('path', PathSchema);



module.exports = { StationModel, LineModel, TrainPosModel, PassVolModel, PassEntryModel, LineFaultModel };