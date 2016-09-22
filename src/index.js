var canvas, ctx;

window.onload = function() {
	canvas = document.getElementById("ball");
	if(canvas.getContext) {
		ctx = canvas.getContext("2d");
		var ball = new Ball();
	}
	DragDrop.enable();

}

var DragDrop = function(){
	var	dragging = null,
		diffX = 0,
		diffY = 0;

	function handleEvent(e) {

		// 获取事件和对象
		var event = e ? e: window.event;
		var target = e.target || e.srcElement;

		// 确定事件类型
		switch(event.type) {
			case "touchstart":
				if(target.className.indexOf("draggable") > 1) {
					dragging = target;
				}
				break;

			case "touchmove":
				if(dragging !== null) {

					// 指定位置
					diffX = event.touches[0].clientX - target.parentNode.offsetLeft;
					diffY = event.touches[0].clientY - target.parentNode.offsetTop;
					if(diffX >= 115) diffX = 115;
					if(diffX <= -15) diffX = -15;
					if(diffY >= 115) diffY = 115;
					if(diffY <= -15) diffY = -15;
					dragging.style.left =  diffX + 'px';
					dragging.style.top = diffY + 'px';

				}
				break;

			case "touchend":
				dragging.style.left = "50%";
				dragging.style.top = "50%";
				dragging = null;
				break;
		}
	};

	return {
		enable: function() {
			document.addEventListener("touchstart", handleEvent, false);
			document.addEventListener("touchmove", handleEvent, false);
			document.addEventListener("touchend", handleEvent, false);
		},

		disable: function() {
			document.removeEventListener("touchstart", handleEvent);
			document.removeEventListener("touchmove", handleEvent);
			document.removeEventListener("touchend", handleEvent);
		}
	}

}();

 // requestAnim
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
          	window.oRequestAnimationFrame      ||
          	window.msRequestAnimationFrame
})();

// 球球
function Ball() {
	this.init.apply(this, arguments);
}

Ball.prototype = {

	x: 200,

	y: 100,

	speedX: 10,

	speedY: 20,

	init: function() {
		// this.drawABall(ctx, 200, 100, 10, "#ff5656");
		this.runningBall();
	},

	drawABall: function(x, y, r, bColor) {
		ctx.save();
		ctx.fillStyle = bColor;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	},

	runningBall: function() {
		// console.log(this.runningBall);
		var _this = this;
		window.requestAnimationFrame(_this.runningBall);
		// setTimeout(function() {
		// 	_this.runningBall();
		// }, 100);
		// ctx.clearRect(0, 0, 1024, 640);
		this.drawABall(this.x, this.y, 10, "#ff5656");
		this.x += this.speedX;
		this.y += this.speedY;
	}
}
