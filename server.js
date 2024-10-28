import express from "express";
import { Server } from "socket.io";
import http from 'http';
import dotenv from "dotenv";
import cors from 'cors';
import ConnectDB from "./db.js";
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// CORS middleware for Express
app.use(cors({
    origin: 'http://localhost:3000', // Set your client URL
    methods: ['GET', 'POST'],
    credentials: true // If needed, for sessions or cookies
}));
app.use('/user', userRoute)

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
    // console.log("A user connected");
    socket.on('sendconnection', (data) => {
        if (data.user != undefined) {
            connection[data.user] = socket.id;
            console.log(connection)
        }
    })

    socket.on("sendMsg", data => {
        const receiverSocketId = connection[data.userToSend];
        if (receiverSocketId) {
            const receiverSocket = io.sockets.sockets.get(receiverSocketId);
            // console.log(receiverSocket)
            if (receiverSocket) {
                receiverSocket.emit('receiveMsg', data);
            } else {
                // console.log(`${data.userToSend} is offline`);

            }
        } else {
            data = {
                ...data,
                error: "User Is Currently Offline",
            }
            socket.emit('errorSendingMsg', data);
            console.log(`${data.userToSend} is not connected`);
        }
    });
    socket.on('disconnectClient', (data) => {
        delete connection[data.user]; // or however you're tracking connections
        console.log(connection)
    });
});

server.listen(4000, () => {
    ConnectDB();
    console.log("Server listening on port 4000");
});
