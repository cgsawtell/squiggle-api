import Router = require("koa-router");
import * as jwt from "jsonwebtoken"
import * as passport from "koa-passport"
import { Context } from "koa";
import { User } from "../entity/User";

export const authRouter = new Router()
	.prefix("/authenticate")
	.post('/local', async (ctx: Context & Router.RouterContext, next) => {
		
		return passport.authenticate("local", { session: false}, async function (err, user: User | undefined) {
			if (typeof user === "undefined") {
				ctx.body = { success: false };
				ctx.throw(401);
			} 
			else {
				const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
				await user.reload()
				user.token = token;
				await user.save()
				delete user.token
				ctx.body = { success: true, user, token};
			}
		})(ctx, next)
	})
	.post("/logout", async (ctx: Context & Router.RouterContext, next) => {
		return passport.authenticate("jwt", { session: false }, async function(err, user){
			user.token = null
			await user.save()
			ctx.body = { success:true }
		})(ctx, next)
		
	})