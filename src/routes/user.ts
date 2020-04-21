import { User } from "../entity/User";
import Router = require("koa-router");
import { validate, ValidationError } from "class-validator";

function formatValidationErrors(validationErrors: ValidationError[]) {
	return validationErrors
		.reduce(
			(accum, validationError) => {
				return {
					...accum,
					[validationError.property]: Object.values(validationError.constraints)[0]
				}
			} 
		,{})
}

export const userRouter = new Router()
	.prefix("/user")
	.post('/', async (ctx) => {
		const user = new User();
		user.firstName = ctx.request.body.firstName
		user.lastName = ctx.request.body.lastName
		user.email = ctx.request.body.email
		user.password = ctx.request.body.password

		const errors = await validate(user);
		if(errors.length > 0){
			ctx.status = 422
			ctx.body = { errors: formatValidationErrors(errors) }
			return
		}

		try {
			await user.save()
			delete user.password
			ctx.status = 201
			ctx.body = user;
		} catch (error) {
			ctx.status = 400
		}
	})
	.patch('/:id', async (ctx) => {
		const user = await User.findOne({ id: ctx.params.id })
		user.firstName = ctx.request.body.firstName
		user.lastName = ctx.request.body.lastName
		user.email = ctx.request.body.email
		await user.save()
		ctx.body = user;
	})
	.get('/:id', async (ctx) => {
		const user = await User.findOne({ id: ctx.params.id })
		if (typeof user === "undefined") {
			ctx.status = 404
		} else {
			ctx.body = user;
		}
	});