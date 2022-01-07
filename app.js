const express = require("express");
const path = require("path");
const http = require("http");
// socket io
const socket = require("socket.io");
const socketEvents = require("./constants/socketEvent");

// event function
const events = require("./event");

const app = express();
const server = http.createServer(app); // use express to handle http server
const socketio = socket(server, {
  // allow cross origin
  cors: true,
  origins: ["http://localhost:3000", "https://kairu-cheng.site"],
  // {   methods: ["GET", "POST"],
  // },
});

// socket connection
const onConnection = (socket) => {
  console.log("Socket.io init success");
  // 回傳用戶資訊
  socket.emit(socketEvents.WHO_AM_I, socket.id);

  // 加入房間
  socket.on(socketEvents.JOIN_ROOM, (e) => {
    events.joinRoom(socket)({ username: e.username, room: "general" });
  });
  // 離線
  socket.on(socketEvents.DISCONNECTED, () => {
    events.leaveRoom(socket)({ room: "general" });
  });

  // 打給特定用戶
  socket.on(socketEvents.CALL_USER, (data) => events.callUser(socket)(data));

  // 接聽
  socket.on(socketEvents.ANSWERCALL, (data) => events.answerCall(socket)(data));

  // SDP offer
  socket.on(socketEvents.SDP_OFFER, (offer) => {
    events.SDPOffer(socket)({ offer, room: "general" });
  });
  // SDP answer
  socket.on(socketEvents.SDP_ANSWER, (answer) => {
    events.SDPAnswer(socket)({ answer, room: "general" });
  });
  // ICE candidate
  socket.on(socketEvents.ICE_CANDIDATE, (data) =>
    events.ICECandidate(socket)(data)
  );
};

// io connection
socketio.on("connection", onConnection);

// Routing
app.use(express.static(path.join(__dirname, "public"))); // load static resource

server.listen(1122, () => {
  console.log("Server listening at port %d", 1122);
});
