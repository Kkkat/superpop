var canvas, ctx;
var ball;

window.onload = function () {
    canvas = document.getElementById("ball");
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
        ball = new Ball();
    }
    DragDrop.enable();

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
                if (target.className.indexOf("draggable") > 1) {
                    dragging = target;
                } else {
                    return;
                }
                break;

            case "touchmove":
                if (dragging !== null) {
                    var abX, abY;
                    // 指定位置
                    diffX = event.touches[0].clientX - target.parentNode.offsetLeft;
                    diffY = event.touches[0].clientY - target.parentNode.offsetTop;
                    // 这里要判断方向
                    // 算绝对的值
                    var distance = Math.sqrt(Math.pow(diffX - 50, 2) + Math.pow(diffY - 50, 2));
                    if (diffX > 50 && diffY >= 50) {
                        // 桌面上的第四象限,但是确是第一象限的取值
                        if (distance >= 65) {
                            diffX = calDiffX(diffX, diffY) + 50;
                            diffY = calDiffY(diffX, diffY) + 50;
                        }
                        abX = calAbs(diffX);
                        abY = calAbs(diffY);

                    } else if (diffX >= 50 && diffY < 50) {
                        // 桌面上的第一象限,但是确是第四象限的取值
                        if (distance >= 65) {
                            diffX = calDiffX(calAbs(diffX), -calAbs(diffY)) + 50;
                            diffY = calDiffY(calAbs(diffX), -calAbs(diffY)) + 50;
                        }
                        abX = calAbs(diffX);
                        abY = -calAbs(diffY);
                    } else if (diffX <= 50 && diffY > 50) {
                        // 桌面上的第三象限,但是却是第二象限的取值
                        if (distance >= 65) {
                            diffX = calDiffX(-calAbs(diffX), calAbs(diffY)) + 50;
                            diffY = calDiffY(-calAbs(diffX), calAbs(diffY)) + 50;
                        }
                        abX = -calAbs(diffX);
                        abY = calAbs(diffY);
                    } else if (diffX < 50 && diffY <= 50) {
                        // 桌面上的第二象限,但是却是第三象限的取值
                        if (distance >= 65) {
                            diffX = calDiffX(-calAbs(diffX), -calAbs(diffY)) + 50;
                            diffY = calDiffY(-calAbs(diffX), -calAbs(diffY)) + 50;
                        }
                        abX = -calAbs(diffX);
                        abY = -calAbs(diffY);
                    }

                    dragging.style.left = diffX + 'px';
                    dragging.style.top = diffY + 'px';
                    // 设置默认值,防止小球突然消失
                    abX = abX ? abX : 0;
                    abY = abY ? abY : 0;
                    ball.setSpeedX(abX);
                    ball.setSpeedY(abY);
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

    runningBall: function () {
        this.runningBall = this.runningBall.bind(this);
        ctx.clearRect(this.x - this.r - 1, this.y - this.r - 1, 2 * this.r + 2, 2 * this.r + 2);
        this.x += this.speedX / this.speed;
        this.y += this.speedY / this.speed;
        this.drawABall(this.x, this.y, this.r, "#ff5656");
        window.requestAnimationFrame(this.runningBall);
    }
};

// 计算绝对值,坐标绝对值
function calAbs(num) {
    return Math.abs(num - 50);
}
// 计算diffX的值
function calDiffX(x, y) {
    return 65 * Math.cos(Math.atan2(y, x));
}
// 计算diffY的值
function calDiffY(x, y) {
    return 65 * Math.sin(Math.atan2(y, x));
}