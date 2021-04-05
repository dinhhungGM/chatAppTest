const express = require("express")
const app = express()
const path = require("path")
const port = process.env.PORT || 3000
const http = require("http")
const server = http.Server(app)
const socketio = require("socket.io")
const io = socketio(server)
const formatMessage = require("./utils/messeges")
const {userJoin, getCurrentUser, userLeft, getRoomUsers} = require('./utils/users')

app.use(express.static(path.join(__dirname, "views")))
const botName = "admin"

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {

    
    const user = userJoin(socket.id, username, room)
    socket.join(user.room)
    

    socket.emit("msg", formatMessage(botName, "Welcome to ChatRoom"))
    // Broadcast when a uer connects
    socket.broadcast.to(user.room).emit(
      "msg",
      formatMessage(botName, `${user.username} user has joinned the chat`)
    )
    
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room),
    })

  })
  socket.on("chatMsg", (msg) => {
    const user = getCurrentUser(socket.id)
    
    
    io.to(user.room).emit("msg", formatMessage(user.username, msg))
  })

  socket.on("disconnect", () => {
    const user = userLeft(socket.id)
    if(user){    
        io.to(user.room).emit("msg", formatMessage(botName, `${user.username} has left the chat room`))

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        })
    }

  })

 // send users and room info
 

})

server.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`)
})
