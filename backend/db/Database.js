const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    })
    .then(() => {
      console.log(`MongoDB connected to: ${process.env.DB_URL}`);
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB error:", error);
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("MongoDB connection is closed due to app termination");
      process.exit(0);
    });
  });
};

module.exports = connectDatabase;
