import { Schema, model, Document } from "mongoose";
import { IUserModel } from "./UserModel";

export interface ITokenModel extends Document {
    user: IUserModel;
}

const TokenModel = new Schema<ITokenModel>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default model<ITokenModel>("Token", TokenModel);