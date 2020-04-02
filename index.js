var express = require("express")
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
const path = require("path");

app.use(express.static("public"));

app.get("/", function(req, res) {
  console.log('sending...')
  res.sendFile("/index.html");
  console.log('sent')
});

players = []


io.on("connection", function(socket) {
  console.log("a user connected", socket.id);
  players.push({id: socket.id})
  socket.on("disconnect", function() {
    console.log("user disconnected");
    players = players.filter(e => e.id != socket.id );
  });
  socket.on("player_pos", function(msg) {
    players.filter(e=> e.id == socket.id)[0].pos = msg
    // console.log(players);

    socket.broadcast.emit("other_player_pos", {id: socket.id, pos: msg});
  });
});

http.listen(process.env.PORT || 8080, function() {
  console.log("listening on *:8080");
});
