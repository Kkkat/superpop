import Map from './Map';
import Player from './Player';
import Camera from './Camera';
import randomColor from '../config/color';
import CONSTANTS from '../config/constants';
import { dragging } from './DragDrop';

export const canvas = document.getElementById('ball');
export const context = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;

// 生成一个在中心的球球
export const player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CONSTANTS.INIT_SIZE, randomColor[parseInt(Math.random() * randomColor.length, 10)]);
export const foodCoordinate = [];

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
        this.initFood();

        this.room.map.generate();
        // 我是注释：worldHeight = room.width，也就是整个地图的宽
        // this.camera = new Camera(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, this.room.width, this.room.height);
        this.camera = new Camera(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
        // 我是注释：xDeadZone = CANVAS_WIDTH / 2 , yDeadZone = CANVAS_HEIGHT / 2;
        // 告诉camera，要跟谁，怎么跟
        this.camera.follow(player, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    }

    initFood = () => {
        const zone = [];
        const unit = CONSTANTS.WIDTH / CONSTANTS.SPLIT_MAP_NUM;
        for (let i = 0; i < CONSTANTS.SPLIT_MAP_NUM; i += 1) {
            zone.push({
                begin: unit * i,
            })
        }
        for (let i = 0; i < CONSTANTS.SPLIT_MAP_NUM; i += 1) {
            for (let j = 0; j < CONSTANTS.INIT_FOOD_NUM / CONSTANTS.SPLIT_MAP_NUM; j += 1) {
                if (!foodCoordinate[i]) {
                    foodCoordinate[i] = [];
                }
                foodCoordinate[i].push({
                    x: Math.random() * unit + zone[i].begin,
                    y: Math.random() * this.room.height,
                    color: randomColor[parseInt(Math.random() * randomColor.length, 10)]
                });
            }
        }
    }

    update = () => {
        if (!dragging) return;
        // 防止球球超出地图界限
        player.update(this.room.width, this.room.height);
        // 跟踪球球，更新出新的xView和yView
        this.camera.update();
    };

    draw = () => {
        context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 根据新的xView、yView画地图
        this.room.map.draw(context, this.camera.xView, this.camera.yView);
        player.draw(context, this.camera.xView, this.camera.yView);

    };

    eat = () => {
        // 如果不拖了，就不判断是不是吃到食物了
        if (!dragging) {
            return;
        }

        const index = this.judgeZone();

        // console.time('judgeFoodTime');
        for (let i = 0; i < foodCoordinate[index].length; i += 1) {
            // 如果吃到了，后期优化，开销太大
            if (player.judgeEatAFood(foodCoordinate[index][i].x, foodCoordinate[index][i].y)) {
                foodCoordinate[index].splice(i, 1);
                this.room.map.generate();
                // 后期这里应该是计算质量，然后判断半径
                player.r += 0.5;
            }
        }
        // console.timeEnd('judgeFoodTime');
    }

    judgeZone = () => {
        const unit = CONSTANTS.WIDTH / CONSTANTS.SPLIT_MAP_NUM;
        return Math.ceil(player.x / unit) - 1;
    }

    gameLoop = () => {
        this.update();
        this.draw();
        this.eat();
        window.requestAnimationFrame(this.gameLoop);
    }
}