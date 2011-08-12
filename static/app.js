Functional.install();
var points = timeout = 30,
    dx = view.size.width / points,
    threshold = 0.1;
project.currentStyle = {strokeWidth: 3, strokeColor: '#000000'};
var colorByUser = (function(){/* ul-tra ul-tra ultraviolet */
	var  colors = "#c40233 #009f6b #0087bd #ffd300".split(" ").sort('_ -> 0.5-Math.random()'.lambda()),table = {},i=0;
	return function(name){return table[name] ||(table[name] = (colors[i++] || colors[Math.floor(Math.random()*colors.length)]));};
    })();
function initPath(proc){
    var p = new Path(),
	y = view.size.height;
    p.strokeColor = colorByUser(proc.user);
    until('<0',function(pos){
	    p.add(new Point(pos,y));
	    return pos - dx;
	})(view.size.width);
    p.add(view.bounds.bottomLeft);
    p.smooth();
    p.ticks = timeout;//some attrs for tracking dead processes. 
    return p;
}
function updatePath(p,latest){
    p.ticks--;// Deal with maybe 'killing' the process
    latest = (latest||{cpu:0}).cpu;
    if(latest > threshold)
	p.ticks = timeout;
    latest = view.size.height*(1-latest/130);//scale latest to a position
    for(var i = 0; i<p.segments.length; i++){
	var tmp = p.segments[i].point.y;
	p.segments[i].point.y = latest;
	latest = tmp;
    }
    p.smooth();
    return p.ticks<=0;
}
function interesting(raw){
    var arr = [];
    for(var i in raw)
	arr.push(raw[i]);
    arr.sort('i j -> j.hunger - i.hunger'.lambda()); 
    return arr.slice(0,15);// Take the most resource-needy stuff
}
io.connect('/').on('message',(function(active){
	    return function(data){
		map(function(proc){// Add the new processes to the active set
			if(active[proc.pid] === undefined){
			    active[proc.pid] = initPath(proc);
			}
		    },interesting(data));
		for(var pid in active){// Update everything, removing all of the dead procs
		    if(updatePath(active[pid],data[pid])){
			active[pid].remove();
			delete active[pid];
		    }
		}
		view.draw();
	    };
	})({}));