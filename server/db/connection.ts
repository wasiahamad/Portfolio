import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log("Using existing MongoDB connection");
    return;
  }

  if (!MONGODB_URI) {
    console.warn("MongoDB URI not set. Running without database.");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export { mongoose };
