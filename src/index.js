var canvas, ctx;
var ball, food;
var foodCoordinate = [];

window.onload = function () {
    canvas = document.getElementById("ball");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ball = new Ball();
        food = new Food();
    }
    DragDrop.enable();
    // console.log(foodCoordinate);
};

var DragDrop = function () {
    var controlPanel = document.querySelector('.control-panel');
    var dragging = null,
        diffX = 0,
        diffY = 0;

    function handleEvent(e) {

        // 获取事件和对象
        var event = e ? e : window.event;
        var target = e.target || e.srcElement;

        // 确定事件类型
        switch (event.type) {
            case "touchstart":
                e.preventDefault();
                if (target.className.indexOf("draggable") !== -1) {
                    dragging = target;
                } else {
                    return;
                }
                break;

            case "touchmove":
                if (dragging !== null) {
                    var tempX, tempY;
                    // 指定位置
                    tempX = event.touches[0].clientX - target.parentNode.offsetLeft - 50;
                    tempY = event.touches[0].clientY - target.parentNode.offsetTop - 50;
                    // 如果超出圆形
                    var distance = Math.sqrt(Math.pow(tempX, 2) + Math.pow(tempY, 2));
                    if (distance >= 65) {
                        diffX = calDiffX(tempX, tempY);
                        diffY = calDiffY(tempX, tempY);
                    } else {
                        diffX = tempX;
                        diffY = tempY;
                    }
                    dragging.style.left = diffX + 50 + 'px';
                    dragging.style.top = diffY + 50 + 'px';
                    // 设置默认值,防止小球突然消失
                    diffX = diffX ? diffX : 0;
                    diffY = diffY ? diffY : 0;
                    ball.setSpeedX(diffX);
                    ball.setSpeedY(diffY);
                }
                break;

            case "touchend":
                if (dragging === null) {
                    return;
                }
                dragging.style.left = "50%";
                dragging.style.top = "50%";
                dragging = null;
                break;
        }
    };

    return {
        enable: function () {
            controlPanel.addEventListener("touchstart", handleEvent);
            controlPanel.addEventListener("touchmove", handleEvent);
            controlPanel.addEventListener("touchend", handleEvent);
        },

        disable: function () {
            controlPanel.removeEventListener("touchstart", handleEvent);
            controlPanel.removeEventListener("touchmove", handleEvent);
            controlPanel.removeEventListener("touchend", handleEvent);
        }
    }

}();

// requestAnim
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame
})();

// 球球
function Ball() {
    this.init.apply(this, arguments);
    this.r = 10;
    this.x = 200;
    this.y = 200;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 80;
}

Ball.prototype = {

    init: function () {
        // this.drawABall(ctx, 200, 100, 10, "#ff5656");
        this.runningBall();
    },

    // 设置x轴的速度
    setSpeedX: function (x) {
        this.speedX = x;
    },

    // 设置y轴的速度
    setSpeedY: function (y) {
        this.speedY = y;
    },

    // 设置速度
    setSpeed: function (s) {
        this.speed = s;
    },

    drawABall: function (x, y, r, bColor) {
        // ctx.save();
        ctx.fillStyle = bColor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    },

    judgeEatAFood: function(foodX, foodY) {
        if(foodX >= (this.x - this.r - 1) && foodX <= (this.x + this.r + 1) && foodY >= (this.y - this.r - 1) && foodY <= (this.y + this.r + 1)){
        	return true;
        }
        return false;
    },

    runningBall: function () {
        this.runningBall = this.runningBall.bind(this);
        ctx.clearRect(this.x - this.r - 1, this.y - this.r - 1, 2 * this.r + 2, 2 * this.r + 2);
        this.x += this.speedX / this.speed;
        this.y += this.speedY / this.speed;
        for(var i = 0; i < foodCoordinate.length; i++) {
        	if(this.judgeEatAFood(foodCoordinate[i]["x"], foodCoordinate[i]["y"])) {
        		foodCoordinate.splice(i, 1);
        		this.r += 0.5;
        	}
        }
        this.drawABall(this.x, this.y, this.r, "#ff5656");
        window.requestAnimationFrame(this.runningBall);
    }
};

function Food() {
	this.randomInit(100);
}

Food.prototype = {

	randomColor: ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"],

	drawABall: function (x, y, r, bColor) {
        // ctx.save();
        ctx.fillStyle = bColor;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    },

	randomInit: function(len) {
		var coordinate = {};
		for(var i = 0; i < len; i++) {
			coordinate["x"] = parseInt(Math.random() * 1024);
			coordinate["y"] = parseInt(Math.random() * 640);
			foodCoordinate.push(coordinate);
			this.drawABall(coordinate["x"], coordinate["y"], 2, this.randomColor[parseInt(Math.random() * this.randomColor.length)]);
			coordinate = {};
		}
	}
}


// 计算diffX的值
function calDiffX(x, y) {
    return 65 * Math.cos(Math.atan2(y, x));
}
// 计算diffY的值
function calDiffY(x, y) {
    return 65 * Math.sin(Math.atan2(y, x));
}