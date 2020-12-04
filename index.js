let app = require("express")();
let server = require("http").createServer(app);
let io = require("socket.io")(server);

const rooms = ["sleepy", "Gas", "Offline"];

io.on("connection", (socket) => {
  // sending to the client in Admin Namespace

  const welcomeMessage = `Hello and Welcome to the Ghost. Here are the rules:
   1) No Cursing  
   2) No Porn 
  `;

  socket.emit("welcome", "Hello and Welcome to the Ghost.");

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

  //
  socket.on("getRoom", () => {
    socket.emit("room", rooms);
  });

  //
  socket.on("joinRoom", (room) => {
    if (lobbyAdmin.includes(room)) {
      socket.join(room);
      console.log(`Client ${socket.username} has joined ${room}`);
      return socket.emit("success", "You have successfully Join the room");
    } else {
      return socket.emit("err", "ERROR, Room not found " + room);
    }
  });

  // Leaving rooms
  socket.on("leaveRoom", (room) => {
    socket.leave(room);
    socket.emit(
      "leave-room",
      "Client: " + socket.username + " has left: " + room
    );
    console.log(`Client: ${socket.username} has left ${room}`);
  });
});

var port = process.env.PORT || 3001;

server.listen(port, function () {
  console.log("listening in http://localhost:" + port);
});
