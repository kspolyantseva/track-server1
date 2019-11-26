var mongoose = require('../index.js'),
Schema = mongoose.Schema;


mongoose.Promise = global.Promise;
var schema = new Schema({
  userNum:String,
  date:Date,
  latitude:Number,
  longitude:Number,
  track:[{ type: Schema.Types.ObjectId, ref: 'track' }],
  speed:Number,
  weather:Schema.Types.Mixed,
  position:Number,
  accX:Number,
  accY:Number,
  accZ:Number,
  gyrX:Number,
  gyrY:Number,
  gyrZ:Number,
  road:Number,
  daytime:Number,
  tyre:Number
});


exports.gps_track = mongoose.model('point', schema);
