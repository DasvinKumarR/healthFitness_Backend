import mongoose from "mongoose";
import dotenv from 'dotenv'
// env file configuration
dotenv.config();
// Storing db url to const variable
const DB_URL = process.env.DB_URL;
// function to connect mongoose db
export const connectDB = async () => {
    await mongoose.connect(DB_URL)
    .then(() => {console.log("DB connected successfully")})
    .catch((err) => {console.log(err)});
}