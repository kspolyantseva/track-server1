var User = require('./models/user').User;

module.exports=function(req, res, next){
    var user=new User({
      name:"Tom",
      age:44,
      sex:"male",
      direction_of_work:'engineer',
      password:""
    });
    user.save(function (err, user) {
      if (err) return console.error(err);
      console.log('user was saved');
    });
  //  next();

};
