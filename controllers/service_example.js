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

module.exports = {
    "analyzeEmotion": analyzeEmotion
}