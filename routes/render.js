const controllers = require('../controllers');
//const models = require('../models');
const requiredRecentNum = 5;
let recentEmotionList = new Array();

function route(app) {
  app.all('/', (req, res) => {
      res.render('index');
  });

  app.all('/search', (req,res) => {
    let songName = encodeURI(req.query['search']);
    let songUrl = undefined;
    let songLyric = undefined;
    let songDetail;
    let code = 0;
    controllers.searchSong(songName,function(err,songResult){
      if(err) {
        console.log(err);
        res.status(400).end();
      } else{
        let songId=songResult.id;
        controllers.mp3url(songId,function(err,result){
          if(err){
            console.log(err);
            res.status(400).end();
          } else{
              songUrl = result.url;
          }
        });
        controllers.detailSong(songId, function (err, detail) {
          if(err){
              console.log(err);
          }
          else {
              songDetail = detail;
              controllers.fetchLyricInJson(songId,function(err, lyricData){
                if(err) {
                    console.log(err);
                    res.status(400).end();
                } else {
                    if(lyricData.nolyric){
                      code = 0;
                      res.send({songUrl: songUrl, songResult: songResult, detail: songDetail, code: code})
                    }
                    controllers.lyricProcess(lyricData.lrc.lyric, async function (err, lyricResult,lyricEmotion) {
                        if(err){
                            console.log(err);
                        }
                        else{
                            let lyric = '';
                            for(let index = 0; index < lyricResult.length; index++){
                              const element = lyricResult[index][1];
                              if(element.length) lyric += element;
                            }
                            controllers.analyzeEmotion(lyric, function(err, analysisResults){
                              if(err){
                                console.log(err)
                              }else{
                                if(recentEmotionList.length < 5){
                                  recentEmotionList.push(analysisResults.emotion.document.emotion);
                                }else{
                                  recentEmotionList.shift();
                                  recentEmotionList.push(analysisResults.emotion.document.emotion);
                                }
                                console.log(recentEmotionList);
                              }
                            })
                            code = 1;
                            songLyric = lyricResult;
                            res.send({songUrl: songUrl, songLyric: songLyric, songResult: songResult, detail: songDetail, code: code});
                        }
                    });
                }
            });
          }
        });
      }
    });
  })

  app.all('/emotion', (req,res) => {
    let songName = encodeURI(req.query['name']);
    controllers.searchSong(songName,function(err,songResult){
      if(err) {
        console.log(err);
        res.status(400).end();
      } else{
        let songId=songResult.id;
        controllers.fetchLyricInJson(songId,function(err, lyricData){
          if(err) {
              console.log(err);
              res.status(400).end();
          } else {
              if(lyricData.nolyric){
                res.send({code: 0});
              }else{
                controllers.lyricProcess(lyricData.lrc.lyric, async function (err, lyricResult,lyricEmotion) {
                  if(err){
                      console.log(err);
                  }
                  else{
                      let emotionResult = await controllers.analyzeEmotionBySession(lyricEmotion);
                      res.send({emotionResult: emotionResult, code: 1});
                  }
              });
              }
          }
      });
      }
    });
  })

  app.all('/recommend', (req,res) => {
    if(recentEmotionList.length > requiredRecentNum){
      res.send({code: 0});
    }else{
      let sadness=0, joy=0, fear=0, disgust=0, anger=0;
      for (let index = 0; index < requiredRecentNum; index++) {
        const element = recentEmotionList[index];
        sadness += element.sadness;
        joy += element.joy;
        fear += element.fear;
        disgust += element.disgust;
        anger += element.anger;
      }
      controllers.recommend([sadness/(requiredRecentNum * 1.0),joy/(requiredRecentNum * 1.0),fear/(requiredRecentNum * 1.0),disgust/(requiredRecentNum * 1.0),anger/(requiredRecentNum * 1.0)], function(err, idSet){
        if(err){
          console.log(err);
        }else{
          let idStr = '';
          for (let index = 0; index < idSet.length; index++) {
            const element = idSet[index];
            if(index == idSet.length - 1){
              idStr += element;
            }else{
              idStr = idStr + element + ',';
            }
          }
          controllers.detailSongs(idStr,function(err, result){
            if(err){
              console.log(err);
            }else{
              let recommedSongs = new Array();
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                recommedSongs.push([element.name, element.al.picUrl]);
              }
              res.send({recommedSongs: recommedSongs, code: 1});
            }
          });
        }
      });
    }
  });

}


module.exports = route;
