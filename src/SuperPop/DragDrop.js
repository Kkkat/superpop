import { calTwoSqrt, calDiffY, calDiffX } from '../utils';
import { player } from './index'

/**
 * 拖动事件
 *
 * @export
 * @class DragDrop
 */
export default class DragDrop {
    constructor() {
        this.dragging = null;
        this.diffX = 0;
        this.diffY = 0;
        this.controlPanel = document.querySelector('.control-panel');
    }

    handleEvent = (e) => {
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
                if (this.dragging) {
                    let tempX, tempY;
                    // 指定位置
                    tempX = event.touches[0].clientX - target.parentNode.offsetLeft - 50;
                    tempY = event.touches[0].clientY - target.parentNode.offsetTop - 50;
                    // 如果超出圆形
                    const distance = calTwoSqrt(tempX, tempY, 0, 0);
                    if (distance >= 65) {
                        this.diffX = calDiffX(tempX, tempY);
                        this.diffY = calDiffY(tempX, tempY);
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
                if (!this.dragging) {
                    return;
                }
                this.dragging.style.left = '50%';
                this.dragging.style.top = '50%';
                this.dragging = null;
                break;
            default:
                break;
        }
    };
    enable = () => {
        this.controlPanel.addEventListener('touchstart', this.handleEvent);
        this.controlPanel.addEventListener('touchmove', this.handleEvent);
        this.controlPanel.addEventListener('touchend', this.handleEvent);
    };
    disable = () => {
        this.controlPanel.removeEventListener('touchstart', this.handleEvent);
        this.controlPanel.removeEventListener('touchmove', this.handleEvent);
        this.controlPanel.removeEventListener('touchend', this.handleEvent);
    };
}