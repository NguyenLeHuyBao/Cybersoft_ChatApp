const socket = io();

const acknowledgement = (err) => {
  if (err) {
    return alert(err);
  }
  console.log("đã gửi tin nhắn thành công ");
};

document.getElementById("form-messages").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.getElementById("input-messages").value;
  //send message to Server
  socket.emit("send-message-client-to-server", message, acknowledgement);
});

// receive message from Server
socket.on("send-message-server-to-client", (message) => {
  console.log(message);
});
