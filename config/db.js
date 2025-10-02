const mongoose = require("mongoose");

const connectDb = async () => {
  try {
   const conn = await mongoose.connect(process.env.MONGO_URI, {
      w:1
   });

    console.log(`Mongodb connected: ${conn.connection.host}`);

  } catch (error) {
    console.log(`error connecting to Mongdb: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDb