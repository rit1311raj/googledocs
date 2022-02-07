
import mongoose from "mongoose";

const Connection = async (URL) => {
    
    
    try{
       await mongoose.connect(URL,{useUnifiedTopology: true});
       console.log("Database connected Succesfully...")
    } catch(error){
        console.log("Error while connecting with database",error);
    }
}
export default Connection;