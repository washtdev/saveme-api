import { Schema, model, Document, HookNextFunction } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserModel extends Document {
	username: string;
	password?: string;
	email: string;
	likes: number;
	_id: string;
}

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},

	password: {
		type: String,
		required: true
	},

	email: {
		type: String,
		unique: true,
		required: true
	},

	likes: {
		type: Number,
		required: true
	}
}, { timestamps: true });

UserSchema.pre<IUserModel>('save', async function(next) {
	const hash = await bcrypt.hash(this.password!, 10);
	this.password = hash;

	next();
});

export default model<IUserModel>("User", UserSchema);