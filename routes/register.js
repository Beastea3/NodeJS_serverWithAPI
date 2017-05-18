var User = require('../lib/user');

exports.form = function(req, res) {
	res.render('register',{title: 'Register'});
};
// register and save acount to Redis
exports.submit = function(req, res, next){
  var data = req.body.user;
  User.getByName(data.name, function(err, user){
    if (err) return next(err);

    if (user.name) {
      res.error("Username already taken!");
      res.redirect('/register');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });

 user.save(function(err){
        if (err) return next(err);
        req.session.uid = user.id;
        res.redirect('/');
      });
    }
  });
};
