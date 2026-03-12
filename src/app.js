import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

export const app = express();


app.use(cors({
    origin:'*',
    credentials:true
}))
app.use(express.json({limit:'16kb'}))
app.use(express.urlencoded({extended:false,limit:"16kb"}))
app.use(cookieParser());
app.use(express.static('public'));