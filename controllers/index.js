const lyrics = require('./lyrics');
const search = require('./search');
const service = require('./service');

module.exports = {
    "fetchLyricInJson": lyrics.fetchLyricInJson,
    "searchSong": search.searchSong,
    "lyricProcess": lyrics.lyricProcess,
    "analyzeEmotion": service.analyzeEmotion
};