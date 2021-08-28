import { Request, Response } from "express";
import { ParsedQs } from "qs";
import aws from "aws-sdk";

import { io } from "../index";

import { ITokenRequest } from "./AuthController";

import ActivityModel from "../models/ActivityModel";
import { IActivityModel } from "../models/ActivityModel";
import UserModel, { IUserModel } from "../models/UserModel";
import NotificationModel from "../models/NotificationModel";
import { DeleteObjectRequest } from "aws-sdk/clients/clouddirectory";

type IActivityIndexQuery = ParsedQs & {
	title?: string,
	subject?: string,
	page?: number
};

type IActivityParams = {
	id: string
};

type IActivityBody = {
	userId?: string,
	title?: string,
	description: string,
	subject?: string,
	haveFile: boolean,
	like?: Array<string>
};

type IUserId = Request & {
	userId?: string
}

const s3 = new aws.S3();

class ActivityController {
	async index(request: Request, response: Response) {
		const { title, subject, page } = request.query as IActivityIndexQuery;

		const exact_page = page || 0;

		let activities;

		if(!subject){
			if(!title){
				activities = await ActivityModel.find().sort('-createdAt').populate('user').skip((exact_page - 1) * 10).limit(10) as Array<IActivityModel>;
			} else {
				activities = await ActivityModel.find({ title: new RegExp('^' + title) }).sort('-createdAt').populate('user') as Array<IActivityModel>;
			}
		}

		if(!activities){
			if(!title){
				activities = await ActivityModel.find({ subject }).sort('-createdAt').populate('user').skip((exact_page - 1) * 10).limit(10) as Array<IActivityModel>;
			} else {
				activities = await ActivityModel.find({ subject, title: new RegExp('^' + title) }).sort('-createdAt').populate('user') as Array<IActivityModel>;
			}
		}

		for(const activity of activities){
			activity.user.password = undefined;
		}

		const count = await ActivityModel.estimatedDocumentCount();

		return response.json({
			activities,
			pages: Math.ceil(count / 10)
		});
	}

	async show(request: Request, response: Response) {
		const { id } = request.params as IActivityParams;

		const activity = await ActivityModel.findById(id).populate('user');

		if(!activity){
			return response.status(404).json({ message: 'activity not found!' });
		}

		activity.user.password = undefined;

		return response.json(activity);
	}

	async store(request: Request, response: Response) {
		const { title, description, subject, haveFile } = request.body as IActivityBody;
		const { userId } = request as IUserId;

		const activity_create = await ActivityModel.create({
			user: userId,
			title,
			description,
			subject,
			haveFile,
			url: '',
			likes: []
		});
		
		const activity = await ActivityModel.findById(activity_create._id).populate('user');

		if(!activity){
			return response.status(400).json({ message: 'failed to create activity!' });
		}

		activity.user.password = undefined;

		io.emit('activity', activity);

		return response.json({
			message: 'activity created successfully!',
			activity
		});
	}

	async update(request: Request, response: Response) {
		const body = request.body;
		const { id } = request.params;
		const { userId } = request as ITokenRequest;

		const activity = await ActivityModel.findById(id).populate('user');

		if(!activity){
			return response.status(404).json({ message: 'activity not found!' });
		}

		if(!(activity.user._id == userId)){
			return response.status(403).json({ message: 'unauthorized user to update activity' });
		}
		
		if(activity.haveFile){
			/*unlinkSync(resolve(__dirname, '..', '..', 'tmp', activity._id + '.pdf'));*/
			await s3.deleteObject({
				Bucket: 'saveme',
				Key: activity._id + '.pdf'
			});
		}

		const previous_activity = await ActivityModel.findByIdAndUpdate(id, body).populate('user');

		io.emit('update activity', activity);

		return response.json(activity);
	}

	async like(request: Request, response: Response) {
		const { id } = request.params as IActivityParams;
		const { userId } = request as IUserId;

		const { likes } = await ActivityModel.findById(id) as IActivityModel;

		const activity_updated = await ActivityModel.findByIdAndUpdate(id, likes.includes(userId) ? { $pull: { likes: userId } } : { $push: { likes: userId } }).populate('user');

		if(!activity_updated){
			return response.status(400).json({ message: 'failed to update activity!' });
		}
		
		const liked_user = await UserModel.findById(userId) as IUserModel;

		let user;

		if(likes.includes(userId)){
			user = await UserModel.findById(activity_updated.user._id) as IUserModel;
			user.likes--;
			await UserModel.findByIdAndUpdate(user._id, { likes: user.likes });
		} else {
			user = await UserModel.findById(activity_updated.user._id) as IUserModel;
			user.likes++;
			await UserModel.findByIdAndUpdate(user._id, { likes: user.likes });

			const like = await NotificationModel.create({
				author: user._id,
				liked_user: liked_user._id,
				activity: activity_updated._id
			});

			io.emit('like', like);
		}

		activity_updated.user.password = undefined;

		return response.json({ 
			message: 'activity updated successfully!',
			previous_activity: activity_updated
		 });
	}

	async delete(request: Request, response: Response) {
		const { id } = request.params as IActivityParams;
		const { userId } = request as IUserId;

		const activity = await ActivityModel.findById(id);

		if(!activity){
			return response.status(400).json({ message: 'failed to delete activity!' });
		}

		if(!(activity.user._id == userId)){
			return response.status(403).json({ message: 'unauthorized user to delete activity!' })
		}

		await ActivityModel.findByIdAndDelete(id);

		if(activity.haveFile){
			await s3.deleteObject({
				Bucket: 'saveme',
				Key: activity._id + '.pdf'
			});
		}
		
		io.emit('delete activity', activity);

		return response.status(204).send();
	}
}

export default new ActivityController();