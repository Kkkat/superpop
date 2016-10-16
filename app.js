var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomColor = ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"];

var players = [];

app.use(express.static('dist'));
app.get('/', function(req, res) {
	res.sendfile('./dist/index.html');
});

io.on('connection', function(socket){
	var player;
	socket.on('registe', function(name) {
		player = {
			"id": socket.id,
			"name": name,
			"x": parseInt(Math.random() * 600),
			"y": parseInt(Math.random() * 300),
			"r": 10,
			"color": randomColor[parseInt(Math.random() * randomColor.length)]
		};

		socket.emit('registe', player);
		players.push(player);
		// socket.emit('self ball', player);
		// socket.broadcast.emit('join', player);
	});

	socket.on('create', function() {
		var roomInfo = 'room1';

		io.sockets.emit('create', {
			room: roomInfo,
			msg: "create successed",
			code: 1
		});
	});

	socket.on('enter', function(data) {
		socket.join(data.room);
		// io.sockets.in(data.room).emit('join', player);
		socket.broadcast.emit('join', player);
	});

	socket.on('update', function(player) {
		socket.broadcast.emit('update', player);
	});

	socket.on('disconnect', function(msg) {
		for(var i = 0; i < players.length; i++) {
			if(socket.id == players[i]["id"]) {
				players.splice(i, 1);
			}
		}
		console.log(players);
	});
});

http.listen(3000, function(){
	console.log('listening on 3000');
});

