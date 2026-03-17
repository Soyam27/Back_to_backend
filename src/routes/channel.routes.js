import express from 'express';
import {verifyJwt} from '../middlewares/verifyJwt.js'
import {subscribeHandler} from '../controller/channel.controller.js'

export const channelRouter = express.Router();

channelRouter.use(verifyJwt);
channelRouter.route("/subscribe").post(subscribeHandler);
// channelRouter.route("/unsubscribe").post(unsubscribeHandler);