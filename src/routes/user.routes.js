import express from 'express';
import { registerUser,login, logout } from '../controller/user.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import { verifyJwt } from '../middlewares/verifyJwt.js';

export const userRouter = express.Router()

userRouter.route("/register").post(upload.fields(
    [
        {name: 'avatar', maxCount: 1},
        {name: 'coverImage', maxCount: 1}
    ]
),registerUser)
userRouter.route('/login').post(login);
userRouter.route('/logout').post(verifyJwt,logout);