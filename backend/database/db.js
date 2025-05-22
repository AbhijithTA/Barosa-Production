require('dotenv').config()
const mongoose=require("mongoose")

exports.connectToDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // 30 seconds timeout
  socketTimeoutMS: 45000,         // 45 seconds socket timeout
  connectTimeoutMS: 30000,        // 30 seconds initial connection timeout
  maxPoolSize: 10,                // Limit connection pool size
  family: 4,                      // Force IPv4 (some networks have IPv6 issues)
});

        console.log('connected to DB');
    } catch (error) {
        console.log(error);
    }
}