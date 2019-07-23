const apiUrl = "https://ye-host.mybluemix.net/search?keywords="
const fetch = require('node-fetch');
const maxRequest = 30;

async function searchSong(songName, callback){
    let ret = {};
    let flag = 0;
    for (let index = 0; index < maxRequest; index++) {
        await fetch(apiUrl + songName + '&limit=1').then(res => res.json()).then(json => {
            ret = json;
            flag = 1;
        }).catch(err => {
            console.log(err);
        });
        if(flag) break;
    }
    if(ret.result.songCount == undefined){
        callback(undefined, [0, 0]);
    }else if(ret.result.songCount != 0){
        callback(undefined, [ret.result.songs[0], ret.result.songCount]);
    }else{
        callback(undefined, [0, ret.result.songCount]);
    }
}


module.exports = {
    "searchSong": searchSong
}