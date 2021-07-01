// 导入redis包
const redis = require('redis');

module.exports = function () {

    // 建立连接
    const db = redis.createClient(6379, '127.0.0.1');
    // 使用on来监听状态
    db.on('connect', () => console.log('与redis成功建立连接'));
    db.on('ready', () => console.log('redis服务已经就绪'));
    db.on('error', err => console.error('redis服务产生了错误:', err));
    return db;
}