//модель Track
var mongoose = require('../index.js'),
Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var schema = new Schema({
user:[{ type: Schema.Types.ObjectId, ref: 'user' }]
});

exports.track = mongoose.model('track', schema);
//конец модели Track
