import "reflect-metadata";
import {createConnection} from "typeorm";
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { Drawing } from "./entity/Drawing";

const PORT = process.env.PORT || 3000;

createConnection().then(async connection => {
	const app = new Koa();
	app.use(bodyParser());

	const router = new Router();
	router
	.prefix("/api")
	.post('/drawing', async (ctx) => {
		console.log("new drawing", ctx.request);
		const drawing = new Drawing();
		drawing.version = ctx.request.body.version
		drawing.canvas = ctx.request.body.canvas
		await drawing.save()
		ctx.body = drawing;
	})
	.patch('/drawing/:id', async (ctx) => {
		const drawing = await Drawing.findOne({id:ctx.params.id})
		drawing.canvas = ctx.request.body.canvas
		await drawing.save()
		ctx.body = drawing;
	})
	.get('/drawing/:id', async (ctx) => {
		const drawing = await Drawing.findOne({id:ctx.params.id})
		if(typeof drawing === "undefined")
		{
			ctx.status = 404
		}else{
			ctx.body = drawing;
		}
	});

	app.use(router.routes());

	app.listen(PORT);

	console.log('Server running on port ' + PORT);

}).catch(error => console.log(error));
