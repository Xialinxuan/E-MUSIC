const controllers = require('../controllers');
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  iam_apikey: 't_hMz8mWFrALaYQajbNjL-Qk2xKcB4hRrRplu8cADm40',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

function route(app) {
  app.all('/', function (req, res) {
      let songName = encodeURI("海阔天空")
      controllers.searchSong(songName,function(err,result){
        if(err) {
          console.log(err);
          res.status(400).end();
        } else{
          console.log(result.id);
          res.render('index');
        }
      });
      // controllers.fetchLyricInJson(1356795124,function(err, lyricData){
      //   if(err) {
      //     console.log(err);
      //     res.status(400).end();
      //   } else {
      //     console.log(lyricData);
      //     const analyzeParams = {
      //       'text': '',
      //       'features': {
      //         'emotion':{}
      //       }
      //     }
      //     naturalLanguageUnderstanding.analyze(analyzeParams)
      //     .then(analysisResults => {
      //       console.log(JSON.stringify(analysisResults, null, 2));
      //       res.render('index');
      //     })
      //     .catch(err => {
      //       console.log('error:', err);
      //       res.status(400).end();
      //     });
      //   }
      // });
  });

}


module.exports = route;
