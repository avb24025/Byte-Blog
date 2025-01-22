const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const connectDB = require("./connection/db");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());
connectDB();


const server = http.createServer(app);

// Set up Socket.IO on the same server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
    credentials: false, // Disable credentials for open access
  },
});
/


// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB


// Define routes
app.use("/api/user", userRoutes);
app.use("/api/blogs", blogRoutes);

// WebSocket connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for new messages
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message); // Broadcast the message to all clients
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server (REST API + WebSocket)
server.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
