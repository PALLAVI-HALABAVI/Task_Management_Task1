require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const meetingRoutes = require('./routes/meetingRoutes');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

//const mongoose = require('mongoose');
const app = express(); 

const http = require("http"); 
const { Server } = require('socket.io');
//const meetingRoutes = require('./routes/meetingRoutes');

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


connectDB();


app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});
app.get('/', (req, res) => {
  res.send('WebRTC + Socket.io server is running');
});

let messages = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.emit('chat-history', messages);

  socket.on('send-message', (msg) => {
    messages.push(msg); 
    io.emit('receive-message', msg); 
  });


  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);

    socket.on('signal', (data) => {
      io.to(data.userToSignal).emit('signal', {
        signal: data.signal,
        callerId: socket.id
      });
    });

 socket.on('return-signal', (data) => {
      io.to(data.callerId).emit('receive-return-signal', {
        signal: data.signal,
        id: socket.id
      });
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/meetings', meetingRoutes);



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
