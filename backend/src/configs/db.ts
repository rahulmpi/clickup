import mongoose from "mongoose";

export const connectDb = async () =>{
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log('DB Connected')
  } catch (error) {
    console.log('Error connecting Database')
  }
}
