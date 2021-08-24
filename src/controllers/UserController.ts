import { Request, Response } from "express";

import bcrypt from 'bcrypt';

import UserModel from "../models/UserModel";
import TokenModel, { ITokenModel } from "../models/TokenModel";

type IUserBody = {
	username: string,
	password?: string,
	email: string
};

type IUserParams = {
	token: string
};

class UserController {
	async index(request: Request, response: Response) {
		const users = await UserModel.find().sort('-likes') as Array<IUserBody>;

		for(const user of users){
			user.password = undefined;
		}

		return response.json(users);
	}

	async store(request: Request, response: Response) {
		const { username, password, email } = request.body as IUserBody;

		const user = await UserModel.create({
			username,
			password,
			email,
			likes: 0
		}) as IUserBody;

		if(!user){
			response.status(400).json({ message: 'failed to create user!' });
		}

		user.password = undefined;

		return response.json({
			message: 'user created successfully!',
			user
		});
	}

	async update(request: Request, response: Response) {
		const { password } = request.body as IUserBody;
		const { token } = request.params as IUserParams;

		const { user } = await TokenModel.findById(token) as ITokenModel;
		await TokenModel.findByIdAndDelete(token);

		if(!user){
			return response.status(404).json({ message: 'user not found!' });
		}
		
		const password_encrypted = await bcrypt.hash(password!, 10);

		const user_updated = await UserModel.findByIdAndUpdate(user._id, { password: password_encrypted }) as IUserBody;

		if(!user_updated){
			return response.status(400).json({ message: 'failed to update user!' });
		}

		user_updated.password = undefined;

		return response.json({
			message: 'user updated successfully!',
			previous_user: user_updated
		});
	}
}

export default new UserController();
