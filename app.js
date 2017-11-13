var express = require('express');
var path = require('path');
var mongoose = require('./db');
var session=require("express-session");
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());//form json
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 },store: require('mongoose-session')(mongoose)}));

app.post('/login', require('./public/login').post);

var user = require('./db/models/user').User;
app.use(function(req, res, next) {
  user.findOne({'_id':req.session.UserId},function (err, user) {
    res.locals.user = user;
    next(err);
  });
});

//app.use(require('./db/loadUser'));//добавление нового user
app.post('/track',require('./db/loadTrack'));//добавление нового track

var point = require('./db/models/gps-track').gps_track;
var track = require('./db/models/track').track;

app.get('/track', function(req, res) {
  track.find({user: res.locals.user._id}).limit(100).sort({'_id': -1}).exec(function(err, tracks){
    if (err)  throw err;
    res.send({tracks});
  });
});

app.get('/track/:track_id', function(req, res) {
  point.find({'track': req.params.track_id}).sort({ '_id': 1 }).exec(function(err, points){
    if (err)  throw err;
    res.send({points});
  });
});

app.get('/user', function(req, res){
  res.send(res.locals.user);
});





app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
