import APIError from "../utils/apiError.js";
import jwt, { decode } from 'jsonwebtoken';
import asyncHandler from "../utils/asyncHandler.js";
import USER from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req,res,next) =>{
    const {accessToken} = req.cookies;

    if(!accessToken) throw new APIError(401,"User is anuthorized");

    const decoded =  jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    
    if(!decoded) throw new APIError(404,"Invalid AccessToken");

    const {_id} = decoded;

    const user = await USER.findOne({"_id":_id});
    
    if(!user) throw new APIError(404,"No User Found With given accesstoken");

    req.userId = user._id;
    next();
})