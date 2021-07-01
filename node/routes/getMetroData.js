const express = require('express')
const router = express.Router()
const fs = require('fs')

router.get('/', async (req, res) => {
    
    global.redis.get('metro_data', (err, value)=>{
        if(err||!value){
            console.log('redis err:', err);
            const metro_data = require('../data/metro_data.json');
            global.redis.set('metro_data', JSON.stringify(metro_data), (err)=>{
                if(err){
                    console.log('redis存储失败');
                }
                console.log('redis存储成功');
            })
            return res.send({
                status: 0,
                data: metro_data
            })
        }
        console.log('缓存命中')
        return res.send({
            status: 0,
            data: JSON.parse(value)
        })
    })
    
    
})

module.exports = router