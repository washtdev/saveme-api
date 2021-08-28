import { Request, Response, NextFunction } from "express";

import ActivityModel from "../models/ActivityModel";
import { IActivityModel } from "../models/ActivityModel";

type IUserId = Request & {
    userId?: string
}

export default async function(request: Request, response: Response, next: NextFunction){
    const { userId } = request as IUserId;
    const { id } = request.params;

    const activity = await ActivityModel.findById(id).populate('user') as IActivityModel;

    if(!activity){
        return response.status(404).json({ message: 'activity not found!' });
    }

    if(!activity.haveFile){
        return response.status(400).json({ message: 'activity not have file!' });
    }

    if(!(activity.user._id == userId)){
        console.log(activity.user._id + ' and ' + userId)
        return response.status(403).json({ message: 'unauthorized file submission!' });
    }

    return next();
}
