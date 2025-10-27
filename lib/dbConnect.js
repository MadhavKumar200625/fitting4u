import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

let isConnected = null;

export default async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "fitting4u",
    });

    isConnected = db.connections[0].readyState;
    console.log("MongoDB Connected:", db.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    throw new Error("MongoDB connection failed");
  }
}