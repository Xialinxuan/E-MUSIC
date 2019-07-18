const apiUrl = "https://myneteasecloudmusicapi.us-east.mybluemix.net/search?keywords="
const fetch = require('node-fetch');
const maxRequest = 10;

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
    callback(undefined, ret.result.songs[0])
}


module.exports = {
    "searchSong": searchSong
}