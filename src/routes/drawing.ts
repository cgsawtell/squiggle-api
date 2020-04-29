import { Drawing } from "../entity/Drawing";
import * as Router from "koa-router";
import * as passport from "koa-passport";

export const drawingRouter = new Router()
	.post('/drawing', passport.authenticate("jwt", { session: false }), async (ctx) => {
		const drawing = new Drawing();
		drawing.canvas = ctx.request.body.canvas
		await drawing.save()
		ctx.body = drawing;
	})
	.patch('/drawing/:id', passport.authenticate("jwt", { session: false }), async (ctx) => {
		const drawing = await Drawing.findOne({ id: ctx.params.id })
		drawing.canvas = ctx.request.body.canvas
		await drawing.save()
		ctx.body = drawing;
	})
	.get('/drawing/:id', async (ctx) => {
		const drawing = await Drawing.findOne({ id: ctx.params.id })
		if (typeof drawing === "undefined") {
			ctx.status = 404
		} else {
			ctx.body = drawing;
		}
	});