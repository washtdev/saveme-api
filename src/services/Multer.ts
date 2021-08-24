import { Request, Express } from "express";
import Multer, { diskStorage, FileFilterCallback } from "multer";
import { resolve } from "path";

export default Multer({
    dest: resolve(__dirname, '..', '..', 'tmp'),
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    storage: diskStorage({
        filename: async (request: Request, file: Express.Multer.File, callback) => {
            const { id } = request.params;

            callback(null, id + '.pdf');
        },

        destination: (request: Request, file: Express.Multer.File, callback) => {
            callback(null, resolve(__dirname, '..', '..', 'tmp'));
        }
    }),
    fileFilter: (request: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
        const AllowedMimes = [
            'application/pdf'
        ];

        if(AllowedMimes.includes(file.mimetype)){
            callback(null, true);
        }
    }
});