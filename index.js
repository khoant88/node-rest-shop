var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(express.static('public'));

app.get("/", (req, res, next) =>{
    res.sendFile(__dirname + '/index.html');
})

io.emit("test", "khoant");

io.on("test", function(msg){
    console.log(msg);
})


io.on("connection", function(socket){
    console.log("A new connection");
    // socket.on('disconnect', function(){
    //     console.log('user disconnected');
    //   });
    // socket.on('chat message', function(msg){
    //     io.emit("server response", msg)
    // });
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});