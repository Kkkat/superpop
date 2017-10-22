import { calTwoSqrt, calDiffY, calDiffX } from '../utils';
import { player } from './index';

export let dragging = null;

/**
 * 拖动事件
 *
 * @export
 * @class DragDrop
 */
export default class DragDrop {
    constructor() {
        this.diffX = 0;
        this.diffY = 0;
        this.controlPanel = document.querySelector('.control-panel');
    }

    handleEvent = (e) => {
        // 获取事件和对象
        const event = e ? e : window.event;
        const target = e.target || e.srcElement;

        // 确定事件类型
        switch (event.type) {
            case 'touchstart':
                e.preventDefault();
                if (~target.className.indexOf('draggable')) {
                    dragging = target;
                } else {
                    dragging = null;
                    return;
                }
                break;

            case 'touchmove':
                if (dragging) {
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

                    dragging.style.left = this.diffX + 50 + 'px';
                    dragging.style.top = this.diffY + 50 + 'px';
                    // 设置默认值,防止小球突然消失
                    this.diffX = this.diffX || 0;
                    this.diffY = this.diffY || 0;
                    player.speedX = this.diffX;
                    player.speedY = this.diffY;
                }
                break;

            case 'touchend':
                if (!dragging) {
                    return;
                }
                player.speedX = 0
                player.speedY = 0;
                dragging.style.left = '50%';
                dragging.style.top = '50%';
                dragging = null;
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