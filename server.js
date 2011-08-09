
var top  = require('./top.js'),
    bee  = require('beeline'),
    io   = require('socket.io'),
    http = require('http');

var route = bee.route({
	'/': bee.staticFile('./static/index.html','text/html'),
	'r`^/(.+)$`': bee.staticDir('./static/', {'.css': 'text/css', '.js': 'application/javascript','.gif':'image/gif'})
    });
var serve = http.createServer(route).listen(1337);
