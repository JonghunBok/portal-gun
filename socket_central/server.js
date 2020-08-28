var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', socket => {
  console.log("a user connected")
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    console.log("joining " + roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

http.listen(3000, () => {
  console.log('listening on *:3000');
});

