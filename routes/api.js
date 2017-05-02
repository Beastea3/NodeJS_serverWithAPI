var express = require('express');
var User = require('../lib/user');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var mysqlQuery=require("../lib/mysql.js");
var mysqlQueryTemp=require("../lib/mysqlTemp");
exports.register = function(req, res, next){
  var data = req.body.user;
  User.getByName(data.name, function(err, user){
    if (err) return next(err);

    if (user.name) {
      res.send("Username already taken");
      //res.redirect('/register');
    } else {
      user = new User({
        name: data.name,
        pass: data.pass
      });

 user.save(function(err){
        if (err) return next(err);
        req.session.uid = user.id;
        res.send("Register Successful");
      });
    }
  });
};

exports.login = function(req, res, next){
  var name = req.body.name;
  var pass = req.body.pass;
  User.authenticate(name, pass, function(err, user){
    if (err) return next(err);
    if (user) {
      var id = user.id;
      req.session.uid = user.id;
      mysqlQuery(
      "CREATE TABLE IF NOT EXISTS ?? ("
    + "No INT(10) NOT NULL AUTO_INCREMENT,"
    + "value FLOAT(7,3) DEFAULT 0, "
    + "time DATETIME, "
    + "value2 FLOAT(7,3) DEFAULT 0,"
    + "PRIMARY KEY(No),"
    + "UNIQUE KEY(time))",
    [id],
    function(err, results, fields) {
      if (err) throw err;
    });
      mysqlQueryTemp(
        "CREATE TABLE IF NOT EXISTS ?? ("
    + "No INT(10) NOT NULL AUTO_INCREMENT,"
    + "value INT(3) DEFAULT 0, "
    + "time DATETIME, "
    + "value2 INT(3) DEFAULT 0,"
    + "PRIMARY KEY(No),"
    + "UNIQUE KEY(time))",
    [id],
    function(err, results, fields) {
      if (err) throw err;
      res.send(name);
    });
   } else {
      res.send("Sorry! invalid credentials.");
    }
  });
};

exports.user = function(req, res, next){
  User.getByName(req.params.name, function(err, user){
    if (err) return next(err);
    if (!user.name) return res.send(404);

    mysqlQuery(
    "SELECT * FROM ?? " +
    "ORDER BY time DESC " +
    "LIMIT 10",
    [user.id],
     function selectCb(err, results, fields) {
       if(results)
      {
            res.json(results);
      }
    //client.end();
    //console.log('Server started...');
    //server.listen(3000, '127.0.0.1');
  });
   // console.log(value);
    });
  };

exports.entries = function(req, res, next){
  User.getByName(req.params.name, function(err, user){
    if (err) return next(err);
    if (!user.name) return res.send(404);
    console.log(req.body.data[1]);
    for (var i in req.body.data){
      mysqlQuery(
     "REPLACE INTO ?? ( value, time, value2) "
    + "VALUES (?, ?,?)",
    [user.id, req.body.data[i].value, req.body.data[i].time, req.body.data[i].value2],
     function uploadSuc(err, results, fields) {
       if (err) throw err;
  });
   // console.log(value);
    res.send("Complete");
    };
    });

};
exports.entriesTemp = function(req, res, next){
  User.getByName(req.params.name, function(err, user){
    if (err) return next(err);
    if (!user.name) return res.send(404);

    var exec = require('child_process').exec;
    var value2;
    filename = '/root/demo/lib/test_python.py'

    exec('python' + ' ' + filename + ' ' + req.body.value, function(err, stdout, stderr) {

        if (err) {
            res.send(stderr);
        }
        if (stdout) {
            value2 = parseInt(stdout);

        }
        mysqlQueryTemp(
            "REPLACE INTO ?? ( value, time, value2) " +
            "VALUES ( ?, ?,?)", [user.id, req.body.value, req.body.time, value2],
            function uploadSuc(err, results, fields) {
                if (results) {
                    res.send("Abnormal data detected!");
                } else {
                    //console.log(req.body.heartRate);
                    res.send("Uploading Error!");
                }
                //client.end();
                //console.log('Server started...');
                //server.listen(3000, '127.0.0.1');
            });
    });

    });
};
exports.search = function(req,res) {
   User.getByName(req.params.name, function(err, user){
    if (err) return next(err);
    if (!user.name) return res.send(404);
    var data = req.body.data;
    mysqlQuery(
    "SELECT * FROM ?? " +
    "WHERE time BETWEEN ? AND ?" +
    "ORDER BY time DESC",
    [user.id, data.time1, data.time2],
    function(err, results, fields) {
      if (err) throw err;
      res.json(results);
    });
 });
}
/*exports.test = exports.entries = function(req, res, next){
	if(req.body.heartRate){
		res.send(req.body.heartRate);
	}else{
		res.send("NObody!");
	}
}*/
