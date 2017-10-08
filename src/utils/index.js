/**
 * 计算两点之间距离
 * @param {Number} x
 * @param {Number} y
 * @param {Number} a
 * @param {Number} b
 */
export const calTwoSqrt = (x, y, a, b) => {
    return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
};

/**
 * 计算到X的差距
 * @param {Number} x
 * @param {Number} y
 */
export const calDiffX = (x, y) => {
    return 65 * Math.cos(Math.atan2(y, x));
};

/**
 * 计算到Y的差距
 * @param {Number} x
 * @param {Number} y
 */
export const calDiffY = function(x, y) {
    return 65 * Math.sin(Math.atan2(y, x));
};