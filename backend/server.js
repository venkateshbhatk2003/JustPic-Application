const app = require("./app");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error("Shutting down the server due to uncaught exception");
  process.exit(1);
});

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: "config/.env",
  });
}

connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Promise Rejection: ${err.message}`);
  console.error("Shutting down the server due to unhandled promise rejection");
  
  server.close(() => {
    process.exit(1);
  });
});
