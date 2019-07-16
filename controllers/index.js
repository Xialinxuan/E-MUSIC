const lyrics = require('./lyrics');
const search = require('./search');

module.exports = {
    "fetchLyricInJson": lyrics.fetchLyricInJson,
    "searchSong": search.searchSong,
    "lyricProcess": lyrics.lyricProcess
};