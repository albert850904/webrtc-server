const socketEvents = require("./constants/socketEvent");

const users = {
  general: {},
};

const joinRoom =
  (socket) =>
  ({ username, room }) => {
    users[room][socket.client.id] = { username, id: socket.client.id };
    socket.join(room);
    console.log("emit", users);
    socket.broadcast.in(room).emit(socketEvents.NEW_USER_JOIN, users[room]);
  };

const leaveRoom =
  (socket) =>
  ({ room }) => {
    socket.leave(room);
    delete users[room][socket.client.id];
    socket.broadcast.in(room).emit(socketEvents.USER_LEFT_ROOM, users[room]);
  };

const SDPOffer =
  (socket) =>
  ({ offer, room }) => {
    socket.broadcast.in(room).emit(socketEvents.SDP_OFFER, offer);
  };

const SDPAnswer =
  (socket) =>
  ({ answer, room }) => {
    console.log("switch answer ", answer);
    socket.broadcast.in(room).emit(socketEvents.SDP_ANSWER, answer);
  };

const ICECandidate =
  (socket) =>
  ({ candidate, room }) => {
    console.log("switch candidate");
    socket.broadcast.in(room).emit(socketEvents.ICE_CANDIDATE, candidate);
  };

module.exports = {
  joinRoom,
  leaveRoom,
  SDPOffer,
  SDPAnswer,
  ICECandidate,
};
