require("dotenv").config({ path: "./data.env" }); // Load environment variables from data.env
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Loading MongoDB URI:", process.env.MONGO_URI); // Debugging line

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in data.env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
