Functional.install();
var colorByUser = (function(){/* ul-tra ul-tra ultraviolet */
	var  colors = "#c40233 #009f6b #0087bd #ffd300".split(" ").sort('_ -> 0.5-Math.random()'.lambda()),table = {},i=0;
	return function(name){
	    return table[name] ||(table[name] = (colors[i++] || colors[Math.floor(Math.random()*colors.length)]));
	};
    })();

var points = 15,
    dx = view.size.width / points;

function initPath(proc){
    var p = new Path(),
	y = view.size.height;
    p.strokeColor = colorByUser(proc.user);
    p.strokeWidth = 5;
    until('<0',function(pos){
	    p.add(new Point(pos,y));
	    return pos - dx;
	})(view.size.width);
    p.add(view.bounds.bottomLeft);
    p.smooth();
    return {line:p,pid:proc.pid};
}

function updatePath(proc,latest){
    var p = proc.line;
    for(var i = 0; i<p.segments.length; i++){
	var tmp = p.segments[i].point.y;
	p.segments[i].point.y = latest;
	latest = tmp;
    }
    p.smooth(); 
}


var socket = io.connect('/');
socket.on('message', function (data){
	updatePath(m,Math.random()*view.size.height);
	updatePath(n,Math.random()*view.size.height);
	view.draw();
    });