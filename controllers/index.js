const lyrics = require('./lyrics');
const search = require('./search');
const service = require('./service');
const detail = require('./detail');
const mp3url = require('./mp3url');
const check = require('./check');

module.exports = {
    "fetchLyricInJson": lyrics.fetchLyricInJson,
    "searchSong": search.searchSong,
    "lyricProcess": lyrics.lyricProcess,
    "analyzeEmotion": service.analyzeEmotion,
    "build": service.build,
    "detailSong": detail.detailSong,
    "mp3url": mp3url.mp3url,
    "recommend": service.recommend,
    "detailSongs": detail.detailSongs,
    "analyzeEmotionBySession": service.analyzeEmotionBySession,
    "check": check.check
};