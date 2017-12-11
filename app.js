var express = require('express');
var path = require('path');
var mongoose = require('./db');
var session=require("express-session");
var app = express();


var bodyParser = require('body-parser');
app.use(bodyParser.json());//form json
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 },resave:true,saveUninitialized:false,store: require('mongoose-session')(mongoose)}));
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


// //Добавление списка треков этого пользователя
// app.get('/trackUser', function(req, res) {
//   track.find({user: res.locals.user._id}).limit(100).sort({'_id': -1}).exec(function(err, tracks){
//     if (err)  throw err;
//     res.send({tracks});
//   });
// });
//
// app.get('/trackUser/:track_id', function(req, res) {
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

async function getTracksUser(req,res) {
    const data = [];

    if(!res.locals.user){
      return res.status(403).send("user not auth ");
    }
    var users;
    var tracks;
    if(res.locals.user.name!="admin"){
      tracks=await track.find({user: res.locals.user._id}).limit(100).sort({ '_id': -1 }).exec();
    }else{
      users = await user.find({name: req.query.username}).sort({'_id': -1}).exec();//сначала находим по имени id юзера, потом его треки
      tracks=await track.find({user: users[0]._id}).limit(100).sort({ '_id': -1 }).exec();//если смотрит админ, то выбирает по имени
    }

    for (let tr of tracks) {
        var points=await point.find({'track': tr._id}).sort({ '_id': 1 }).exec();
        data.push(points);
    }

    //return data;
    res.send(data);
}

//треки текущего пользователя
app.get('/trackUser', function(req, res) {
    getTracksUser(req,res);
});

// app.get('/trackUser', function(req, res) {
//   if(res.locals.user.name!="admin"){
//     getTracksUser(req,res);//.then(data => res.send(data));
//   }else{
//     res.status(403).send("Этот запрос только для обычных пользователей");
//   }
// });

app.get('/user', function(req, res){
  if(!res.locals.user){
    return res.status(403).send("user not auth ");
  }

  res.send(res.locals.user);
});

//получение имен всех пользователей
app.get('/users', function(req, res){
  var names=[];
  user.find({}).sort({'_id': -1}).exec(function(err, users){
      if (err)  throw err;
      for(var i=0;i<users.length;i++){
        if(users[i].name!="admin"){
          names.push(users[i].name);
        }
      }
      res.send(names);
  });
});

var pointOfAllegedViolations = require('./db/models/pointsOfAllegedViolations').pointOfAllegedViolations;

app.post('/addNewPointOfAllegedViolations',function(req,res){
  if(!res.locals.user) throw "no user";
  var point=new pointOfAllegedViolations({
    latitude:req.body.latitude,
    longitude:req.body.latitude,
    changeX:req.body.changeX,
    changeY:req.body.changeY,
    changeZ:req.body.changeZ,
    userName:res.locals.user.name,
    date:req.body.date,
  });

  point.save(function (err, point) {
    if (err) {
      res.send("Такое имя пользователя уже существует!");
      return;
    }
    else
    {console.log('point was saved');
    res.send(200);}
  });

});


app.listen(3000, function(){
  console.log('Example app listening on port 3000!');
});
