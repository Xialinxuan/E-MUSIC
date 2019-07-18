const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');

const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
  version: '2019-07-12',
  iam_apikey: 'Your IBM cloud Natural Language Understanding API key',
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api'
});

function analyzeEmotion(text, callback){
    const analyzeParams = {
              'text': text,
              'features': {
                'emotion':{}
              }
            }
    naturalLanguageUnderstanding.analyze(analyzeParams)
    .then(analysisResults => {
        console.log(JSON.stringify(analysisResults, null, 2));
        callback(undefined, analysisResults);
    })
    .catch(err => {
        callback(err,undefined);
    });
}

function build(){
  models.selectforbuild(function(err,result){
    if(err){
      console.log(err);
    }else{
      let data;
      let dataSet = new Array();
      while(data = result.fetchSync()){
        dataSet.push(data.id);
      }
      for (let index = 0; index < dataSet.length; index++) {
        const id = dataSet[index];
        lyrics.fetchLyricInJson(id,function(err, lyricData, ID){
          if(err){
            console.log(err);
          }else{
            if(lyricData && lyricData.lrc && lyricData.lrc.lyric){
              lyrics.lyricProcess(lyricData.lrc.lyric,function(err, lyricResult){
                let lyric;
                if(err){
                  console.log(err);
                }else{
                  for (let index = 0; index < lyricResult.length; index++) {
                    const element = lyricResult[index][1];
                    if(element.length) lyric += element;
                  }
                  analyzeEmotion(lyric,function(err,analysisResults){
                    if(err){
                      console.log(err);
                      console.log("The song id is " + ID)
                    }else{
                      let params = new Array();
                      params.push(ID);
                      params.push(analysisResults.emotion.document.emotion.sadness);
                      params.push(analysisResults.emotion.document.emotion.joy);
                      params.push(analysisResults.emotion.document.emotion.fear);
                      params.push(analysisResults.emotion.document.emotion.disgust);
                      params.push(analysisResults.emotion.document.emotion.anger);
                      models.insert(params);
                    }
                  })
                }
              });
            }else{
              console.log("Cannot find the lyric of This song " + ID);
            }
          }
        });
      }
    }
  });
}

module.exports = {
  "analyzeEmotion": analyzeEmotion,
  "build": build
}