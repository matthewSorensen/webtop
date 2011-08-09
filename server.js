var top  = require('./top.js'),
    bee  = require('beeline'),
    io   = require('socket.io'),
    http = require('http');

var route = bee.route({
	'/': bee.staticFile('./static/index.html','text/html'),
	'r`^/(.+)$`': bee.staticDir('./static/', {'.css': 'text/css', '.js': 'application/javascript','.gif':'image/gif'})
    });
var serve = http.createServer(route);

serve.listen(1337);
io = io.listen(serve);

var previous = {};

io.sockets.on('connection', function (socket) {
	socket.json.send(previous);
    });

top.spawnTop(function(data){
	previous = data;
	io.sockets.json.send(data);
    });