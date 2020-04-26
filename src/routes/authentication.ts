import Router = require("koa-router");
import { User } from "../entity/User";
import bcrypt = require("bcrypt")

export const userRouter = new Router()
	.prefix("/authenticate")
	.post('/local', async (ctx) => {
			const {email, password} = ctx.body
		const userToLogin = await User.findOne({email})
		const isPasswordValid = await bcrypt.compare(password, userToLogin.password)
		}
	)