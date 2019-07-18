const apiUrl = "https://myneteasecloudmusicapi.us-east.mybluemix.net/song/url?id="

const fetch = require('node-fetch');

async function mp3url(songId, callback){
    let ret = {};
    let flag = 0;
    for (let index = 0; index < 6; index++) {
        await fetch(apiUrl + songId ).then(res => res.json()).then(json => {
            detail = json;
            flag = 1;
        }).catch(err => {
            console.log(err);
        });
        if(flag) break;
    }

    callback(undefined, detail.data[0])
}

module.exports = {
    "mp3url": mp3url
}