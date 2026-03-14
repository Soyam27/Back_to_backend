import express from 'express';
import { registerUser } from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

export const userRouter = express.Router()

userRouter.route("/register").post(upload.fields(
    [
        {name: 'avatar', maxCount: 1},
        {name: 'coverImage', maxCount: 1}
    ]
),registerUser)