import Map from './Map';
import Player from './Player';
import Camera from './Camera';

const randomColor = ['#fff', '#ff9797', '#97eaff', '#97ffbe', '#f4ff97', '#ffb797'];
export const player = new Player(50, 50, 10, randomColor[parseInt(Math.random() * randomColor.length)]);
export const foodCoordinate = [];
export default class SuperPop {
    constructor() {
        this.canvas = document.getElementById('ball');
        this.context = this.canvas.getContext('2d');

        this.room = {
            width: 1024,
            height: 768,
            map: new Map(1024, 768)
        };
        for (let i = 0; i < 100; i += 1) {
            const coordinate = {};
            coordinate.x = Number(Math.random() * this.room.width);
            coordinate.y = Number(Math.random() * this.room.height);
            coordinate.color = randomColor[Number(Math.floor(Math.random() * randomColor.length))];
            foodCoordinate.push(coordinate);
        }
        this.room.map.generate();
        // 我是注释：worldHeight = room.width，也就是整个地图的宽
        this.camera = new Camera(0, 0, this.canvas.width, this.canvas.height, this.room.width, this.room.height);
        // 我是注释：xDeadZone = canvas.width / 2 , yDeadZone = canvas.height / 2;
        // 告诉camera，要跟谁，怎么跟
        this.camera.follow(player, this.canvas.width / 2, this.canvas.height / 2);
    }

    // 两个更新
    update = () => {
        // 防止球球超出地图界限
        player.update(this.room.width, this.room.height);
        // 跟踪球球，更新出新的xView和yView
        this.camera.update();
    };

    draw = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 根据新的xView、yView画地图
        this.room.map.draw(this.context, this.camera.xView, this.camera.yView);
        player.draw(this.context, this.camera.xView, this.camera.yView);

        // room.map.generate();

        for (let i = 0; i < foodCoordinate.length; i += 1) {
            if (player.judgeEatAFood(foodCoordinate[i].x, foodCoordinate[i].y)) {
                foodCoordinate.splice(i, 1);
                this.room.map.generate();
                player.r += 0.5;
            }
        }

    };

    gameLoop = () => {
        this.update();
        this.draw();
        window.requestAnimationFrame(this.gameLoop);
    }
}