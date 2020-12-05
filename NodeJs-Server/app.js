const express = require("express");
const usersController = require("./controllers/users-controller");
const vacationsController = require("./controllers/vacations-controller");
const errorHandler = require("./errors/error-handler");
const loginFilter = require('./middleware/login-filter');
const ErrorType = require("./errors/error-type");
const ServerError = require("./errors/server-error");
const socketsMap = require('./Model/socketsMap');
var cors = require('cors');
const PORT = process.env.PORT || 3001;

const server = express();
const http = require("http");
const socket = require("socket.io");
const usersLogic = require("./logic/users-logic");
const httpServer = http.createServer(server);
const io = socket(httpServer);

server.use(express.static(__dirname));
server.use(express.static('./uploads'));
server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(loginFilter());
server.use(function (err, req, res, next) {
  if (401 === err.status) {
      throw new ServerError(ErrorType.UNAUTHORIZED);
  }
});
server.use(express.json());
server.use("/users", usersController);
server.use("/vacations", vacationsController);
server.use(errorHandler);

// socket server
io.on("connection", async function (socket) {
    let handshakeData = socket.request;
    let token = handshakeData._query['userId'];

    let user = await usersLogic.ValidateUserByToken(token);
    if (user == null){
      return;
    }
    else {
      socketsMap.set(user.id, socket);
      console.log(`user id ${user.id} (${user.first_name}) connected: -> Total clients: ${socketsMap.size}`);
    }
    
  //recives :number
  socket.on("delete_vacation", vacationId => {
    socket.broadcast.emit('delete_vacation', vacationId);
  });

  //recives :object
  socket.on("add_vacation", newVacation => {
    socket.broadcast.emit("add_vacation", newVacation);
  }); 

  //recives :object
  socket.on("edit_vacation", editedVacation => {
    socket.broadcast.emit('edit_vacation', editedVacation);
  });

  socket.on("vacation_has_been_followed", followedVacation => {
    socket.broadcast.emit('vacation_has_been_followed', followedVacation);
  });

  socket.on("vacation_has_been_unfollowed", unFollowedVacation => {
    socket.broadcast.emit('vacation_has_been_unfollowed', unFollowedVacation);
  });

  // need fix
  socket.on("disconnect", () => {
        socketsMap.delete(user.id);
        console.log(`user id ${user.id} (${user.first_name}) has been disconnected: -> Total clients: ${socketsMap.size}`);
  });
});


httpServer.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));

