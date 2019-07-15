const apiUrl = "https://api.imjad.cn/cloudmusic/?type=lyric&id="
const https = require('https');

function fetchLyricInJson(songID, callback){
    let strID = "" + songID;    //如果songID是数值必须这样处理
    https.get(apiUrl + strID, function(ret){
        let totalData = '';
        ret.setEncoding('utf8');
        ret.on('data',function(data){
            totalData += data;
        });
        ret.on('end', ()=>{
            try {
                if (ret.statusCode != 401 && ret.statusCode != 400 && totalData) {
                    totalData = JSON.parse(totalData);
                    callback(undefined, totalData);   //totalData.lrc.lyric就是字符串了
                }
            } catch(err) {
                callback(err);
            }
        });
    })
}

module.exports = {
    "fetchLyricInJson": fetchLyricInJson
}