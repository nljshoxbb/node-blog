// var proxy = require('http-proxy').createProxyServer({});
// 	proxy.on(function (err,req,res) {
// 		res.writeHead(500,{
// 			'Content-Type':'text/plain'
// 		});
// 	});

// var server = require('http').createServer(function (req,res) {
// 	var host = req.headers.host;
// 	switch(host){
// 		case 'http://localhost:3000/':
// 			proxy.web(req,res,{target:'http://localhost'});
// 		break;
// 		default:
// 			res.writeHead(200,{
// 				'Content-Type':'text/plain'
// 			});
// 			res.end('Welcome to my server!')
// 	}
// })

// console.log('listening on port 80')
// server.listen(80);
var proxy=require('http-proxy').createProxyServer({});
     proxy.on(function(err,req,res){
          res.writeHead(500,{
              'Content-Type':'text/plain'
          });
     });
var server=require('http').createServer(function(req,res){
     var host= req.headers.host;
     switch(host){
          case 'http://localhost:3000':
               proxy.web(req,res,{target:'http://localhost'});
          break;
          // case 'famanoder.com':
          //           proxy.web(req, res, { target: 'http://localhost:4030' });
          //   break;
            default: 
               res.writeHead(200, { 
                    'Content-Type': 'text/plain' 
               }); 
               res.end('Welcome to my server!');
       }
});
console.log("listening on port 80")
server.listen(80);