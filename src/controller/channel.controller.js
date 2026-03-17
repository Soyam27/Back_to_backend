import SUBSCRIBTION from "../models/subscription.model.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import USER from "../models/user.model.js";

export const subscribeHandler = asyncHandler(async (req,res) =>{
    const userId = req.userId;
    const {channelUserName} = req.body;

    if(!(userId && channelUserName)) throw new APIError(400,"current user and channel name is required");

    const channelId =await USER.findOne({
        username: channelUserName
    });

    if(!channelId) throw new APIError(404,"Channel not found");

    console.log(channelId._id);
    console.log(userId);

    const check = await SUBSCRIBTION.findOne(
       {$and: [
        {subscriber:userId},
        {channel:channelId._id}
        ]}
    );
    if(check) throw new APIError(409,"user Already subscribed to this channel");
    
    const response = await SUBSCRIBTION.create({
        subscriber:userId,
        channel:channelId
    });

    res.status(201).json(
        new APIResponse(201,response,"channel Subscribed")
    )
})