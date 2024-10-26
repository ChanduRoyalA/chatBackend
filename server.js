import express from "express";
import { Server } from "socket.io";
import http from 'http';
import dotenv from "dotenv";
import cors from 'cors';
import ConnectDB from "./db.js";

dotenv.config();
const app = express();

// CORS middleware for Express
app.use(cors({
    origin: 'http://localhost:3000', // Set your client URL
    methods: ['GET', 'POST'],
    credentials: true // If needed, for sessions or cookies
}));

let connection = {}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // Replace with your frontend origin
        methods: ["GET", "POST"],
        credentials: true                 // Enables Access-Control-Allow-Credentials
    }
});
app.get('/', (req, res) => {
    res.send('hello');
});

io.on('connection', (socket) => {
    console.log("A user connected");
    socket.on('sendMsg', (data) => {
        connection[data.userName] = socket.id;
        console.log(connection)
    })
});

server.listen(4000, () => {
    // ConnectDB();
    console.log("Server listening on port 4000");
});
