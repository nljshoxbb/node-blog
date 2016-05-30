var config          = require('./config');
var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var fs              = require('fs');
var session         = require('express-session');
var mongoStore      = require('connect-mongo')(session);
var http            = require('http');
var mongoose        = require('mongoose');
var moment          = require('moment');
var app             = express();
var port            = config.port;
var dbUrl           = config.dbUrl;

// 连接数据库
mongoose.connect(dbUrl);

//模板引擎 
app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
app.set('views', path.join(__dirname, './app/views/'));

// use
app.use(logger('dev'));
// 对application/x-www-form-urlencoded格式内容进行解析
app.use(bodyParser.urlencoded({extended:true}));
// 对application/json格式进行解析
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');  // 引入moment模块并设置为app.locals属性,用来格式化时间


app.use(session({
  secret:config.session_secret,
  // 指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  resave: false,
  // 是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
  saveUninitialized: true,
  // 使用mongo对session进行持久化，将session存储进数据库中
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

var models_path = __dirname + '/app/models';            // 模型所在路径
// 路径加载函数，加载各模型的路径,所以可以直接通过mongoose.model加载各模型 这样即使模型路径改变也无需更改路径
// models loading
var walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);
      // 如果是文件
      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath);
        }
      // 如果是文件夹则继续遍历
      }else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
};
walk(models_path);



var env = process.env.NODE_ENV || 'development';

if ('development' === env) {
  // 在屏幕上讲信息打印出来
  app.set('showStackError',true);
  // 显示的信息
  app.use(logger(':method :url :status'));
  // 源码格式化，不要压缩
  app.locals.pretty = true;
  // mongoose.set('debug',true);
}

//开发环境下打印错误信息
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('common/error', {
      message: err.message,
      error: err
    });
  });
}

require('./routes/router')(app);                     // 路由控制

app.listen(port);                                   // 服务器监听端口

console.log('started on port:' + port);

module.exports = app;
