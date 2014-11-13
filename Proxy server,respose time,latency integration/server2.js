var http= require('http');
var finalhandler=require('finalhandler');
var url= require('url');
var express= require('express');
var httpProxy = require('http-proxy');
var cuid=require('cuid');
var app=express();
var responseTime= require('response-time');
var connect=require('connect');
var timeout = require('connect-timeout');
var addresses = [
  {
    host: 'localhost',
    port: 8006
  }
];
var addresse = [
  {
    host: 'localhost',
    port: 8007
  }
];

var _responseTime=responseTime();

// connection to mongo lab
var databaseUrl="nishantjha:Nisan1,.,@ds043200.mongolab.com:43200/cmpe273";
var collections=["project"]
var db=require("mongojs").connect(databaseUrl, collections);
var items=[];

//creating http proxy
var httpProxy=require('http-proxy');
var proxy = httpProxy.createProxyServer();









//creating target server
var server= http.createServer(function(req, res){
 
switch(req.method){

	case 'POST':
  
  		var item='';
		req.setEncoding('utf8'); 
		req.on('data',function(chunk){item+=chunk;});
		
                req.on('end', function(chunk){
                var myObject = JSON.parse(item);
                db.project.save(myObject, function(err,records) {
                if (err) throw err;
                console.log("record added");
			
		});
                //response time

                 var done=finalhandler(req,res)
                 _responseTime(req,res,function(err){if (err) return done(err) 
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('OK\n'+'Payload processed='+item)});
});
		break;
	

	
	case 'GET':
		
		res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
                var body= db.project.find(function(err, docs) {console.log("Found records");
                console.dir(docs);
                str='{';
                docs.forEach(function(doc){
                str = str+"name:"+doc.name+","+"email:"+doc.email+",";
         });
                str=str + '}';
                 //response time

                 var done=finalhandler(req,res)
                 _responseTime(req,res,function(err){if (err) return done(err) 
                res.writeHead(200, {'Content-Type': 'text/plain'});
                 res.end(JSON.stringify(docs));})
                   });   
		break;
}// end switch

});

//latency
http.createServer(function (req, res) {
  // This simulate an operation that take 5000ms in execute
  setTimeout(function () {
    proxy.web(req, res, {
      target: 'http://localhost:9000'
    });
  }, 2000);
if (res._responseTime) return next();
    res._responseTime = true;
}).listen(8000);
	

app.post('/', function(req,res){
var item='';
		req.setEncoding('utf8'); 
		req.on('data',function(chunk){item+=chunk;});
		req.on('end', function(chunk){
                var myObject = JSON.parse(item);
                db.project.save(myObject, function(err,records) {
                if (err) throw err;
                console.log("record added");
		});
                res.send('OK\n'+'Payload processed='+item);
});});

app.get('/', function(req, res) 
{
                // res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
                var body= db.project.find(function(err, docs) 
                {console.log("Found records");
                console.dir(docs);
                str='{';
                docs.forEach(function(doc)
                {
                str = str+"name:"+doc.name+","+"email:"+doc.email+",";
                 });
                str=str + '}';
                //res.writeHead(200, {'Content-Type': 'text/plain'});
                 res.send(JSON.stringify(docs));
                   });  
});    

//request-id
var requestId = function requestId(req, res, next) {
  req.requestId = cuid.slug();
  next();
};
app.use(requestId);

server.listen(9000);

app.listen(7000);

