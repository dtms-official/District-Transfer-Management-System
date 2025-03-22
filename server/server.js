const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 8000;
let HOST = process.env.HOST || "http://localhost:3000";
HOST = HOST.includes("localhost:3000") ? "http://localhost" : HOST;

const NODE_ENV = process.env.NODE_ENV || "development";
const serverStartTime = Date.now();

app.listen(PORT, () => {
  console.log(`🚀 Server started in ${Date.now() - serverStartTime}ms`);
  console.log(`🚀 Server running on ${HOST}:${PORT} in ${NODE_ENV} mode`);
});

// Graceful shutdown handler
process.on("SIGINT", () => {
  const serverEndTime = new Date();
  const duration = (serverEndTime - serverStartTime) / 1000; // Convert milliseconds to seconds
  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60);
  const hours = Math.floor(minutes / 60);

  console.log(`🛑 Server stopped after ${hours}h ${minutes % 60}m ${seconds}s`);
  process.exit(0);
});
//