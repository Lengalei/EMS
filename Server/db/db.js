import mongoose from "mongoose";

const connectToDatabase = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('server connected DB successfully')
  } catch (error) {
    console.log(error);
  }
};

export default connectToDatabase;
