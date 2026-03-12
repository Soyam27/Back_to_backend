import mongoose from 'mongoose';

export const connectDb = async (URI) =>{
    try{
        const connectionInstance = await mongoose.connect(URI);
        console.log(`Database connect to host: ${connectionInstance?.connection?.host}`)
    }catch(err){
        console.log(`error detected in connection ${err}`);
        process.exit(1);
    }
}