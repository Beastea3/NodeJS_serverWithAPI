var Entry = require('../lib/timetrack');

exports.list = function(req, res, next){
  //var page = req.page;
  //Entry.getRange(page.from, page.to, function(err, entries) {
  //  if (err) return next(err);

    res.render('entries', {
      title: 'Entries',
      entries: entries,
    });
  };
  //);
};

exports.form = function(req, res){
  res.render('post', { title: 'Post' });
};

exports.submit = function(req, res, next){
  var data = req.body.entry;

  var entry = new Entry({
    "userid": res.locals.user.id,
    "date": data.date,
    "value": data.value
  });

  timetrack.add(function(err) {
    if (err) return next(err);
    if (req.remoteUser) {
      res.json({message: 'Entry added.'});
    } else {
      res.redirect('/');
    }
  });
};
