const express = require("express");
const FilterBadWords = require("bad-words");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

io.on("connection", (socket) => {
  console.log("new client just connect", socket.id);
  //su ly cau chao
  //1: user vua ket noi vao: chao mung den voi cybersoft
  //2: cac user da ket noi truoc do: co 1 user moi vua ket noi
  // broadcast se giup gui thong bao cho tat ca user cu tru thang moi vao
  socket.emit("send-message-server-to-client", "Welcome to cyberchat");
  socket.broadcast.emit("send-message-server-to-client", "có 1 user mới vào");

  //receive message from client
  socket.on("send-message-client-to-server", (message, callback) => {
    //check message is valid or not
    const filterBadWords = new FilterBadWords();
    if (filterBadWords.isProfane(message)) {
      return callback("message co tu khong phu hop");
    }
    io.emit("send-message-server-to-client", message);

    //xu ly gui tin nhan thanh cong
    callback();
  });

  socket.on(
    "disconnect",
    () =>
      socket.broadcast.emit(
        "send-message-server-to-client",
        `client ${socket.id} just disconnect`
      )
    // console.log(`client ${socket.id} just disconnect`);
  );
});

// http://localhost:5000/ <==> public
const pathPublicDirectory = path.join(__dirname, "../public");
app.use(express.static(pathPublicDirectory));

const port = 5000;
httpServer.listen(port, () => {
  console.log("run on port " + port);
});
