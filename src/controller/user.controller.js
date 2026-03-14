import asyncHandler from "../utils/asyncHandler.js";
import APIError from '../utils/apiError.js'
import USER from "../models/user.model.js";
import uploadToCloud from "../utils/cloudinary.config.js";
import APIResponse from "../utils/apiResponse.js";
import { generateAccessAndRefreshToken } from "../utils/generateAccessAndRefreshToken.js";

export const registerUser = asyncHandler(async (req,res) =>{
    const {fullName,username,email,password} = req.body;

    if(
        [fullName,username,email,password].some((field)=>{
            return field.trim() ==="";
        })
    ){
        throw new APIError(400,"Every Field is required");
    }

    if(await USER.findOne({
        $or: [{'email':email}, {'username':username}]
    })){
        throw new APIError(409,"User already exists. Try to login");
    }

    const avatar = await req.files?.avatar?.[0]?.path;
    const coverImage = await req.files?.coverImage?.[0]?.path;

    if(!avatar){
        throw new APIError(400,"Every Field is required");
    }

    const avatarUrl = (await uploadToCloud(avatar))?.url
    let coverImageUrl;
    if(coverImage){
        coverImageUrl = (await uploadToCloud(coverImage))?.url
    }

    const user = await USER.create({
        username: username,
        fullName: fullName,
        password: password,
        email: email,
        avatar: avatarUrl,
        coverImage: coverImage?coverImageUrl:"",
    });

    const userCreated = await USER.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!userCreated) throw new APIError(404,"User could nor be found");


    return res.status(201).json(new APIResponse(201,userCreated,"New User created"));

})

export const login = asyncHandler( async (req,res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) throw new APIError(400,"All fields are required");

    const user = await USER.findOne({
        $or: [
            {username:username},
            {email:email}
        ]
    })

    if(!user) throw new APIError(404,"User doesn't exist. Create one.");

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid) throw new APIError(401,"User trying to login is Unauthorized");

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user);

    const {fullName,avatar,coverImage,watchHistory, ...newObj} = user 
    newObj.username = username;
    newObj.email = email

    const options = {
        httpOnly:true,
        secure:true,
    }

    res
    .status(200)
    .cookie('accessToken',accessToken,options)
    .cookie('refreshtoken',refreshToken,options)
    .json(new APIResponse(200,{
        ...newObj,
        accessToken,
        refreshToken,
    },"User logged in successfully"))


})

export const logout = async (req,res) =>{
    const userId = req.userId;

    await USER.findByIdAndUpdate({"_id":userId},
        {
            $set:{"refreshToken":""},
        })

       const options = {
        httpOnly:true,
        secure:true,
    }
     res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshtoken',options)
    .json(new APIResponse(200,{},"User logged in successfully"))
}

