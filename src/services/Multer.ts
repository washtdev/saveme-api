import { Request, Express } from "express";
import Multer, { diskStorage, FileFilterCallback } from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import { resolve } from "path";

import "dotenv/config";

const storageTypes = {
    'local': diskStorage({
        filename: async (request: Request, file: Express.Multer.File, callback) => {
            const { id } = request.params;

            callback(null, id + '.pdf');
        },

        destination: (request: Request, file: Express.Multer.File, callback) => {
            callback(null, resolve(__dirname, '..', '..', 'tmp'));
        }
    }),
    's3': multerS3({
        s3: new aws.S3(),
        bucket: 'saveme',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: async (request: Request, file: Express.Multer.File, callback) => {
            const { id } = request.params;

            callback(null, id + '.pdf');
        },
    })
}

export default Multer({
    dest: resolve(__dirname, '..', '..', 'tmp'),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    storage: storageTypes['s3'],
    fileFilter: (request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        const AllowedMimes = [
            'application/pdf'
        ];

        if(AllowedMimes.includes(file.mimetype)){
            callback(null, true);
        }
    }
});