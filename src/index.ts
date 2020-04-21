import * as dotenv from "dotenv"
import "reflect-metadata";
import * as PostgressConnectionStringParser from 'pg-connection-string';
import {createConnection, ConnectionOptions, getConnectionOptions} from "typeorm";
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Drawing } from "./entity/Drawing";
import { router } from "./routes/api";
import { User } from "./entity/User";

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
				host: connectionOptionsDBURL.host,
				entities: [Drawing, User]
			})
		}
		catch(e){
			console.log(e)
		}

		const app = new Koa();
		app.use(bodyParser());
		app.use(router.routes());
		app.listen(PORT);

		console.log('Server running on port ' + PORT);

	}
)
