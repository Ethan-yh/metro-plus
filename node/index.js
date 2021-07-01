const express = require('express')
const cors = require("cors")
const http = require("http")
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const mongo = require('./db/mongo')
const redis = require('./db/redis')
const mongoose = require('mongoose')


// 数据生成
const uploadTrainPos = require('./datagen/trainPosGen')
const passVolGen = require('./datagen/passVolGen');
const passEntryGen = require('./datagen/passEntryGen');




const app = express()
const port = 3000

const server = http.createServer(app)

mongo()
global.redis = redis()


const db = mongoose.connection;

db.once('open', () => {
  uploadTrainPos();
  passVolGen();
  passEntryGen();
})



var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
};
app.use(allowCrossDomain);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


// 处理跨域
// app.use(cors({
//   origin: ['http://localhost:8080'],//允许该域名下的请求
//   methods: ["GET", "POST"],　　　　　　//　　允许接受的 请求类型 
// //   alloweHeaders: ['Conten-Type', 'Authorization']　　//请求头
// }));






app.get('/', (req, res) => {
  res.send('Hello World!')
})

// routes
const getMetroDataRouter = require("./routes/getMetroData")
const getMetroPosRouter = require("./routes/metroPos")
const lineRouter = require("./routes/line")
const stationRouter = require("./routes/station")
const passVolRouter = require("./routes/passVol")
const passEntryRouter = require("./routes/passEntry")
const faultRouter = require("./routes/fault")
const editRouter = require("./routes/edit")
const pathRouter = require("./routes/path")

// 路由
app.use('/getMetroData', getMetroDataRouter)
app.use('/getMetroPos', getMetroPosRouter)
app.use('/line', lineRouter)
app.use('/station', stationRouter)
app.use('/passVol', passVolRouter)
app.use('/passEntry', passEntryRouter)
app.use('/fault', faultRouter)
app.use('/edit', editRouter)
app.use('/path', pathRouter)




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

