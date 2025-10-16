import mongoose, { Connection, ConnectOptions } from "mongoose";

// Global cached connection and promise
let cachedConnection: typeof mongoose | null = null;
let cachedPromise: Promise<typeof mongoose> | null = null;

// Connection options compatible with Mongoose 6+
const connectionOptions: ConnectOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  bufferCommands: false,
  family: 4, // IPv4
};

export const connect = async (): Promise<typeof mongoose> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log("🔄 Using existing MongoDB connection");
    return cachedConnection;
  }

  if (cachedPromise) {
    console.log("⏳ Waiting for existing connection promise...");
    cachedConnection = await cachedPromise;
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("❌ MONGO_URI is not defined in environment variables.");
  }

  console.log("🔌 Establishing new MongoDB connection...");

  try {
    cachedPromise = mongoose.connect(process.env.MONGO_URI, connectionOptions);
    cachedConnection = await cachedPromise;

    const connection: Connection = mongoose.connection;

    connection.once("connected", () => {
      console.log("✅ MongoDB Connected Successfully");
      console.log(`📊 Connection state: ${connection.readyState}`);
    });

    connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      handleConnectionError(err);
    });

    connection.on("disconnected", () => {
      console.log("🔌 MongoDB Disconnected");
      if (!isShuttingDown) {
        cachedConnection = null;
        cachedPromise = null;
      }
    });

    setupGracefulShutdown();

    return cachedConnection;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    cachedPromise = null;
    cachedConnection = null;
    throw error;
  }
};

// Connection status helper
export const getConnectionStatus = (): {
  readyState: number;
  status: string;
  isConnected: boolean;
} => {
  const readyState = mongoose.connection.readyState;
  return {
    readyState,
    status: getReadyStateDescription(readyState),
    isConnected: readyState === 1,
  };
};

const getReadyStateDescription = (state: number): string => {
  switch (state) {
    case 0: return "disconnected";
    case 1: return "connected";
    case 2: return "connecting";
    case 3: return "disconnecting";
    default: return "unknown";
  }
};

// Connection error handling
const handleConnectionError = (err: unknown): void => {
  if (err instanceof Error) {
    console.error("💥 Connection error details:", {
      message: err.message,
      name: err.name,
      code: (err as { code?: string }).code,
    });

    if (err.name === "MongoNetworkError" || err.name === "MongoServerSelectionError") {
      console.log("🔄 Attempting to reconnect...");
      cachedConnection = null;
      cachedPromise = null;
      connect().catch(console.error);
    }
  } else {
    console.error("💥 Unknown connection error:", err);
  }
};


let isShuttingDown = false;

// Graceful shutdown
const setupGracefulShutdown = () => {
  const gracefulShutdown = async (signal: string) => {
    console.log(`🛑 Received ${signal}. Closing MongoDB connection...`);
    isShuttingDown = true;
    try {
      await mongoose.disconnect();
      console.log("🔌 MongoDB connection closed gracefully");
      process.exit(0);
    } catch (error) {
      console.error("❌ Error during graceful shutdown:", error);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
};

// Disconnect manually
export const disconnect = async (): Promise<void> => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    try {
      await mongoose.disconnect();
      cachedConnection = null;
      cachedPromise = null;
      console.log("🔌 MongoDB connection closed manually");
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error);
      throw error;
    }
  }
};

// Force reconnection
export const reconnect = async (): Promise<typeof mongoose> => {
  console.log("🔄 Forcing reconnection...");
  cachedConnection = null;
  cachedPromise = null;
  return await connect();
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const status = getConnectionStatus();
    if (!status.isConnected) {
      await connect();
    }
    return mongoose.connection.readyState === 1;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

// Export mongoose instance
export const getMongooseInstance = (): typeof mongoose => {
  if (!cachedConnection) {
    throw new Error("❌ Mongoose not connected. Call connect() first.");
  }
  return cachedConnection;
};

// Export connection object
export const getConnection = (): Connection => {
  return mongoose.connection;
};
