const createError = require('http-errors');
const express = require('express');
const http = require('http');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes_render = require('./routes/render');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

routes_render(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// app.enable('trust proxy');

// app.use (function (req, res, next) {
//   if (req.secure || process.env.BLUEMIX_REGION === undefined) {
//     next();
//   } else {
//     console.log('redirecting to https');
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// })

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// let db2;
// let hasConnect = false;
// if (process.env.VCAP_SERVICES) {
//   var env = JSON.parse(process.env.VCAP_SERVICES);
// if (env['dashDB']) {
//       hasConnect = true;
//   db2 = env['dashDB'][0].credentials;
// }
// }

// if ( hasConnect == false ) {
//  db2 = {
//       db: "BLUDB",
//       hostname: "xxxx",
//       port: 50000,
//       username: "xxx",
//       password: "xxx"
//    };
// }

//const connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;