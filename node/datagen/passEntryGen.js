const axios = require('axios');
const { url } = require('./config');
const entry_data = require('../data/entry_data.json')


const TIME = 5 * 60 * 1000;

async function uploadPassEntry() {
    console.log('上传进站量')
    const d = new Date();
    const minutegroup = ''+parseInt((d.getHours() * 60 + d.getMinutes()) / 5);
    const records = entry_data[minutegroup]
    await axios.post(url + '/passEntry/uploadPassEntryAll', records);
}

async function passEntryGen() {
    // for(let i in entry_data){
    //     await axios.post(url + '/passEntry/uploadPassEntryAll', entry_data[i]);
    // }
    // await uploadPassEntry();
    // setInterval(async() => {
    //     await uploadPassEntry();
    // }, TIME);
}

module.exports = passEntryGen;