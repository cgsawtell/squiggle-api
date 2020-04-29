import * as passport from "koa-passport"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as JWTStrategy, ExtractJwt} from "passport-jwt"
import {User} from "./entity/User"

passport.serializeUser(function (user, done) {	
	done(null, user)
});

passport.deserializeUser(async function (id:number, done) {
	try {
		const user = await User.findOne({id});
		done(null, user);
	} catch (err) {
		done(err);
	}
});

passport.use(new JWTStrategy({
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET
},
	async function (jwtPayload, cb) {
		const { id } = jwtPayload
		try {
			const user = await User.findOne({ id })
			return cb(null, user);
			
		} catch (error) {
			return cb(error);
		}
	}
));

passport.use(new LocalStrategy({usernameField: 'email'}, async function (email:string, password:string, done) {
	const onSuccess = (user: User) => done(null, user);
	const onFail = () => done(null, undefined, { message: "Login details incorrect, check your details and try again." });
	try {
		const user = await User.findOneOrFail({ email }, { select: [	"password","email","id"] })
		const isUserPasswordValid = await user.isPasswordValid(password);
		if (isUserPasswordValid) {
			delete user.password;
			onSuccess(user);
		} else {
			throw new Error("Password failed")
		}
	} catch (error) {
		onFail()
	}
}))
