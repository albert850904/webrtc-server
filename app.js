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
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

// socket connection
const onConnection = (socket) => {
  console.log("Socket.io init success");
  // 加入房間
  socket.on(socketEvents.JOIN_ROOM, (e) => {
    events.joinRoom(socket)({ username: e.username, room: "general" });
  });
  // 離線
  socket.on(socketEvents.DISCONNECTED, () => {
    events.leaveRoom(socket)({ room: "general" });
  });
  // SDP offer
  socket.on(socketEvents.SDP_OFFER, (offer) => {
    events.SDPOffer(socket)({ offer, room: "general" });
  });
  // SDP answer
  socket.on(socketEvents.SDP_ANSWER, (answer) => {
    events.SDPAnswer(socket)({ answer, room: "general" })
  }
  );
  // ICE candidate
  socket.on(socketEvents.ICE_CANDIDATE, (candidate) =>
    events.ICECandidate(socket)({ candidate, room: "general" })
  );
};

// io connection
socketio.on("connection", onConnection);

// Routing
app.use(express.static(path.join(__dirname, "public"))); // load static resource

server.listen(1122, () => {
  console.log("Server listening at port %d", 1122);
});
