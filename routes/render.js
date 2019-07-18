const controllers = require('../controllers');
const models = require('../models');
const requiredRecentNum = 5;
let recentEmotionList = new Array();

function route(app) {
  app.all('/', (req, res) => {
      res.render('index');

  });

  app.post('/search', (req,res) => {
    
  })

  app.all('/recommend', (req,res) => {
    if(recentEmotionList.length > requiredRecentNum){
      res.send({code:-1});
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
              res.send(recommedSongs);
            }
          });
        }
      });
    }
  });

}


module.exports = route;
