
var Point = require('./models/gps-track').gps_track;
var Track = require('./models/track').track;
//var request = require('request');
const request = require('request-promise-native');

var latitude=55.80279228;
var longitude=37.52910901;
var latlngs = [
    [55.80267072, 37.52918379],
    [55.80279228, 37.52910901],
    [55.80278809, 37.52906343],
    [55.80294595, 37.52850485],
];

function getWeather(args) {
  return request({url:'http://api.openweathermap.org/data/2.5/weather?lat='+args.latitude+'&lon='+args.longitude+'&APPID=ca0c8249795faca7cd13a6f64e2bccd2',json:true});
}

async function createNewPoint(track, pointData){
  const weather = await getWeather(pointData);

  const {latitude, longitude, date, speed} = pointData;

  var point=new Point({
    latitude, longitude, date, speed,
    track:track._id,
    weather:weather,
  });

  point.save(function (err, point) {
    if (err) return console.error(err);
    console.log('point was saved');
  });

}

module.exports= function(req, res){
  Track.findOne({'_id': req.params.id},function(err,track){
    //console.log(track);
    createNewPoint(track,req.body.point);
    res.send(200);
  });

};
