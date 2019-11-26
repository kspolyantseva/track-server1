var mongoose = require('mongoose');
mongoose.connect('mongodb://lanaDB:Diploma18@ds249355.mlab.com:49355/app_bd',{ useMongoClient: true, autoReconnect:true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connected');
});
db.on('reconnected', function () {
console.log('MongoDB reconnected!');
});
db.on('disconnected', function() {
console.log('MongoDB disconnected!');
mongoose.connect('mongodb://lanaDB:Diploma18@ds249355.mlab.com:49355/app_bd', {useMongoClient: true, autoReconnect:true});
});

module.exports=mongoose;
