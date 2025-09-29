import mongoose, { Connection } from "mongoose";

// Global cached connection and promise
let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

export const connect = async (): Promise<typeof mongoose> => {
  if (cachedConnection) {
    console.log("🔄 Using existing MongoDB connection");
    return cachedConnection;
  }

  if (!cachedPromise) {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in environment variables.");
    }

    console.log("🔌 Establishing new MongoDB connection...");
    cachedPromise = mongoose.connect(process.env.MONGO_URI);
  }

  cachedConnection = await cachedPromise;

  const connection: Connection = mongoose.connection;

  connection.on("connected", () => {
    console.log("✅ MongoDB Connected Successfully");
  });

  connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    cachedConnection = null;
    cachedPromise = null;
  });

  connection.on("disconnected", () => {
    console.log("🔌 MongoDB Disconnected");
    cachedConnection = null;
    cachedPromise = null;
  });

  return cachedConnection;
};

// Connection status helper
export const getConnectionStatus = (): number => {
  return mongoose.connection.readyState;
  // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
};

// Close connection manually
export const disconnect = async (): Promise<void> => {
  if (cachedConnection) {
    await mongoose.disconnect();
    cachedConnection = null;
    cachedPromise = null;
    console.log("🔌 MongoDB connection closed");
  }
};
