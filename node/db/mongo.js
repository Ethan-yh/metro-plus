const mongoose = require("mongoose");

const databaseUrl = "mongodb://localhost:27017/metro";

module.exports = () => {
    //连接数据库，后面3个参数要是不加会waring
    mongoose.connect(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    },()=>{
        console.log('mongodb connected')
    });
}