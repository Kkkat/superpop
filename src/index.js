window.onload = function() {
	var canvas = document.getElementById("ball");
	if(canvas.getContext) {
		var ctx = canvas.getContext("2d");
		var ball = new Ball(ctx);
	}
	DragDrop.enable();

	// document.addEventListener("touchstart", function(e) {
	// 	console.log(e);
	// })
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
					diffX = event.touches[0].clientX - target.parentNode.offsetLeft;
					diffY = event.touches[0].clientY - target.parentNode.offsetTop;
					// console.log(event.touches[0].screenX);
				}
				break;

			case "touchmove":
				if(dragging !== null) {

					// 指定位置
					dragging.style.left =  diffX + 'px';
					dragging.style.top = diffY + 'px';

				}
				break;

			case "touchend":
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

}()

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