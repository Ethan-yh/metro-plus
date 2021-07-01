
const mongoose = require("mongoose");
const {LineModel, TrainPosModel} = require('../db/mongoModel');

const databaseUrl = "mongodb://localhost:27017/metro";

const TRAIN_NUM_PER_LINE = 5;
const TIME = 5*60*1000;
let count = 0;

function genTrainPos(lines) {
    const items = []
    for (let i in lines) {
        const line = lines[i];
        for (j = 0; j < TRAIN_NUM_PER_LINE; j++) {
            // const myDate = new Date();
            const item = {
                train_id: '' + line['id'] + '-' + j,
                line_id: line['id'],
                left_sid: line.stations[(j * parseInt(30 / TRAIN_NUM_PER_LINE) + count) % line.stations.length].id,
                right_sid: line.stations[(j * parseInt(30 / TRAIN_NUM_PER_LINE) + count + 1) % line.stations.length].id,
            }
            items.push(item);
        }
    }
    count++;
    count %= 30;
    return items
}

async function genAndUpload(lines)
{
    console.log('记录列车位置');
    const items = genTrainPos(lines);
    for(let i in items){
        await TrainPosModel.create(items[i]);
        
    }
}

async function uploadTrainPos(){
    const lines = await LineModel.find();
    await genAndUpload(lines);
    setInterval(async() => {
        await genAndUpload(lines);
    }, TIME);
}

// mongoose.connect(databaseUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
// }, async () => {
//     const lines = await LineModel.find();
//     setInterval(async() => {
//         const items = genTrainPos(lines);
//         console.log(items)
//         for(let i in items){
//             await TrainPosModel.create(items[i]);
            
//         }
//         console.log('记录列车位置')
//     }, TIME);
// })

module.exports = uploadTrainPos;