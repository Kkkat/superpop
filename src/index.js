var canvas, ctx;
var ball;

window.onload = function() {
	canvas = document.getElementById("ball");
	if(canvas.getContext) {
		ctx = canvas.getContext("2d");
		ball = new Ball();
	}
	DragDrop.enable();

};

var DragDrop = function(){
    var controlPanel = document.querySelector('.control-panel');
	var	dragging = null,
		diffX = 0,
		diffY = 0;

	function handleEvent(e) {
        e.preventDefault();
		// 获取事件和对象
		var event = e ? e: window.event;
		var target = e.target || e.srcElement;

		// 确定事件类型
		switch(event.type) {
			case "touchstart":
				if(target.className.indexOf("draggable") > 1) {
					dragging = target;
				}else {
				    return;
                }
				break;

			case "touchmove":
				if(dragging !== null) {
                    var abX, abY;
					// 指定位置
					diffX = event.touches[0].clientX - target.parentNode.offsetLeft;
					diffY = event.touches[0].clientY - target.parentNode.offsetTop;
					if(diffX >= 115) diffX = 115;
					if(diffX <= -15) diffX = -15;
					if(diffY >= 115) diffY = 115;
					if(diffY <= -15) diffY = -15;
					dragging.style.left =  diffX + 'px';
					dragging.style.top = diffY + 'px';

                    // 这里要判断方向
                    // 算绝对的值
                    if (diffX > 65 && diffY > 65) {
                        // 第一象限
                        abX = calAbs(diffX);
                        abY = calAbs(diffY);
                    } else if (diffX > 65 && diffY < 65) {
                        // 第四象限
                        abX = calAbs(diffX);
                        abY = -calAbs(diffY);
                    } else if (diffX < 65 && diffY > 65) {
                        // 第二象限
                        abX = -calAbs(diffX);
                        abY = calAbs(diffY);
                    } else if (diffX < 65 && diffY < 65) {
                        // 第三象限
                        abX = -calAbs(diffX);
                        abY = -calAbs(diffY);
                    }

                    ball.setSpeedX(abX);
                    ball.setSpeedY(abY);
				}
				break;

			case "touchend":
			    if(dragging === null){
			        return;
                }
				dragging.style.left = "50%";
				dragging.style.top = "50%";
				dragging = null;
				break;
		}
	};

	return {
		enable: function() {
            controlPanel.addEventListener("touchstart", handleEvent);
            controlPanel.addEventListener("touchmove", handleEvent);
            controlPanel.addEventListener("touchend", handleEvent);
		},

		disable: function() {
			controlPanel.removeEventListener("touchstart", handleEvent);
			controlPanel.removeEventListener("touchmove", handleEvent);
			controlPanel.removeEventListener("touchend", handleEvent);
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

	y: 200,

	speedX: 0,

	speedY: 0,

    speed: 80,

	init: function() {
		// this.drawABall(ctx, 200, 100, 10, "#ff5656");
		this.runningBall();
	},

    // 设置x轴的速度
    setSpeedX: function(x) {
	    this.speedX = x;
    },

    // 设置y轴的速度
    setSpeedY: function(y) {
        this.speedY = y;
    },

    //
    setSpeed: function(s) {
        this.speed = s;
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
        this.runningBall = this.runningBall.bind(this);
		window.requestAnimationFrame(this.runningBall);
		ctx.clearRect(0, 0, 1024, 640);
		this.drawABall(this.x, this.y, 10, "#ff5656");
		this.x += this.speedX / this.speed;
		this.y += this.speedY / this.speed;
	}
};

// 计算绝对值
function calAbs(num) {
    return Math.abs(num - 65);
}