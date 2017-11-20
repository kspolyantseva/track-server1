var mongoose = require('../index.js'),
Schema = mongoose.Schema;
var crypto = require('crypto');
mongoose.Promise = global.Promise;
var schema = new Schema({
  name:String,
  hashedPassword: String,
  salt:String,
  age:Number,
  sex:String,
  direction_of_work:String,
  photos_from_accidents:Array
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password,callback){
  var user=this;
  user.findOne({'name':username},function (err, user) {
    console.log(user,err,"in function");
    if (err) return handleError(err);
    console.log("next1");
    if (!user) return callback("user not found");
    console.log("next2");
    if (user.checkPassword(password)) {
      console.log("next3");
      callback(null, user);
    }else{
    callback("password is not correct");}
    //res.send(user);
  });
};

exports.User = mongoose.model('User', schema);
