var express = require('express');
var app = express();
var router = express.Router();

app.set('view engine', 'pug');

router.get('/', function (req, res) {
  res.render(
     'index',
     { title: 'سامانه پردازش گزارشات مدیریت، شرکت پتروشیمی بولعی سینا', message: 'در حال طراحی https://github.com/DANA-Laboratory/PIReporter'});
});

app.use(express.static('static'));
app.use(router);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
