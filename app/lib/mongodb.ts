import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    await mongoose.connect(process.env.DATABASE_URL as string);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", (error as Error).message);
    process.exit(1);
  }
};

export default connectDB;