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
    callback(undefined, lyric);
}

function lyricProcess(lyric)
{
    var pattern = /\[\d{2}:\d{2}.\d+\]/g;
    var lyricInfo = lyric;
    var lines = lyricInfo.split("\n");
	lyricResult = new Array();
    lyricArtistMessage = new Array();
    
    var artistPattern = /\[\w+:/g;
    var testChinese = new RegExp("[\\u4E00-\\u9FFF]+","g");
    
	pattern.lastIndex  = 0;
	
	while(!pattern.test(lines[0])) {
		var lyricMessage = lines[0].replace(artistPattern, "").slice(0, -1);
		lyricMessage.length > 0 ? lyricArtistMessage.push(lyricMessage) : 0;
        lines = lines.splice(1);
        //console.log(lines);
    }

    lines[lines.length - 1].length == 0 && lines.pop()
    while(testChinese.test(lines[0]))
    {
        lines.shift();
    }
    for (let index = 0; index < lines.length; index++) {
        const element = lines[index];
        if(testChinese.test(element)) continue;
        else{
            var time = element.match(pattern);
            var lyricString = element.replace(pattern, "");
            time.forEach(function(value2, index2, array2) {
                //去掉前后的[]
                var t = value2.slice(1, -1).split(":");
                var seconds = parseInt(t[0]) * 60 + parseFloat(t[1]);         
                lyricResult.push([seconds, lyricString]);
            });
        }
    }
    //将结果按照时间排序
	lyricResult.sort(function(a, b) {
		return a[0] - b[0];
	});
    for(var i = 0 ;i<lyricResult.length; i++){
        console.log(lyricResult[i]);
    }

}


module.exports = {
    "fetchLyricInJson": fetchLyricInJson,
    "lyricProcess":lyricProcess
}