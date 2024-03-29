
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

async function createNewPoint(track, pointData,res){
  const weather = await getWeather(pointData);

  const {date, latitude, longitude,  speed, position, accX, accY, accZ, gyrX, gyrY, gyrZ, road, daytime, tyre} = pointData;

  var point=new Point({
    date, latitude, longitude,  speed, position, accX, accY, accZ, gyrX, gyrY, gyrZ, road, daytime, tyre,
    track:track._id,
    weather:weather,
  });

  point.save(function (err, point) {
    if (err) return res.status(400).send("can't add new point "+err);
    console.log('point was saved');
    res.send(200);
  });

}

module.exports= function(req, res){
  Track.findOne({'_id': req.params.id},function(err,track){
    //console.log(track);
    createNewPoint(track,req.body.point,res);

  });

};
