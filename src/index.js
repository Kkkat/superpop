window.onload = function() {
	var canvas = document.getElementById("ball");
	if(canvas.getContext) {
		var ctx = canvas.getContext("2d");
		var ball = new Ball(ctx);
	}
	
}


function Ball() {
	this.init.apply(this, arguments);
}

Ball.prototype = {
	
	init: function(ctx) {
		this.drawABall(ctx, 20, 30, 10, "#fff");
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