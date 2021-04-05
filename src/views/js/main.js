const socket = io()
const chatForm = $("#chat-form")
const roomName = $('#room-name')
const userList = $('#users')
// Get username and room from url

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})


// Join chatroom

socket.emit('joinRoom', {username, room})

/// Add Room name to DOM
outputRoomName = (room) => {
    roomName.text(room)
}

outputUsers = (users) => {
    userList.html(`
        ${users.map(user => `<li> ${user.username} </li>`).join('')}
    `)
} 

/// Lang nghe phan hoi tu server vs event roomUsers
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

/// Lang nghe phan hoi tu server
socket.on("msg", (msg) => {
  const div = document.createElement("div")
  
  div.classList.add("message")
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">
        ${msg.text}
    </p>`

  $(".chat-messages").append(div)
})

/// Message submit
const input = $("#msg")

/// Form lang nghe su kien submit roi sau do gui len server
chatForm.on("submit", (e) => {
  e.preventDefault()
  const msg = input.val()

  // emit msg to server
  socket.emit("chatMsg", msg)
  input.val("")
  input.focus()
})
