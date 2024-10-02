import mongoose from "mongoose";

const connectToDatabase = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;
