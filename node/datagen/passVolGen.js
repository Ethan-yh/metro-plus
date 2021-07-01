const axios = require('axios');
const { url } = require('./config');

const Carriage_Num = 6;
const TRAIN_NUM_PER_LINE = 5;
const TIME = 5 * 60 * 1000;

function genVolsForLine() {
    const vols = [];

    // 一列地铁每个车厢拥挤度不会差太多，先来个基准拥挤度
    let baseVol = Math.random();
    if (baseVol > 0.9) {
        baseVol -= 0.1;
    }

    for (let i = 0; i < Carriage_Num; i++) {

        vols.push(Math.round((baseVol + Math.random() / 10) * 100) / 100);
    }

    return vols;
}

async function uploadPassVol(lines) {
    console.log('上传地铁乘客量');
    const items = [];
    for (let i in lines) {
        const line = lines[i];
        for (let j = 0; j < TRAIN_NUM_PER_LINE; j++) {
            const train_id = line.id + '-' + j;
            const vols = genVolsForLine();
            items.push({
                train_id: train_id,
                line_id: line.id,
                vols: vols
            });
            
        }
    }
    await axios.post(url + '/passVol/uploadPassVolAll', items);
}

async function passVolGen() {
    const res = await axios.post(url + '/line/getAllLines');
    if (res.data.status != 0) {
        console.log('请求错误')
        return;
    }
    const lines = res.data.lines;
    // console.log('lines',lines)

    await uploadPassVol(lines);

    setInterval(async () => {
        await uploadPassVol(lines);
    }, TIME);
}

module.exports = passVolGen;