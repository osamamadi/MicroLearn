import mongoose from "mongoose"; // Imports the Mongoose library

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("⚠️ MONGODB_URI is missing from environment variables");
  throw new Error("Missing MONGODB_URI");
}
console.log(MONGODB_URI);
if (process.env.NODE_ENV !== "production") {
  console.log("MONGODB_URI =", MONGODB_URI);
}

// ... (Error handling if MONGODB_URI is missing) ...

let cached = global.mongoose; // Tries to get a cached connection from a global object

if (!cached) {
  // If no cached connection exists yet
  cached = global.mongoose = { conn: null, promise: null }; // Initialize the cache
}

async function dbConnect() {
  if (cached.conn) {
    // If there's already a live connection
    return cached.conn; // Return the existing connection
  }

  if (!cached.promise) {
    // If there's no pending connection promise
    const opts = {
      bufferCommands: false, // Recommended for serverless environments like Next.js API Routes
    };

    // Start the connection process and store the promise
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully."); // Log successful connection
      return mongoose;
    });
  }
  cached.conn = await cached.promise; // Wait for the connection to complete
  return cached.conn;
}

export default dbConnect; // Makes the dbConnect function available to other files
