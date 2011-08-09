var spawn = require('child_process').spawn;
/* This is very brittle... */
function parseLine(line){
    var broken = (' '+line).split(/\s+/);// pad with space, and then split on space
    if(broken[1] == 'top'){ // We've completed a cycle, and can send the data out
	return {trigger:true};
    }else if(broken[1].match(/[0-9]+/)){ // If the first line is an integer, it's new data
	return {trigger:false,
		pid: broken[1],
		data: {user: broken[2],
		    command: broken[12],
		    mem:     broken[10],
		    cpu:     broken[9]
	    }};
    } // Otherwise it's the boring stuff. This is the first few lines of top. 
    // If I wasn't as lazy, this holds some interesting info!
    return {trigger: false, pid: null};
}

exports.spawnTop = function (updateClient){
    var top = spawn('top',['-bs']);
    // This last_line non-sense is required as buffers many split up a line of output...
    var last_line = '';
    var data = {};
    var updateOrTrigger = function(newLine){
	if(newLine.trigger){
	    updateClient(data);
	    data = {};
	}else if(newLine.pid !== null){
	    data[newLine.pid] = newLine.data;
	}
    };
    top.stdout.on('data', function(data){
	    var strs = (''+data).split('\n');
	    var start = 0;

	    if(last_line !== ''){
		if(strs[0] != ''){
		    last_line = last_line + strs[0];
		    start = 1;
		}
		updateOrTrigger(parseLine(last_line));
	    }
	    for(var i = start; i<strs.length-1; i++){
		if(strs[i] != ''){
		    updateOrTrigger(parseLine(strs[i]));
		}
	    }
	    last_line = strs[strs.length -1];
	});
    top.on('exit',function (code){console.log('oops! Top died with '+code);});
    process.on('SIGINT',function(){
	    console.log('killing top');
	    top.kill();
	    console.log('exiting');
	    process.exit();
	});
};
