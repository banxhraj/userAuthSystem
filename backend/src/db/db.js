import mongoose from "mongoose";
import 'dotenv/config';


const connectDB = async () => {

mongoose.connection.on('connected', ()=> console.log('database connected sucsessfully !'))

    await mongoose.connect(`${process.env.MONGO_URI}/Auth`)
}


export default connectDB;