import { Request, Response } from "express";

import MailConfig from "../services/MailConfig";

import TokenModel from "../models/TokenModel";
import UserModel from "../models/UserModel";

import "dotenv/config";

type ITokenBody = {
    email: string
};

export default async function(request: Request, response: Response){
    const { email } = request.body as ITokenBody;

    const user = await UserModel.findOne({ email });

    if(!user){
        return response.status(404).json({ message: 'user not found!' });
    }

    const token = await TokenModel.create({ user: user._id });

    if(!token){
        return response.status(400).json({ message: 'failed to generate token!' });
    }

    const config = {
        from: process.env["EMAIL"],
        to: email,
        subject: 'Recuperação de Senha do SaveMe',
        text: `Clique no link e escolha uma nova senha: ${process.env["ADDRESS"]}/forgot-password/${token._id}`
    };

    await MailConfig.sendMail(config);

    return response.json({
        message: 'token generated successfully!',
        token
    });
}