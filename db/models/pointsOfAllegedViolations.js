//модель точки предполагаемых нарушений(точка по по показателям акселерометра резко отличается от предыдущих)
var mongoose = require('../index.js'),
Schema = mongoose.Schema;


mongoose.Promise = global.Promise;
var schema = new Schema({
  latitude:Number,
  longitude:Number,
  changeX:Number,
  changeY:Number,
  changeZ:Number,
  userName:String,
  //user:[{ type: Schema.Types.ObjectId, ref: 'user' }]
  date:Date,
});


exports.pointOfAllegedViolations = mongoose.model('pointOfAllegedViolations', schema);
