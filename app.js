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
var user = require('./db/models/user').User;
app.post('/login', require('./public/login').post);
app.post('/addNewPerson',function(req,res){
  var us=new user({
    name:req.body.username,
    password: req.body.password,
    age:req.body.age,
    sex:req.body.sex,
    direction_of_work:req.body.direction_of_work
  });

  us.save(function (err, us) {
    if (err) {
      res.send("Такое имя пользователя уже существует!");
      return;
    }
    else
    {console.log('user was saved');
    res.send(200);}
  });

});


app.use(function(req, res, next) {
  user.findOne({'_id':req.session.UserId},function (err, user) {
    res.locals.user = user;
    next(err);
  });
});

//app.use(require('./db/loadUser'));//добавление нового user

var point = require('./db/models/gps-track').gps_track;
var track = require('./db/models/track').track;

app.post('/track',function(req,res){//добавление нового track
  if(!res.locals.user) throw "no user";
  console.log("new track");
  var tr=new track({
    user:res.locals.user._id
  });
  tr.save(function (err, tr) {
    if (err) return console.error(err);
    console.log('track was saved');
  });
  res.send({url: "/track/" + tr._id});
});

app.post('/track/:id',require('./db/loadTrack'));//добавление новой точки


//Добавление списка треков этого пользователя
// app.get('/track', function(req, res) {
//   track.find({user: res.locals.user._id}).limit(100).sort({'_id': -1}).exec(function(err, tracks){
//     if (err)  throw err;
//     res.send({tracks});
//   });
// });

// app.get('/track/:track_id', function(req, res) {
//   point.find({'track': req.params.track_id}).sort({ '_id': 1 }).exec(function(err, points){
//     if (err)  throw err;
//     res.send({points});
//   });
// });

async function getTrack() {
    const data = {};
    const users = await user.find({}).sort({'_id': -1}).exec();
    for (let us of users) {
      //console.log(us);
        var tracks=await track.find({'user': us._id}).limit(1).sort({ '_id': -1 }).exec();
        if(tracks.length){
            var tr=tracks[0];
            //console.log(tr._id);
            var points=await point.find({'track': tr._id}).sort({ '_id': 1 }).exec();
            //console.log(points);
            data[us.name] = points;
        }
    }
    return data;
}

//массив последних треков всех пользователей
app.get('/track', function(req, res) {
    getTrack().then(data => res.send(data));
});

app.get('/user', function(req, res){
  res.send(res.locals.user);
});





app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
