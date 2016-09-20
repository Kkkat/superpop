window.onload = function() {
	var canvas = document.getElementById("ball");
	if(canvas.getContext) {
		var ctx = canvas.getContext("2d");
		var ball = new Ball(ctx);
		var gamePanel = new GamePanel(ctx);
	}
}


// 游戏面板
function GamePanel() {
	this.init.apply(this, arguments);
}

GamePanel.prototype = {

	init: function(ctx) {
		this.drawText(ctx, "112kg");
		this.drawSteeringWheel(ctx);
		this.drawDivision(ctx);
	},

	// 左上角体重文字
	drawText: function(ctx, text) {
		ctx.save();
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.rect(0, 0, 100, 35);
		ctx.fill();
		ctx.fillStyle = "#fff";
		ctx.font = "14px arial,microsoft yahei";
		ctx.fillText("体重：", 10, 20);
		ctx.fillText(text, 50, 20);
	},

	// 左下角方向盘
	drawSteeringWheel: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "rgba(42, 42, 42, 0.6)";
		ctx.arc(80, 250, 50, 0, Math.PI*2);
		ctx.fill();
		ctx.beginPath();
		ctx.fillStyle = "rgba(255, 255, 255, 1)";
		ctx.arc(80, 250, 25, 0, Math.PI*2);
		ctx.fill();
	},

	// 右下角分裂
	drawDivision: function(ctx) {
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.arc(580, 270, 40, 0, Math.PI*2);
		ctx.fill();
		ctx.beginPath();

		ctx.lineCap = "round";
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#000";
		ctx.moveTo(560, 270);
		ctx.lineTo(600, 270);
		ctx.stroke();
	}
}

// 球球
function Ball() {
	this.init.apply(this, arguments);
}

Ball.prototype = {

	init: function(ctx) {
		this.drawABall(ctx, 200, 30, 10, "#fff");
	},

	drawABall: function(ctx, x, y, r, bColor) {
		ctx.save();
		ctx.fillStyle = bColor;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
}