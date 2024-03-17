const express = require("express");
const path = require('path')
const { createServer } = require("http");
const { Server } = require("socket.io");
const session = require('express-session')

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.set('views', path.join(__dirname,'/src/views'))
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname,'public')))
app.use(
    session({
        secret:"agvdfghioewrj78",
        saveUninitialized:false,
        resave:false
    })
)

app.use('',require('./src/routes/login'))
app.use('',require('./src/routes/chat'))


let users = []

//newUserConnected
function UserConnected(TableUser,idNewUser){
    TableUser.push(idNewUser)
    return TableUser
}

//UserDisconnected
function UserDisconnected(TableUser,idUser){
    return TableUser.filter((id)=> id != idUser)
}

io.on("connection", (socket) => {
    console.log(`user ${socket.id} connected...`)

    io.emit('newUserConnected',UserConnected(users,socket.id))

    socket.on('disconnect',()=>{
        console.log(`user ${socket.id} disconnected`)
        users = UserDisconnected(users,socket.id)
        io.emit('userDisconnected', users)
    })

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        let id = socket.id
        io.emit('chat message', {msg,id});
    });
});



const PORT = 3000 || process.env.PORT
httpServer.listen(PORT,()=>{
    console.log(`running en port ${PORT}`)
})