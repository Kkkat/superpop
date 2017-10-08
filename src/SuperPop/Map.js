import { foodCoordinate, context } from './index';
import background from '../img/bg.jpg';

/**
 * 地图
 *
 * @export
 * @class Map
 */
export default class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.image = new Image();
    }

    generate = () => {
        // 每吃一个小球就会重新生成一次Map
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, this.width, this.height);
            this.food(ctx);
            this.image.src = ctx.canvas.toDataURL('image/jpg');
        }
        img.src = background;
    };

    draw = (context, xView, yView) => {
        let sx, sy, dx, dy;
        let sWidth, sHeight, dWidth, dHeight;

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
        // this.food(context);
    };

    food = (ctx) => {
        for (let i = 0; i < foodCoordinate.length; i += 1) {
            ctx.save();
            ctx.fillStyle = foodCoordinate[i].color;
            ctx.beginPath();
            ctx.arc(foodCoordinate[i].x, foodCoordinate[i].y, 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.restore();
        }
    };
}