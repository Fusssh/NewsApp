import mongoose from "mongoose";
export const connectMongoDB = async () => {
    try {
      console.log("Attempting to connect to MongoDB...");
      console.log("Connection string:", process.env.MONGODB_URL);
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("Connected to DB successfully");
    } catch (error) {
      console.log("Error connecting to DB:", error.message);
    }
  };
  