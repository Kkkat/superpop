// var socket = io();


// 用户注册，创建自己的小球
// socket.on("registe", function(player) {
// 	ball = new Ball(player['x'], player['y'], player['r'], player['color']);
// 	socket.emit("create");
// });

// socket.on("create", function(data) {
// 	socket.emit("enter", data);
// });

// 其他玩家加入创建的球球
// socket.on("join", function(player) {
//    	anotherball = new Ball(player['x'], player['y'], player['r'], player['color']);
// });

// socket.on("update", function(player) {
// 	console.log(player);
// 	anotherball.r = player.r;
// 	anotherball.x = player.x;
// 	anotherball.y = player.y;
// 	anotherball.speedX = player.speedX;
// 	anotherball.speedY = player.speedY;
// 	anotherball.speed = player.speed;
// });