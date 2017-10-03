var canvas, ctx;
var ball, anotherball;
var foodCoordinate = [];
var player;
var controlPanel = document.querySelector('.control-panel');

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
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame;
})();

window.Superpop = {};

(function() {
    function Rectangle(left, top, width, height) {
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }

    Rectangle.prototype.set = function(left, top, width, height) {
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    };

    Rectangle.prototype.within = function(r) {
        return (r.left <= this.left &&
            r.right >= this.right &&
            r.top <= this.top &&
            r.bottom >= this.bottom);
    };

    Rectangle.prototype.overlaps = function(r) {
        return (this.left < r.right &&
            r.left < this.right &&
            this.top < r.bottom &&
            r.top < this.bottom);
    };

    Superpop.Rectangle = Rectangle;
})();

(function() {

    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        this.xDeadZone = 0;
        this.yDeadZone = 0;

        this.wView = canvasWidth;
        this.hView = canvasHeight;

        this.followed = null;

        // 建立一个矩形区域，是整个画布的大小
        this.viewportRect = new Superpop.Rectangle(this.xView, this.yView, this.wView, this.hView);

        // 建立一个矩形区域，是整个地图的大小
        this.worldRect = new Superpop.Rectangle(0, 0, worldWidth, worldHeight);
    }

    Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    };

    Camera.prototype.update = function() {

        if (this.followed !== null) {
            // 右超出
            if (this.followed.x - this.xView + this.xDeadZone > this.wView) {
                this.xView = this.followed.x - (this.wView - this.xDeadZone);
            }
            // 左超出
            else if (this.followed.x - this.xDeadZone < this.xView) {
                this.xView = this.followed.x - this.xDeadZone;
            }
            // 下超出
            if (this.followed.y - this.yView + this.yDeadZone > this.hView) {
                this.yView = this.followed.y - (this.hView - this.yDeadZone);
            }
            // 上超出
            else if (this.followed.y - this.yDeadZone < this.yView) {
                this.yView = this.followed.y - this.yDeadZone;
            }
        }
        // 设置新的矩形区域
        this.viewportRect.set(this.xView, this.yView);

        //判断新的是否在地图里面
        if (!this.viewportRect.within(this.worldRect)) {

            if (this.viewportRect.left < this.worldRect.left) {
                this.xView = this.worldRect.left;
            }
            if (this.viewportRect.top < this.worldRect.top) {
                this.yView = this.worldRect.top;
            }
            if (this.viewportRect.right > this.worldRect.right) {
                this.xView = this.worldRect.right - this.wView;
            }
            if (this.viewportRect.bottom > this.worldRect.bottom) {
                this.yView = this.worldRect.bottom - this.hView;
            }
        }
    };

    Superpop.Camera = Camera;
})();

(function() {

    // 球球
    function Player(x, y, r, bColor) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.speed = 60;
        this.bColor = bColor;
        this.randomColor = ['#fff', '#ff9797', '#97eaff', '#97ffbe', '#f4ff97', '#ffb797'];
    }

    Player.prototype.update = function(worldWidth, worldHeight) {

        this.x += this.speedX / this.speed;
        this.y += this.speedY / this.speed;

        // 这里设定了球一定得在地图里面
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

    Player.prototype.draw = function(context, xView, yView) {
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

    Player.prototype.judgeEatAFood = function(foodX, foodY) {
        return this.r >= Superpop.Utils.prototype.calTwoSqrt(this.x, this.y, foodX, foodY);
    };

    Superpop.Player = Player;
})();

(function() {
    function Utils() {}

    Utils.prototype.calTwoSqrt = function(x, y, a, b) {
        return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
    };

    Utils.prototype.calDiffX = function(x, y) {
        return 65 * Math.cos(Math.atan2(y, x));
    };

    Utils.prototype.calDiffY = function(x, y) {
        return 65 * Math.sin(Math.atan2(y, x));
    };
    Superpop.Utils = Utils;

})();

// map
(function() {

    function Map(width, height) {
        this.width = width;
        this.height = height;

        this.image = new Image();
    }

    Map.prototype.generate = function() {
        // 每吃一个小球就会重新生成一次Map
        var ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        var img = new Image();
        img.src = './src/img/bg.jpg';
        // img.crossOrigin = '*';
        img.onload = (function() {

            ctx.drawImage(img, 0, 0, this.width, this.height);
            this.food(ctx, foodCoordinate.length);
            this.image.src = ctx.canvas.toDataURL('image/jpg');
            ctx = null;
        }).bind(this);
    };

    Map.prototype.draw = function(context, xView, yView) {
        var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;

        // 开始裁剪的xy位置
        sx = xView;
        sy = yView;

        // 被剪裁的img高宽
        sWidth = context.canvas.width;
        sHeight = context.canvas.height;

        if (this.image.width - sx < sWidth) {
            sWidth = this.image.width - sx;
        }
        if (this.image.height - sy < sHeight) {
            sHeight = this.image.height - sy;
        }

        // canvas上放置img的位置
        dx = 0;
        dy = 0;

        // img的高宽
        dWidth = sWidth;
        dHeight = sHeight;

        context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // context.arc(100, 100, 20, 0, Math.PI * 2);
        // this.food(context, 100);
    };

    Map.prototype.food = function(context, len) {
        for (var i = 0; i < len; i += 1) {
            context.save();
            context.fillStyle = foodCoordinate[i].color;
            context.beginPath();
            context.arc(foodCoordinate[i].x, foodCoordinate[i].y, 2, 0, Math.PI * 2);
            context.closePath();
            context.stroke();
            context.fill();
            context.restore();
        }
        // console.log(foodCoordinate);
    };

    Superpop.Map = Map;
})();

(function() {
    function DragDrop() {
        this.dragging = null;
        this.diffX = 0;
        this.diffY = 0;
    }

    DragDrop.prototype.handleEvent = function(e) {
        // 获取事件和对象
        var event = e ? e : window.event;
        var target = e.target || e.srcElement;

        // 确定事件类型
        switch (event.type) {
            case 'touchstart':
                e.preventDefault();
                if (~target.className.indexOf('draggable')) {
                    this.dragging = target;
                } else {
                    this.dragging = null;
                    return;
                }
                break;

            case 'touchmove':
                if (this.dragging !== null) {
                    var tempX, tempY;
                    // 指定位置
                    tempX = event.touches[0].clientX - target.parentNode.offsetLeft - 50;
                    tempY = event.touches[0].clientY - target.parentNode.offsetTop - 50;
                    // 如果超出圆形
                    var distance = Superpop.Utils.prototype.calTwoSqrt(tempX, tempY, 0, 0);
                    if (distance >= 65) {
                        this.diffX = Superpop.Utils.prototype.calDiffX(tempX, tempY);
                        this.diffY = Superpop.Utils.prototype.calDiffY(tempX, tempY);
                    } else {
                        this.diffX = tempX;
                        this.diffY = tempY;
                    }

                    this.dragging.style.left = this.diffX + 50 + 'px';
                    this.dragging.style.top = this.diffY + 50 + 'px';
                    // 设置默认值,防止小球突然消失
                    this.diffX = this.diffX ? this.diffX : 0;
                    this.diffY = this.diffY ? this.diffY : 0;
                    player.speedX = this.diffX;
                    player.speedY = this.diffY;
                }
                break;

            case 'touchend':
                if (this.dragging === null) {
                    return;
                }
                this.dragging.style.left = '50%';
                this.dragging.style.top = '50%';
                this.dragging = null;
                break;
        }
    };
    DragDrop.prototype.enable = function() {
        controlPanel.addEventListener('touchstart', this.handleEvent);
        controlPanel.addEventListener('touchmove', this.handleEvent);
        controlPanel.addEventListener('touchend', this.handleEvent);
    };
    DragDrop.prototype.disable = function() {
        controlPanel.removeEventListener('touchstart', this.handleEvent);
        controlPanel.removeEventListener('touchmove', this.handleEvent);
        controlPanel.removeEventListener('touchend', this.handleEvent);
    };
    Superpop.DragDrop = DragDrop;
})();

(function() {

    var canvas = document.getElementById('ball');
    var context = canvas.getContext('2d');

    var room = {
        width: 1024,
        height: 768,
        map: new Superpop.Map(1024, 768)
    };
    var coordinate = {};
    var randomColor = ['#fff', '#ff9797', '#97eaff', '#97ffbe', '#f4ff97', '#ffb797'];
    for (var i = 0; i < 100; i += 1) {
        coordinate.x = parseInt(Math.random() * room.width);
        coordinate.y = parseInt(Math.random() * room.height);
        coordinate.color = randomColor[parseInt(Math.random() * randomColor.length)];
        foodCoordinate.push(coordinate);
        coordinate = {};
    }

    room.map.generate();


    player = new Superpop.Player(50, 50, 10, randomColor[parseInt(Math.random() * randomColor.length)]);
    // 我是注释：worldHeight = room.width，也就是整个地图的宽
    var camera = new Superpop.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);
    // 我是注释：xDeadZone = canvas.width / 2 , yDeadZone = canvas.height / 2;
    // 告诉camera，要跟谁，怎么跟
    camera.follow(player, canvas.width / 2, canvas.height / 2);

    // 两个更新
    var update = function() {
        // 防止球球超出地图界限
        player.update(room.width, room.height);
        // 跟踪球球，更新出新的xView和yView
        camera.update();
    };

    var draw = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 根据新的xView、yView画地图
        room.map.draw(context, camera.xView, camera.yView);
        player.draw(context, camera.xView, camera.yView);

        // room.map.generate();

        for (var i = 0; i < foodCoordinate.length; i += 1) {
            if (player.judgeEatAFood(foodCoordinate[i].x, foodCoordinate[i].y)) {
                foodCoordinate.splice(i, 1);
                room.map.generate();
                player.r += 0.5;
            }
        }

    };

    Superpop.gameLoop = function() {
        update();
        draw();
        window.requestAnimationFrame(arguments.callee);
    }

})();

window.onload = function() {
    // var name = prompt("please input your name", "");
    // socket.emit("registe", name);
    //    canvas = document.getElementById("ball");
    //    if (canvas.getContext) {
    //        ctx = canvas.getContext("2d");
    //    }
    Superpop.gameLoop();
    Superpop.DragDrop.prototype.enable()
};