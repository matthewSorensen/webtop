var socket = io.connect('/');
socket.on('message', function (data) {
	$('body p').text(JSON.stringify(data));
    });
