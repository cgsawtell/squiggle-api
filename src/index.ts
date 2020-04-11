import * as dotenv from "dotenv"
import "reflect-metadata";
import * as PostgressConnectionStringParser from 'pg-connection-string';
import {createConnection, ConnectionOptions, getConnectionOptions} from "typeorm";
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { Drawing } from "./entity/Drawing";

if (process.env.NODE_ENV !== 'production') {
	dotenv.config()
}

const PORT = process.env.PORT || 3000;
const connectionOptionsDBURL = PostgressConnectionStringParser.parse(process.env.DATABASE_URL);
getConnectionOptions().then(
	async connectionOption => {
		try{
			await createConnection(<ConnectionOptions>{ 
				...connectionOption, 
				username: connectionOptionsDBURL.user,
				database: connectionOptionsDBURL.database,
				password: connectionOptionsDBURL.password,
				host: connectionOptionsDBURL.host
			})
		}
		catch(e){
			console.log(e)
		}

		const app = new Koa();
		app.use(bodyParser());

		const router = new Router();
		router
			.prefix("/api")
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

		app.use(router.routes());

		app.listen(PORT);

		console.log('Server running on port ' + PORT);

	}
)
