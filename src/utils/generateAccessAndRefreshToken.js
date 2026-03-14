import USER from "../models/user.model.js";
import APIError from "./apiError.js";
import asyncHandler from "./asyncHandler.js";

export const generateAccessAndRefreshToken = async (user) =>{
    try{
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        if(!accessToken || !refreshToken) throw new APIError(400,"Token generation error");
    
        user.refreshToken = refreshToken;
        user.save({validateBeforeSave:false});
        return {accessToken,refreshToken};
    }
    catch(err){
        console.log(err)
        throw new APIError(500,"Internal Server Error");
    }
}