const apiUrl = "https://myneteasecloudmusicapi.us-east.mybluemix.net/check/music?id="
const fetch = require('node-fetch');

async function check(songID, callback){
    let flag = 0;
    let ret = undefined;
    for (let index = 0; index < 6; index++) {
        await fetch(apiUrl + songID).then(res => res.json()).then(json => {
            ret = json;
            flag = 1;
        }).catch(err => {
            console.log(err);
        });
        if(flag) break;
    }
    callback(undefined, ret.success);
}

module.exports = {
    "check": check
}