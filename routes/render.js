const controllers = require('../controllers');
//const models = require('../models');
const requiredRecentNum = 1;
let recentEmotionList = new Array();

function route(app) {
  app.all('/', (req, res) => {
      res.render('index');
  });

  app.all('/search', (req,res) => {
    let songName = encodeURI(req.query.search);
    if(songName == undefined || songName == ''){
      res.send({code: -4});
    }else{
      let songUrl = undefined;
      let songLyric = undefined;
      let songDetail;
      let code = 0;
      controllers.searchSong(songName,function(err,songResult){
        if(err) {
          console.log(err);
          res.status(400).end();
        } else{
          if(songResult[1] == 0){
            res.send({code: -5});
          }else{
            let songId=songResult[0].id;
          controllers.check(songId, function(err, flag){
            if(err){
              console.log(err);
            }else{
              if(flag){
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
                            if(lyricData.uncollected != undefined && lyricData.uncollected == true){
                              res.send({code: -3});   //网易云未收录
                            }else if(lyricData.nolyric){
                              code = 0;
                              res.send({songUrl: songUrl, songResult: songResult[0], detail: songDetail, code: code});
                            }else if(lyricData.tlyric.lyric == undefined){
                              res.send({code: -1});   //中文歌
                            }else{
                              controllers.lyricProcess(lyricData.lrc.lyric, async function (err, lyricResult,lyricEmotion) {
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    code = 1;
                                    songLyric = lyricResult;
                                    res.send({songUrl: songUrl, songLyric: songLyric, songResult: songResult[0], detail: songDetail, code: code});
                                }
                              });
                            }
                        }
                    });
                  }
                });
              }else{
                res.send({code: -2});   //无版权
              }
            }
          });
          }
        }
      });
    }
  })

  app.all('/emotion', (req,res) => {
    let songName = encodeURI(req.query.name);
    if(songName == undefined || songName == '') {
      res.send({code: -4});
    }else{
      controllers.searchSong(songName,function(err,songResult){
        if(err) {
          console.log(err);
          res.status(400).end();
        } else{
          if(songResult[1] == 0){
            res.send({code: -5});
          }else{
            let songId=songResult[0].id;
            controllers.fetchLyricInJson(songId,function(err, lyricData){
              if(err) {
                  console.log(err);
                  res.status(400).end();
              } else {
                  if(lyricData.uncollected != undefined && lyricData.uncollected == true){
                    res.send({code: -3});
                  }else if(lyricData.nolyric){
                    res.send({code: 0})
                  }else if(lyricData.tlyric.lyric == undefined){
                    res.send({code: -1});   //中文歌
                  }else{
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
                            if(recentEmotionList.length < requiredRecentNum){
                              recentEmotionList.push([songId, analysisResults.emotion.document.emotion]);
                            }else{
                              recentEmotionList.shift();
                              recentEmotionList.push([songId, analysisResults.emotion.document.emotion]);
                            }
                          }
                        });
                          let emotionResult = await controllers.analyzeEmotionBySession(lyricEmotion);
                          let emotion = [0, 0, 0, 0, 0];
                          for (let index = 0; index < emotionResult.length; index++) {
                            const element = emotionResult[index][1];
                            emotion[0] += element[0];
                            emotion[1] += element[1];
                            emotion[2] += element[2];
                            emotion[3] += element[3];
                            emotion[4] += element[4];
                          }
                          let max = 0;
                          let overallEmotion = '';
                          for (let index = 0; index < emotion.length; index++) {
                            const element = emotion[index];
                            if(element > emotion[max]) max = index;
                          }
                          switch(max){
                            case 0:
                              overallEmotion = "sadness";
                              break;
                            case 1:
                              overallEmotion = "joy";
                              break;
                            case 2:
                              overallEmotion = "fear";
                              break;
                            case 3:
                              overallEmotion = "disgust";
                              break;
                            case 3:
                              overallEmotion = "anger";
                              break;
                          }
                          res.send({emotionResult: emotionResult, code: 1, overallEmotion: overallEmotion});
                      }
                  });
                  }
              }
          });
          }
        }
      });
    }
  })

  app.all('/recommend', (req,res) => {
    if(recentEmotionList.length < requiredRecentNum){
      res.send({code: 0});
    }else{
      let sadness=0, joy=0, fear=0, disgust=0, anger=0;
      for (let index = 0; index < requiredRecentNum; index++) {
        const element = recentEmotionList[index];
        sadness += element[1].sadness;
        joy += element[1].joy;
        fear += element[1].fear;
        disgust += element[1].disgust;
        anger += element[1].anger;
      }
      controllers.recommend([sadness/(requiredRecentNum * 1.0),joy/(requiredRecentNum * 1.0),fear/(requiredRecentNum * 1.0),disgust/(requiredRecentNum * 1.0),anger/(requiredRecentNum * 1.0)], function(err, idSet){
        if(err){
          console.log(err);
        }else{
          let idStr = '';
          let count = 0;
          for (let index = 0; index < idSet.length && count < 6; index++) {
            const element = idSet[index];
            let flag = 0;
            for(let i = 0;i < requiredRecentNum; i++){
              if(element == recentEmotionList[i][0]) {
                flag = 1;
                break;
              }
            }
            if(flag) continue;
            if(count == 5){
              idStr += element;
            }else{
              idStr = idStr + element + ',';
            }
            count++;
          }
          controllers.detailSongs(idStr,function(err, result){
            if(err){
              console.log(err);
            }else{
              let recommendSongs = new Array();
              for (let index = 0; index < result.length; index++) {
                const element = result[index];
                recommendSongs.push([element.name, element.al.picUrl]);
              }
              res.send({recommendSongs: recommendSongs, code: 1});
            }
          });
        }
      });
    }
  });

}

module.exports = route;