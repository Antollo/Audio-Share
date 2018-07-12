var express = require('express');
var sslRedirect = require('heroku-ssl-redirect');
var app = express();
app.use(sslRedirect);
var http = require('http').Server(app);

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

http.listen(process.env.PORT || 3000, function(){});