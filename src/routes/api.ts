import * as Router from 'koa-router';
import { drawingRouter } from './drawing';
import { userRouter } from './user';

export const router = new Router()
	.prefix("/api")
	.use(drawingRouter.routes())
	.use(userRouter.routes())