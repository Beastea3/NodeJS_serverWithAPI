var express = require('express');
var User = require('../lib/user');
var mysqlQuery=require("../lib/mysql.js");
var mysqlQueryTemp=require("../lib/mysqlTemp");
var qs = require('querystring');
var bodyParser = require('body-parser');
var range = 3600;
// functions for editing and searching the data saved in the server
// show data saved, 3600 values per page
exports.show = function(req, res) {
  var id = req.params.id
  var query =

      "SELECT No, value, value2, date_format(time, '%Y-%c-%d %T.%f') as time FROM ?? "
    + "ORDER BY time DESC "
    + "LIMIT ?";
  //var archiveValue = (showArchived) ? 1 : 0;
  mysqlQueryTemp(
    query,
    [id, range],
    function(err, results, fields) {
      if (err) throw err;
      /*html = (showArchived)
        ? ''
        : '<a href="/archived">Archived Work</a><br/>';*/
        var timeArray = new Array();
        var valueArray = new Array();
        for(var i = 0; i < results.length; i++){
        timeArray[i] =  results[i].time.toString() + "," + results[i].value;
        valueArray[i] = results[i].value;
        };
      res.render('userdata',{
        title:'userdata',
        results: results,
        id: id,
        times: timeArray,
        values: valueArray});
      //res.send(results);
    }
  );
};
/*exports.parseReceivedData = function(req, cb) {
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ body += chunk });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};*/
// add data page
exports.addForm = function(req, res) {
  //exports.parseReceivedData(req, function(HEARTRATE) {
    var id = req.params.id;
    res.render('add',{
    title:'Add data',
    id: id
  });
};
exports.add = function(req, res) {
  //exports.parseReceivedData(req, function(HEARTRATE) {
    var id = req.params.id;
    var data = req.body.data;
    mysqlQuery(
      "REPLACE INTO ?? (value, time, value2) " +
      " VALUES (?, ?, ?)",
      [id, data.value, data.time, data.value2],
      function(err) {
        if (err) throw err;
        exports.show(req, res);
      }
    );
  //}
  //);
};
//delete
exports.delete = function(req, res) {
  var data = req.body.data;
  var id = req.params.id;
  mysqlQueryTemp(
      "DELETE FROM ?? WHERE No=?",
      [id, data.No],
      function(err) {
        if (err) throw err;
        exports.show(req, res);
      }
  );
};
//search page 1
exports.searchForm = function(req,res) {
  var id = req.params.id;
  var data = req.body.data;
  var nextPage=2;
  var prePage=1;
  mysqlQuery(
    "SELECT No, value, value2, date_format(time, '%Y-%c-%d %T.%f') as time FROM ?? " +
    "ORDER BY No " +
    "LIMIT ? ",
    [id,range],
    function(err, results, fields) {
      if (err) throw err;
      var timeArray = new Array();
        for(var i = 0; i < results.length; i++){
        timeArray[i] =  results[i].time.toString() + "," + results[i].value + "," + results[i].value2;
        };
      res.render('search',{
        title:'search RESULT',
        results: results,
        id: id,
        nPage: nextPage,
        pPage: prePage,
        times: timeArray
        });
      //res.send(results);
    }
    );
};
//search page 2 - n
exports.search = function(req,res) {
  var id = req.params.id;
  var numOfPage = parseInt(req.params.nPage);
  var nextPage=numOfPage+1;
  var prePage=numOfPage-1;
  var startRecord=(numOfPage-1)*range;
  mysqlQuery(
    "SELECT No, value, value2, date_format(time, '%Y-%c-%d %T.%f') as time FROM ?? " +
    "ORDER BY No " +
    "LIMIT ?,? ",
    [id, startRecord,range],
    function(err, results, fields) {
      if (err) throw err;
      var timeArray = new Array();
        for(var i = 0; i < results.length; i++){
        timeArray[i] =  results[i].time.toString() + "," + results[i].value + "," + results[i].value2;
        };
      res.render('search',{
        title:'search RESULT',
        results: results,
        id:id,
        nPage: nextPage,
        times: timeArray,
        pPage: prePage
        });
      //res.send(results);
    }
    );
}
