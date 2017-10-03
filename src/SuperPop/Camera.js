import Rectangle from './Rectangle';

export default class Camera {
    constructor(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        this.xView = xView || 0;
        this.yView = yView || 0;

        this.xDeadZone = 0;
        this.yDeadZone = 0;

        this.wView = canvasWidth;
        this.hView = canvasHeight;

        this.followed = null;

        // 建立一个矩形区域，是整个画布的大小
        this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);

        // 建立一个矩形区域，是整个地图的大小
        this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    }

    update = () => {
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
    }

    follow = (gameObject, xDeadZone, yDeadZone) => {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }
}