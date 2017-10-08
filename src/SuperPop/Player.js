import { calTwoSqrt } from '../utils';

/**
 * 选手
 *
 * @export
 * @class Player
 */
export default class Player {
    constructor(x, y, r, bColor) {
        this.r = r;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.speed = 60;
        this.bColor = bColor;
    }

    update = (worldWidth, worldHeight) => {
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
    }

    draw = (context, xView, yView) => {
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

    judgeEatAFood = (foodX, foodY) => {
        return this.r >= calTwoSqrt(this.x, this.y, foodX, foodY);
    };
}