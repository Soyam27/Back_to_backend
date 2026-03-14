import asyncHandler from "../utils/asyncHandler.js";
import APIError from '../utils/apiError.js'
import USER from "../models/user.model.js";
import uploadToCloud from "../utils/cloudinary.config.js";
import APIResponse from "../utils/apiResponse.js";

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
        $or: [{'email':email}, {'fullName':fullName}]
    })){
        throw new APIError(409,"User already exists. Try to login");
    }

    const avatar = await req.files?.avatar[0]?.path;
    const coverImage = await req.files?.coverImage[0]?.path;

    if(!avatar){
        throw new APIError(400,"Every Field is required");
    }

    const avatarUrl = (await uploadToCloud(avatar)).url
    let coverImageUrl;
    if(coverImage){
        coverImageUrl = (await uploadToCloud(coverImage)).url
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