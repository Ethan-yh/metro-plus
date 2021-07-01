const line_sta = require('../data/line_sta.json')
const metro_data = require('../data/metro_data.json')
const {StationModel,  LineModel} = require('../db/mongoModel')
const mongoose = require("mongoose");

// console.log(line_sta)

const databaseUrl = "mongodb://localhost:27017/metro";

mongoose.connect(databaseUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
},async()=>{
    console.log('mongodb connected')
    // for(let i in line_sta){
    //     const item = line_sta[i]
    //     const ret = await LineStaModel.create(item);
    //     console.log(ret)
    // }
    const lines = metro_data['lines']
    const stations = metro_data['stations']

    // for(let i in lines){
    //     const line = lines[i];
    //     const item1 = JSON.parse(JSON.stringify(line));
    //     item1['id'] += '-0';
    //     // console.log(item1)
    //     await LineModel.create(item1);

    //     const item2 = JSON.parse(JSON.stringify(line));
    //     item2['id'] += '-1';
    //     item2['stations'] = item2['stations'].reverse()

    //     console.log(item2)

    //     await LineModel.create(item2);
    // }

    for(let i in stations){
        const station = stations[i];
        await StationModel.create(station);
    }
    console.log('end')
    
});