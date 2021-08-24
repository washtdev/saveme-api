import { Document, Schema, model } from "mongoose";

import { IUserModel } from './UserModel';
import { IActivityModel } from './ActivityModel';

export interface INotificationModel extends Document {
    author: IUserModel;
    user: IUserModel;
    activity: IActivityModel;
}

const NotificationModel = new Schema<INotificationModel>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    liked_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }
}, { timestamps: true });

export default model<INotificationModel>('Notification', NotificationModel)
