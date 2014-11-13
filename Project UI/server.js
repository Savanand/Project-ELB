
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })


var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
 
var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } };       
 
var mongodbUri = 'mongodb://project1User:project123@ds051160.mongolab.com:51160/project1';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

 // Create song schema

 var servSchema = mongoose.Schema({
    url: String,
    port: Number,
    latency: Number,
    gzipper: String,
    restime: Number,
    unireqid: String
  });

app.post('/myaction',urlencodedParser, function(req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
	console.log(req.body);
  res.write('You sent the URL "' + req.body.url + '".');
  res.write('You sent the Port "' + req.body.port + '".');
  res.write('You sent the Latency "' + req.body.latency + '".');
  res.write('You sent the Gzipper"' + req.body.gzipper + '".');
  res.write('You sent the restime "' + req.body.restime + '".');
  res.write('You sent the unireqid "' + req.body.unireqid + '".');


 // Store serv documents in a collection called "songs"
  var Serv = mongoose.model('server209', servSchema);

var serv1 = new Serv({
    url: req.body.url,
    port: req.body.port,
    latency: req.body.latency,
    gzipper: req.body.gzipper,
	restime: req.body.restime,
	unireqid: req.body.unireqid
  });
 
  serv1.save(function(err) {
		console.log('inside save');
			if (err)
				res.end(err);
		res.end('serv created!');
	});

 res.end();
	

});

app.listen(8080, function() {
  console.log('Server running at http://localhost:8080/');
});