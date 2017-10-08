import Map from './Map';
import Player from './Player';
import Camera from './Camera';
import randomColor from '../config/color';
import CONSTANTS from '../config/constants';

export const player = new Player(50, 50, 10, randomColor[parseInt(Math.random() * randomColor.length, 10)]);
export const foodCoordinate = [];
export const canvas = document.getElementById('ball');
export const context = canvas.getContext('2d');

/**
 * 球球
 *
 * @export
 * @class SuperPop
 */
export default class SuperPop {
    constructor() {
        this.room = {
            width: CONSTANTS.WIDTH,
            height: CONSTANTS.HEIGHT,
            map: new Map(CONSTANTS.WIDTH, CONSTANTS.HEIGHT)
        };
        // 生成食物
        for (let i = 0; i < 100; i += 1) {
            const coordinate = {};
            coordinate.x = Number(Math.random() * this.room.width);
            coordinate.y = Number(Math.random() * this.room.height);
            coordinate.color = randomColor[parseInt(Math.random() * randomColor.length, 10)];
            foodCoordinate.push(coordinate);
        }
        this.room.map.generate();
        // 我是注释：worldHeight = room.width，也就是整个地图的宽
        this.camera = new Camera(500, 500, canvas.width, canvas.height, this.room.width * 2, this.room.height * 2);
        // 我是注释：xDeadZone = canvas.width / 2 , yDeadZone = canvas.height / 2;
        // 告诉camera，要跟谁，怎么跟
        this.camera.follow(player, canvas.width / 2, canvas.height / 2);
    }

    // 两个更新
    update = () => {
        // 防止球球超出地图界限
        player.update(this.room.width, this.room.height);
        // 跟踪球球，更新出新的xView和yView
        this.camera.update();
    };

    draw = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);

        // 根据新的xView、yView画地图
        this.room.map.draw(context, this.camera.xView, this.camera.yView);
        player.draw(context, this.camera.xView, this.camera.yView);

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