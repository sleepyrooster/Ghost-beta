let app = require("express")();
let server = require("http").createServer(app);
let io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // sending to the client in Admin Namespace
  socket.emit("welcome", "Hello and Welcome to the Ghost ");

  socket.on("disconnect", function () {
    io.emit("users-changed", { user: socket.username, event: "left" });

    // Stating that client disconnect from server
    const clientDisconnect = `Client Named: ${socket.username}, Id: ${socket.id}, Has Disconnected: ${socket.connected}`;
    console.log(clientDisconnect);
  });

  socket.on("set-name", (name) => {
    socket.username = name;
    io.emit("users-changed", { user: name, event: "joined" });

    // states the new client to the server
    const newClient = `New Client Name: ${socket.username} and Id: ${socket.id}`;
    console.log(newClient);
  });

  socket.on("send-message", (message) => {
    io.emit("message", {
      msg: message.text,
      user: socket.username,
      createdAt: new Date(),
    });
  });
});

var port = process.env.PORT || 3001;

server.listen(port, function () {
  console.log("listening in http://localhost:" + port);
});
