var http= require('http');
var url= require('url');
var items=[];
var server= http.createServer(function(req, res){

	switch(req.method){

	case 'POST':
		var item='';
		req.setEncoding('utf8');
		req.on('data',function(chunk){

			item+=chunk;
		});
		req.on('end', function(chunk){

			items.push(item);

			res.end('OK\n'+'Payload processed='+items);
		});
		break;
	

	
	case 'GET':
		
		var body=items.map(function(item,i){
			return i+')'+item ;	

		}).join('\n');
			
		res.setHeader('Content-Length', Buffer.byteLength(body));
		res.setHeader('Content-Type', 'text/plain; charset="utf-8"');
			
		res.end(body);
//		res.end('Processed GET request complete');	
			
		break;

	case 'DELETE':

		var parseURL=url.parse(req.url);
		//console.log(parseURL);
		var path= parseURL.pathname;
		//console.log(path);
		
		
		var i= parseInt(path.slice(1), 10);

		if(isNaN(i)){
			res.statusCode= 400;
			res.end('Invalid Item id');
		}
		else if(!items[i]){

			res.statusCode=404;
			res.end('item not found');
		}
		else{
			items.splice(i,1);
			res.end('OK \n');

		}

	case 'PUT':
		
		// update by there index

		var parseURL=url.parse(req.url);
		//console.log(parseURL);
		var path= parseURL.pathname;
		//console.log(path);

		var i= parseInt(path.slice(1), 10);

		if(isNaN(i)){
			res.statusCode= 400;
			res.end('Invalid Item id');
		}
		else if(!items[i]){

			res.statusCode=404;
			res.end('item not found');
		}
		else{
			//var index = items.indexOf(3452);

/*			if (index !== -1) {
			    items[index] = 1010;
			}
			//items.splice(i,1);
*/


			var newVal;
			req.setEncoding('utf8');
			req.on('data',function(chunk){
			console.log('chunk data='+chunk);
//			newVal=chunk;
			items[i] = chunk;
			});

//			console.log('New Val='+newVal);

			
			res.end('OK EDITED \n');

		}
	}// end switch
	
});

server.listen(8000);