var canvas, ctx;
var ball, anotherball;
var foodCoordinate = [];
var player;

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


// requestAnim
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
})();

window.Superpop = {};

(function () {
    function Rectangle(left, top, width, height) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    Rectangle.prototype.set = function (left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    Rectangle.prototype.within = function (r) {
        return (r.left <= this.left &&
        r.right >= this.right &&
        r.top <= this.top &&
        r.bottom >= this.bottom);
    };

    Rectangle.prototype.overlaps = function (r) {
        return (this.left < r.right &&
        r.left < this.right &&
        this.top < r.bottom &&
        r.top < this.bottom);
    };

    Superpop.Rectangle = Rectangle;
})();

(function () {

    var AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    };

    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        this.xDeadZone = 0;
        this.yDeadZone = 0;

        this.wView = canvasWidth;
        this.hView = canvasHeight;

        this.axis = AXIS.BOTH;

        this.followed = null;

        this.viewportRect = new Superpop.Rectangle(this.xView, this.yView, this.wView, this.hView);

        this.worldRect = new Superpop.Rectangle(0, 0, worldWidth, worldHeight);
    }

    Camera.prototype.follow = function (gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };

    Camera.prototype.update = function () {

        if (this.followed != null) {

            if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {

                if (this.followed.x - this.xView + this.xDeadZone > this.wView) {
                    this.xView = this.followed.x - (this.wView - this.xDeadZone);
                }
                else if (this.followed.x - this.xDeadZone < this.xView) {
                    this.xView = this.followed.x - this.xDeadZone;
                }
            }

            if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {

                if (this.followed.y - this.yView + this.yDeadZone > this.hView) {
                    this.yView = this.followed.y - (this.hView - this.yDeadZone);
                }
                else if (this.followed.y - this.yDeadZone < this.yView) {
                    this.yView = this.followed.y - this.yDeadZone;
                }
            }
        }

        this.viewportRect.set(this.xView, this.yView);

        if (!this.viewportRect.within(this.worldRect)) {

            if (this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if (this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if (this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if (this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }
    };

    Superpop.Camera = Camera;
})();

(function () {

    // 球球
    function Player(x, y, r, bColor) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.speed = 60;
        this.bColor = bColor;
        this.randomColor = ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"];
    }

    Player.prototype.update = function (worldWidth, worldHeight) {

        this.x += this.speedX / this.speed;
        this.y += this.speedY / this.speed;

        if (this.x - this.r / 2 < 0) {
            this.x = this.r / 2;
        }
        if (this.y - this.r / 2 < 0) {
            this.y = this.r / 2;
        }
        if (this.x + this.r / 2 > worldWidth) {
            this.x = worldWidth - this.r / 2;
        }
        if (this.y + this.r / 2 > worldHeight) {
            this.y = worldHeight - this.r / 2;
        }

    };

    Player.prototype.draw = function (context, xView, yView) {
        context.save();
        context.fillStyle = this.bColor;
        context.beginPath();
        context.arc(this.x - xView, this.y - yView, this.r, 0, Math.PI * 2);
        // context.fillRect((this.x-this.r/2) - xView, (this.y-this.r/2) - yView, this.r, this.r);
        context.closePath();
        context.stroke();
        context.fill();
        context.restore();
    };

    Player.prototype.judgeEatAFood = function (foodX, foodY) {
        return ((foodX - 2) >= (this.x - this.r) && (foodX - 2) <= (this.x + this.r)) && ((foodY - 2) >= (this.y - this.r) && (foodY - 2) <= (this.y + this.r)) ||
            ((foodX + 2) >= (this.x - this.r) && (foodX + 2) <= (this.x + this.r)) && ((foodY - 2) >= (this.y - this.r) && (foodY - 2) <= (this.y + this.r)) ||
            ((foodX - 2) >= (this.x - this.r) && (foodX - 2) <= (this.x + this.r)) && ((foodY + 2) >= (this.y - this.r) && (foodY + 2) <= (this.y + this.r)) ||
            ((foodX + 2) >= (this.x - this.r) && (foodX + 2) <= (this.x + this.r)) && ((foodY + 2) >= (this.y - this.r) && (foodY + 2) <= (this.y + this.r));
    };

    Superpop.Player = Player;
})();


// map
(function () {

    function Map(width, height) {
        this.width = width;
        this.height = height;

        this.image = null;
        this.randomColor = ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"];
    }

    Map.prototype.generate = function () {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        var _this = this;


        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, this.width, this.height);
            _this.food(ctx, foodCoordinate.length);

            _this.image = new Image();
            _this.image.src = ctx.canvas.toDataURL("image/jpg");

            ctx = null;
        }
        img.src = "./src/img/bg.jpg";

    };

    Map.prototype.draw = function (context, xView, yView) {
        var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;

        sx = xView;
        sy = yView;

        sWidth = context.canvas.width;
        sHeight = context.canvas.height;

        if (this.image.width - sx < sWidth) {
            sWidth = this.image.width - sx;
        }
        if (this.image.height - sy < sHeight) {
            sHeight = this.image.height - sy;
        }

        dx = 0;
        dy = 0;

        dWidth = sWidth;
        dHeight = sHeight;

        context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // context.arc(100, 100, 20, 0, Math.PI * 2);
        // this.food(context, 100);
    };

    Map.prototype.food = function (context, len) {

        for (var i = 0; i < len; i++) {
            context.save();
            context.fillStyle = foodCoordinate[i]["color"];
            context.beginPath();
            context.arc(foodCoordinate[i]["x"], foodCoordinate[i]["y"], 2, 0, Math.PI * 2);
            context.closePath();
            context.stroke();
            context.fill();
            context.restore();
        }
        // console.log(foodCoordinate);
    };

    Superpop.Map = Map;
})();

(function () {

    var canvas = document.getElementById("ball");
    var context = canvas.getContext("2d");

    var room = {
        width: 1024,
        height: 640,
        map: new Superpop.Map(1024, 640)
    };
    var coordinate = {};
    var randomColor = ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"];
    for (var i = 0; i < 100; i++) {
        coordinate["x"] = parseInt(Math.random() * room.width);
        coordinate["y"] = parseInt(Math.random() * room.height);
        coordinate["color"] = randomColor[parseInt(Math.random() * randomColor.length)]
        foodCoordinate.push(coordinate);
        coordinate = {};
    }

    room.map.generate();


    player = new Superpop.Player(50, 50, 10, "#97eaff");

    var camera = new Superpop.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);
    camera.follow(player, canvas.width / 2, canvas.height / 2);

    var update = function () {
        player.update(room.width, room.height);
        camera.update();
    };

    var draw = function () {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // foodCoordinate.splice(0, 1);

        room.map.draw(context, camera.xView, camera.yView);
        player.draw(context, camera.xView, camera.yView);
        // console.log(player.x);
        // room.map.generate();

        for (var i = 0; i < foodCoordinate.length; i++) {
            if (player.judgeEatAFood(foodCoordinate[i]["x"], foodCoordinate[i]["y"])) {
                foodCoordinate.splice(i, 1);
                room.map.generate();
                player.r += 0.5;
            }
        }

    };

    Superpop.gameLoop = function () {
        update();
        draw();
        window.requestAnimationFrame(arguments.callee);
    }

})();

var DragDrop = function () {
    var controlPanel = document.querySelector('.control-panel');
    var dragging = null,
        diffX = 0,
        diffY = 0;

    // 计算diffX的值
    function calDiffX(x, y) {
        return 65 * Math.cos(Math.atan2(y, x));
    }

    // 计算diffY的值
    function calDiffY(x, y) {
        return 65 * Math.sin(Math.atan2(y, x));
    }

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
                    // ball.setSpeedX(diffX);
                    // ball.setSpeedY(diffY);
                    player.speedX = diffX;
                    player.speedY = diffY;
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


window.onload = function () {
    // var name = prompt("please input your name", "");
    // socket.emit("registe", name);
    //    canvas = document.getElementById("ball");
    //    if (canvas.getContext) {
    //        ctx = canvas.getContext("2d");
    //    }
    Superpop.gameLoop();
    DragDrop.enable();
};

// 球球
function Ball(x, y, r, bColor) {
    this.init.apply(this, arguments);
    this.r = r;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.speed = 80;
    this.bColor = bColor;
}

Ball.prototype = {

    randomColor: ["#fff", "#ff9797", "#97eaff", "#97ffbe", "#f4ff97", "#ffb797"],

    init: function () {
        this.runningBall();
        this.randomFood(100);
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

    // 判断是否吃到食物
    judgeEatAFood: function (foodX, foodY) {
        return ((foodX - 2) >= (this.x - this.r) && (foodX - 2) <= (this.x + this.r)) && ((foodY - 2) >= (this.y - this.r) && (foodY - 2) <= (this.y + this.r)) ||
            ((foodX + 2) >= (this.x - this.r) && (foodX + 2) <= (this.x + this.r)) && ((foodY - 2) >= (this.y - this.r) && (foodY - 2) <= (this.y + this.r)) ||
            ((foodX - 2) >= (this.x - this.r) && (foodX - 2) <= (this.x + this.r)) && ((foodY + 2) >= (this.y - this.r) && (foodY + 2) <= (this.y + this.r)) ||
            ((foodX + 2) >= (this.x - this.r) && (foodX + 2) <= (this.x + this.r)) && ((foodY + 2) >= (this.y - this.r) && (foodY + 2) <= (this.y + this.r));
    },

    runningBall: function () {
        this.runningBall = this.runningBall.bind(this);
        ctx.clearRect(this.x - this.r - 1, this.y - this.r - 1, 2 * this.r + 2, 2 * this.r + 2);
        this.x += this.speedX / this.speed;
        this.y += this.speedY / this.speed;
        for (var i = 0; i < foodCoordinate.length; i++) {
            if (this.judgeEatAFood(foodCoordinate[i]["x"], foodCoordinate[i]["y"])) {
                ctx.clearRect(foodCoordinate[i]["x"] - 2, foodCoordinate[i]["y"] - 2, 4, 4);
                foodCoordinate.splice(i, 1);
                this.r += 0.5;
            }
        }
        if (foodCoordinate.length < 190) {
            this.randomFood(100);
        }
        this.drawABall(this.x, this.y, this.r, this.bColor);
        socket.emit('update', ball);
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

    randomFood: function (len) {
        var coordinate = {};
        for (var i = 0; i < len; i++) {
            coordinate["x"] = parseInt(Math.random() * 1024);
            coordinate["y"] = parseInt(Math.random() * 640);
            foodCoordinate.push(coordinate);
            this.drawABall(coordinate["x"], coordinate["y"], 2, this.randomColor[parseInt(Math.random() * this.randomColor.length)]);
            coordinate = {};
        }
    }
};

