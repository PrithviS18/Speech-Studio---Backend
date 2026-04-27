import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerTranscriptionHandlers } from "./socket/transcription.js";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://speech-studio-frontend-xabg.vercel.app/"],
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Amatyaa STT Server Running 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "amatyaa-stt" });
});

// Socket connection
io.on("connection", (socket) => {
  try {
    console.log(`[Socket] Client connected: ${socket.id}`);
    registerTranscriptionHandlers(socket);
  } catch (err) {
    console.error("Socket error:", err);
  }

  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Express error handler
app.use((err, req, res, next) => {
  console.error("Express Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`[Server] Amatyaa STT running on port ${PORT}`);
});

