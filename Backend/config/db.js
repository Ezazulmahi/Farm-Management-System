const connectDB = async () => {
    try {
      console.log("🔄 Connecting to MongoDB...");
      
      const conn = await mongoose.connect(process.env.MONGO_URI); // ✅ Remove deprecated options
  
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error("❌ MongoDB Connection Error:", error.message);
      process.exit(1); // Exit process if connection fails
    }
  };

  
  