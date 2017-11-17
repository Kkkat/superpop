import express from 'express';
import Socket from 'socket.io';
import randomColor from 'utils/color';
import path from 'path';
// import


const port = process.env.PORT || 3000;
const app = express();
const server = require('http').createServer(app);
const io = Socket(server);

server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

const players = [];
// const port = process.env.PORT || 3000;
// app.use('/src', express.static('src'));
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

io.on('connection', (socket) => {
    // socket.on('connect', () => {
    //     console.log('connect');
    // });

    socket.on('registe', (name) => {
        const player = {
            id: socket.id,
            name,
            x: parseInt(Math.random() * 600, 10),
            y: parseInt(Math.random() * 300, 10),
            r: 10,
            color: randomColor[parseInt(Math.random() * randomColor.length, 10)],
        };

        socket.emit('registe', player);
        players.push(player);
        // socket.emit('self ball', player);
        // socket.broadcast.emit('join', player);
    });

    // socket.on('create', function() {
    //     var roomInfo = 'room1';

    //     io.sockets.emit('create', {
    //         room: roomInfo,
    //         msg: 'create successed',
    //         code: 1
    //     });
    // });

    // socket.on('enter', function(data) {
    //     socket.join(data.room);
    //     // io.sockets.in(data.room).emit('join', player);
    //     socket.broadcast.emit('join', player);
    // });

    socket.on('update', function(player) {
        socket.broadcast.emit('update', player);
    });

    socket.on('disconnect', function(msg) {
        for (var i = 0; i < players.length; i++) {
            if (socket.id == players[i].id) {
                players.splice(i, 1);
            }
        }
        console.log(players);
    });
});