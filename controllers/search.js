const apiUrl = "https://cloud-first-xlx.mybluemix.net/search?keywords="
const fetch = require('node-fetch');

async function searchSong(songName, callback){
    let ret = {};
    let flag = 0;
    for (let index = 0; index < 6; index++) {
        await fetch(apiUrl + songName + '&limit=1').then(res => res.json()).then(json => {
            ret = json;
            flag = 1;
        }).catch(err => {
            console.log(err);
        });
        if(flag) break;
    }
    callback(undefined, ret.result.songs[0])
}

module.exports = {
    "searchSong": searchSong
}