const controllers = require('../controllers');

function route(app) {
  app.all('/', function (req, res) {
      // let songName = encodeURI("海阔天空")
      // controllers.searchSong(songName,function(err,result){
      //   if(err) {
      //     console.log(err);
      //     res.status(400).end();
      //   } else{
      //     console.log(result.id);
      //     res.render('index');
      //   }
      // });
    controllers.fetchLyricInJson(1375986963,function(err, lyricData){
      if(err) {
        console.log(err);
        res.status(400).end();
      } else {
        console.log(lyricData);
        res.render('index');
      }
    });
  });

}


module.exports = route;
