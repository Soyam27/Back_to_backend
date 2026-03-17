import SUBSCRIBTION from "../models/subscription.model.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import USER from "../models/user.model.js";
import mongoose from "mongoose";

export const subscribeHandler = asyncHandler(async (req,res) =>{
    const userId = req.userId;
    const {channelUserName} = req.body;

    if(!(userId && channelUserName)) throw new APIError(400,"current user and channel name is required");

    const channelId =await USER.findOne({
        username: channelUserName
    });

    if(!channelId) throw new APIError(404,"Channel not found");

    const check = await SUBSCRIBTION.findOne(
       {$and: [
        {subscriber:userId},
        {channel:channelId._id}
        ]}
    );
    if(check) throw new APIError(409,"user Already subscribed to this channel");
    
    const response = await SUBSCRIBTION.create({
        subscriber:userId,
        channel:channelId._id
    });

    res.status(201).json(
        new APIResponse(201,response,"channel Subscribed")
    )
})

export const getUserSubsDetails = asyncHandler(async(req,res) =>{
    const {user_id} = req.params;

    const channelDetails = await USER.aggregate([
        {$match:
            {
                _id: new mongoose.Types.ObjectId(user_id)

            }
        },
        {
            $lookup:{
                from: 'subscribtions',
                localField:'_id',
                foreignField:'channel',
                as:'subscribersData'
            }
        },
        {
            $lookup:{
                from: 'subscribtions',
                localField:'_id',
                foreignField:'subscriber',
                as:'subscriberedToData'
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size: '$subscribersData'
                },
                subscribedToCount:{
                    $size: '$subscriberedToData'
                }
            }
        }
    ])

    if(!channelDetails.length) throw new APIError(404,"User not found");

    console.log(channelDetails);
    res.status(200).json(new APIResponse(200,channelDetails,"Usef found and sent"));
})