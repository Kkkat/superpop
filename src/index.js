// var canvas, ctx;
// var ball, anotherball;
// var foodCoordinate = [];
// var player;
import './css/reset';
import './css/index';
import SuperPop from './SuperPop';
import DragDrop from './SuperPop/DragDrop';

window.onload = () => {
    // var name = prompt("please input your name", "");
    // socket.emit("registe", name);
    //    canvas = document.getElementById("ball");
    //    if (canvas.getContext) {
    //        ctx = canvas.getContext("2d");
    //    }
    const superpop = new SuperPop();
    const dragdrop = new DragDrop();
    // console.log(superpop);
    superpop.gameLoop();
    dragdrop.enable();
};