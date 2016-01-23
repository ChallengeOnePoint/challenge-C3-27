var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    _ = require('lodash'),
    PostIt = require('./api/vo/postit').PostIt;

server.listen(1664);

app.use(express.static(__dirname + '/api/public'));

// Data
var database = [
    new PostIt('1', 'user1', 'title1', 'body1'),
    new PostIt('2', 'user2', 'title2', 'body2'),
    new PostIt('3', 'user3', 'title3', 'body3')
];

// Socket io
io.on('connection', function (socket) {
    var user;

    var update = function(postit) {
        var data = postit.toObject();
        // Broadcast to all
        socket.broadcast.emit('update', data);
        socket.emit('update', data);
    };

    // Connect
    socket.on('login', function (data) {
        user = data;
        socket.emit('login', data);
    });

    // Get
    socket.on('get', function () {
        socket.emit('get', database.map(function(item) {
            return item.toObject();
        }));
    });

    // Add
    socket.on('add', function (data) {
        var postit = new PostIt(user, data.title, data.body);
        database.push(postit);
        update(postit);
    });

    // Remove
    socket.on('remove', function(data) {
        var item = _.find(database, function(item) {
            return item.id === data.id;
        });
        database = _.filter(database, function(item) {
            return item.id !== data.id;
        });

        // Emit
        socket.broadcast.emit('remove', item);
        socket.emit('remove', item);
    });

    // lock
    socket.on('lock', function(data) {
        var item = _.find(database, function(item) {
            return item.id === data.id;
        });
        item.editor = user;
        update(item);
    });

    // unlock
    socket.on('unlock', function(data) {
        var item = _.find(database, function(item) {
            return item.id === data.id;
        });
        item.editor = null;
        update(item);
    });
});

