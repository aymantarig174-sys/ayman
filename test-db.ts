import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
console.log("Testing connection with URI:", uri ? uri.replace(/:([^@]+)@/, ":****@") : "undefined");

if (!uri) {
  console.error("No MONGODB_URI found.");
  process.exit(1);
}

async function test() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected to MongoDB successfully!");
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: Could not connect to MongoDB:", error);
    process.exit(1);
  }
}

test();
