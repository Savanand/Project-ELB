var mongo = require('mongodb'),
  Server = mongo.Server,
  Db = mongo.Db;
var server = new Server('ds043200.mongolab.com', 43200, {auto_reconnect: true});
var db = new Db('cmpe273', server);
var http = require('http');

http.createServer(function (request, response) {
  db.collection('project', function(err, collection) {
    collection.find({}, function(err, cursor){
      cursor.each(function(err, item) {
        if (item) {
          response.write(JSON.stringify(item));
        } else {
          response.end();
        }
      });
    });
  });
}).listen(9000);

console.log('Server running at localhost:8008');
