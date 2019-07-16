const apiUrl = "https://cloud-first-xlx.mybluemix.net/lyric?id="
const https = require('https');
const fetch = require('node-fetch');

async function fetchLyricInJson(songID, callback){
    let strID = '' + songID;    //如果songID是数值必须这样处理
    let lyric = {};
    let flag = 0;
    for (let index = 0; index < 6; index++) {
        await fetch(apiUrl + strID).then(res => res.json()).then(json => {
            lyric = json;
            flag = 1;
        }).catch(err => {
            console.log(err);
        });
        if(flag) break;
    }
    callback(undefined, lyric.lrc.lyric);
}


module.exports = {
    "fetchLyricInJson": fetchLyricInJson
}