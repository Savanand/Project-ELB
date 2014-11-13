var express = require('express')
var bodyParser = require('body-parser')
var errorhandler = require('errorhandler')
var responseTime = require('response-time')

var app = express()
app.use(function(req, res, next) { req.start = Date.now(); next(); });

app.use(responseTime())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

function UserInfo () {
	this.name = '';
	this.email = '';
}
//var duration;
//var start;


app.use(function (req, res) {

  //start = Date.now();
  if (res._responseTime) return next();
    res._responseTime = true;
duration = Date.now() - req.start;
        // log duration
console.log('res time='+duration+' ms');

  res.setHeader('Content-Type', 'text/plain')
res.setHeader('X-Response-Time', duration);

  res.write('you posted:\n')
  if (!req.body) return res.sendStatus(400)
  var user1= new UserInfo();
  user1.name= req.body.name;
  user1.email=req.body.email;

	
//  res.end(JSON.stringify(req.body, null, 2))

 res.end(JSON.stringify(user1, null, 2))

})


app.listen(3000);