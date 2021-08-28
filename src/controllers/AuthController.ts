// @ts-ignore
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/UserModel";
import { IUserModel } from "../models/UserModel";

import "dotenv/config";

type ISignInBody = {
    email: string,
    password: string
};

type ITokenPayload = {
    id: string,
    iat: number,
    exp: number
};

export interface ITokenRequest extends Request {
    userId: string;
}; 

class AuthController {
    async signIn(request: Request, response: Response){
        const { email, password } = request.body as ISignInBody;

        const user = await UserModel.findOne({ email }) as IUserModel;

        if(!user){
            return response.status(404).json({ message: 'user not found!' });
        }

        if(!await bcrypt.compare(password, user.password!)){
            return response.status(403).json({ message: 'the password does not belong to that user' });
        }

        const token = jwt.sign({ id: user._id }, process.env["SECRET"] as string, {});

        user.password = undefined;

        return response.json({ user, token });
    }

    async auth(request: Request, response: Response, next: NextFunction){
        const { authorization } = request.headers;

        if(!authorization){
            return response.status(400).json({ message: 'malformatted token!' });
        }

        const token = authorization.trim().split(' ');

        if(token.length !== 2 && token[0] !== 'Bearer'){
            return response.status(400).json({ message: 'malformatted token!'});
        }

        try {
            const data = jwt.verify(token[1], process.env["SECRET"] as string);

            const { id } = data as ITokenPayload;

            request.userId = id;

            return next();
        } catch {
            return response.status(401).json({ message: 'invalid token!' })
        }
    }
}

export default new AuthController();