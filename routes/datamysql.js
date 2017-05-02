var http = require('http');
var Entry = require('../lib/entry');
var mysql = require('mysql');
var mysqlQuery=require("../lib/mysql.js");
//var db = require('../lib/entry');

var client = mysql.createConnection({
  host:     '127.0.0.1',
  user:     'root',
  password: '12345678',
  database: 'timetrack'
});

/*  console.log('test for route to datamysql');
  switch (req.method) {
    case 'POST': 
      console.log('casePOST');
      switch(req.url) {
        case '/datamysql':
          console.log('case POST /');
          Entry.add(db, req, res);
          break;
        case '/datamysql/archive':
          console.log('case Post /datamysql/archive');
          Entry.archive(db, req, res);

          break;
        case '/datamysql/delete':
          console.log('case /');
          Entry.delete(db, req, res);
          break;
        default:
          console.log('llllll');
      }
      break;
    case 'GET': 
      console.log('case get');
      console.log(req.url);
      switch(req.url) {

        case '/datamysql':
          console.log('case get /');
          Entry.show(db, res);
          break;
        case '/datamysql/archived':
          console.log('case /archived');
          Entry.showArchived(db, res);
        default:
          console.log('whhhat');
      }
      break;
      default:
        console.log('unknown request');
  }
};

client.query(
  "CREATE TABLE IF NOT EXISTS HEARTRATE (" 
  + "No INT(10) NOT NULL AUTO_INCREMENT,"
  + "id INT(10) NOT NULL, " 
  + "heartRate INT(3) DEFAULT 0, " 
  + "time DATETIME, " 
  + "PRIMARY KEY(No))",
  function(err) { 
    if (err) throw err;
    //console.log('Server started...');
    //server.listen(3000, '127.0.0.1'); 
  }
);
*/
var qs = require('querystring');

exports.sendHtml = function(res, html) { 
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Content-Length', Buffer.byteLength(html));
  res.end(html);
}

exports.parseReceivedData = function(req, cb) { 
  var body = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk){ body += chunk });
  req.on('end', function() {
    var data = qs.parse(body);
    cb(data);
  });
};

exports.actionForm = function(id, path, label) { 
  var html = '<form method="POST" action="' + path + '">' +
    '<input type="hidden" name="id" value="' + id + '">' +
    '<input type="submit" value="' + label + '" />' +
    '</form>';
  return html;
};

exports.add = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    mysqlQuery(
      "INSERT INTO work (hours, date, description) " + 
      " VALUES (?, ?, ?)",
      [work.hours, work.date, work.description], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    mysqlQuery(
      "DELETE FROM work WHERE id=?", 
      [work.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.archive = function(db, req, res) {
  exports.parseReceivedData(req, function(work) { 
    mysqlQuery(
      "UPDATE work SET archived=1 WHERE id=?", 
      [work.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.show = function(db, res, showArchived) {
  var query = "SELECT * FROM work " + 
    "WHERE archived=? " +
    "ORDER BY date DESC";
  var archiveValue = (showArchived) ? 1 : 0;
  mysqlQuery(
    query,
    [archiveValue], 
    function(err, rows) {
      if (err) throw err;
      html = (showArchived)
        ? ''
        : '<a href="/archived">Archived Work</a><br/>';
      html += exports.workHitlistHtml(rows); 
      html += exports.workFormHtml();
      exports.sendHtml(res, html); 
    }
  );
};

exports.showArchived = function(db, res) {
  exports.show(db, res, true); 
};

exports.workHitlistHtml = function(rows) {
  var html = '<table>';
  for(var i in rows) { 
    html += '<tr>';
    html += '<td>' + rows[i].date + '</td>';
    html += '<td>' + rows[i].hours + '</td>';
    html += '<td>' + rows[i].description + '</td>';
    if (!rows[i].archived) { 
      html += '<td>' + exports.workArchiveForm(rows[i].id) + '</td>';
    }
    html += '<td>' + exports.workDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.workFormHtml = function() {
  var html = '<form method="POST" action="/">' + 
    '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
    '<p>Hours worked:<br/><input name="hours" type="text"><p/>' +
    '<p>Description:<br/>' +
    '<textarea name="description"></textarea></p>' +
    '<input type="submit" value="Add" />' +
    '</form>';
  return html;
};

exports.workArchiveForm = function(id) { 
  return exports.actionForm(id, '/archive', 'Archive');
}

exports.workDeleteForm = function(id) { 
  return exports.actionForm(id, '/delete', 'Delete');
}
