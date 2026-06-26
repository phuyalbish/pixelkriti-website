import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("cursor-move", (data) => {
    socket.broadcast.emit("cursor-update", { id: socket.id, ...data });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    io.emit("cursor-remove", socket.id);
  });
});



const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
