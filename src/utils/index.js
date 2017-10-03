export const calTwoSqrt = (x, y, a, b) => {
    return Math.sqrt(Math.pow(x - a, 2) + Math.pow(y - b, 2));
};

export const calDiffX = (x, y) => {
    return 65 * Math.cos(Math.atan2(y, x));
};

export const calDiffY = function(x, y) {
    return 65 * Math.sin(Math.atan2(y, x));
};