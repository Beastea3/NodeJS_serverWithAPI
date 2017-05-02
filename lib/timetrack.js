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
  exports.parseReceivedData(req, function(TEST) { 
    db.query(
      "INSERT INTO TEST (value, date, others) " + 
      " VALUES (?, ?, ?)",
      [TEST.value, TEST.date, TEST.others], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.delete = function(db, req, res) {
  exports.parseReceivedData(req, function(TEST) { 
    db.query(
      "DELETE FROM TEST WHERE id=?", 
      [TEST.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.archive = function(db, req, res) {
  exports.parseReceivedData(req, function(TEST) { 
    db.query(
      "UPDATE TEST SET archived=1 WHERE id=?", 
      [TEST.id], 
      function(err) {
        if (err) throw err;
        exports.show(db, res); 
      }
    );
  });
};

exports.show = function(db, res, showArchived) {
  var query = "SELECT * FROM TEST " + 
    "WHERE archived=? " +
    "ORDER BY date DESC";
  var archiveValue = (showArchived) ? 1 : 0;
  db.query(
    query,
    [archiveValue], 
    function(err, rows) {
      if (err) throw err;
      html = (showArchived)
        ? ''
        : '<a href="/archived">Archived TEST</a><br/>';
      html += exports.TESTHitlistHtml(rows); 
      html += exports.TESTFormHtml();
      exports.sendHtml(res, html); 
    }
  );
};

exports.showArchived = function(db, res) {
  exports.show(db, res, true); 
};

exports.TESTHitlistHtml = function(rows) {
  var html = '<table>';
  for(var i in rows) { 
    html += '<tr>';
    html += '<td>' + rows[i].date + '</td>';
    html += '<td>' + rows[i].value + '</td>';
    html += '<td>' + rows[i].others + '</td>';
    if (!rows[i].archived) { 
      html += '<td>' + exports.TESTArchiveForm(rows[i].id) + '</td>';
    }
    html += '<td>' + exports.TESTDeleteForm(rows[i].id) + '</td>';
    html += '</tr>';
  }
  html += '</table>';
  return html;
};

exports.TESTFormHtml = function() {
  var html = '<form method="POST" action="/">' + 
    '<p>Date (YYYY-MM-DD):<br/><input name="date" type="text"><p/>' +
    '<p>value:<br/><input name="value" type="text"><p/>' +
    '<p>others:<br/>' +
    '<textarea name="others"></textarea></p>' +
    '<input type="submit" value="Add" />' +
    '</form>';
  return html;
};

exports.TESTArchiveForm = function(id) { 
  return exports.actionForm(id, '/archive', 'Archive');
}

exports.TESTDeleteForm = function(id) { 
  return exports.actionForm(id, '/delete', 'Delete');
}
