import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/user.routes.js';
import { channelRouter } from './routes/channel.routes.js';

export const app = express();


app.use(cors({
    origin:'*',
    credentials:true
}))

app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(express.static('public'));

app.use("/user",userRouter)
app.use("/channel",channelRouter)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});