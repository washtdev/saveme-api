declare namespace Express {
	export interface Request {
		userId: string;
		file: {
			location: string;
		};
	}
}