const controllers = require('../controllers');

function route(app) {
  app.all('/', function (req, res) {
    controllers.fetchLyricInJson(347230,function(err, lyricData){
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
