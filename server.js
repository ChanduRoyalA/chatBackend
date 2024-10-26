import express from "express"
import { Server } from "socket.io"
import http from 'http'

const app = express()
const server = http.createServer(app)
const io = new Server(server)
app.get('/', (req, res) => {
    res.send('hello')
})



io.on('connection', (socket) => {
    console.log("A user connected");
    socket.emit("message", "Hi");
})



server.listen(3000, () => {
    console.log("Server listening on port 3000")
})
