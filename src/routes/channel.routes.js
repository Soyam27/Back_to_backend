import express from 'express';
import {verifyJwt} from '../middlewares/verifyJwt.js'
import {getUserSubsDetails, subscribeHandler} from '../controller/channel.controller.js'

export const channelRouter = express.Router();

channelRouter.use(verifyJwt);
channelRouter.route("/subscribe").post(subscribeHandler);
channelRouter.route("/c/:user_id").post(getUserSubsDetails);
// channelRouter.route("/unsubscribe").post(unsubscribeHandler);