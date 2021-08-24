import { Request, Response } from "express";

import NotificationModel from "@models/NotificationModel";

import { ITokenRequest } from "@controllers/AuthControllers";

export default async function NotificationController(request: ITokenRequest, response: Response){
    const author = request.userId;

    const notifications = await NotificationModel.find().where('author').equals(author).populate('author').populate('liked_user').populate('activity');

    await NotificationModel.deleteMany().where('author').equals(author);

    return response.json(notifications);
}
