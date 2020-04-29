import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate} from "typeorm";
import { IsEmail, IsDefined, MinLength, MaxLength } from "class-validator";
import bcrypt = require("bcrypt")
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {

	validate(email: string, args: ValidationArguments) {
		return User.findOne({ email }).then(user => {
			if (user) return false;
			return true;
		});
	}

}

export function IsEmailUnique(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsEmailUniqueConstraint
		});
	};
}

const BCRYPT_HASH_ROUNDS = 10

@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true})
	@IsDefined({ message: "We need your email" })
	@IsEmail({}, {message:"Your email doesn't look right"})
	@IsEmailUnique({
		message: "Email address $value already exists."
	})
	email: string;

	@Column()
	@IsDefined({ message: "We need your first name" })
	firstName: string;

	@Column()
	@IsDefined({ message: "We need your last name" })
	lastName: string;
	
	@Column({ select: false })
	@MinLength(6, { message: "Your password must be at least $constraint1 characters long" })
	@MaxLength(20, { message: "Your password can't be over $constraint1 characters long" })
	@IsDefined({ message: "You need a password" })
	password: string;

	@Column({ nullable: true })
	token: string;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			
			this.password = await bcrypt.hash(this.password, BCRYPT_HASH_ROUNDS);
		}
	}

	async isPasswordValid(attempt:string){
		try {
			const isPasswordValid = await bcrypt.compare(attempt, this.password)
			return isPasswordValid
		} catch (error) {
			console.log("Error bcrypt comparing password: ",error)
		}
	} 
}
