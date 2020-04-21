import { Drawing } from "../entity/Drawing";
import * as Router from "koa-router";

export const drawingRouter = new Router()
	.post('/drawing', async (ctx) => {
		const drawing = new Drawing();
		drawing.version = ctx.request.body.version
		drawing.canvas = ctx.request.body.canvas
		await drawing.save()
		ctx.body = drawing;
	})
	.patch('/drawing/:id', async (ctx) => {
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