import * as Router from 'koa-router';
import { drawingRouter } from './drawing';
import { userRouter } from './user';
import { authRouter } from './authentication';

export const router = new Router()
	.prefix("/api")
	.use(drawingRouter.routes())
	.use(userRouter.routes())
	.use(authRouter.routes())