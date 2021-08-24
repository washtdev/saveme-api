import { Schema, model, Document } from "mongoose";

import { IUserModel } from "@models/UserModel";

export interface IActivityModel extends Document {
	user: IUserModel;
	title: string;
	description: string;
	subject: string;
	haveFile: Boolean;
	likes: Array<IUserModel>;
	_id: string;
}

const ActivityModel = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	title: {
		type: String,
		required: true
	},

	description: String,

	subject: {
		type: String,
		required: true
	},

	haveFile: {
		type: Boolean,
		required: true
	},

	likes: [
		{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	]
}, { timestamps: true });

export default model("Activity", ActivityModel);