import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, BeforeInsert, BeforeUpdate} from "typeorm";
import { IsEmail, IsDefined, MinLength, MaxLength } from "class-validator";
import bcrypt = require("bcrypt")
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";

@ValidatorConstraint({ async: true })
export class IsEmailExistConstraint implements ValidatorConstraintInterface {

	validate(email: string, args: ValidationArguments) {
		return User.findOne({ email }).then(user => {
			if (user) return false;
			return true;
		});
	}

}

export function IsEmailExist(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [],
			validator: IsEmailExistConstraint
		});
	};
}

@Entity()
export class User extends BaseEntity {

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique:true})
	@IsDefined({ message: "We need your email" })
	@IsEmail({}, {message:"Your email doesn't look right"})
	@IsEmailExist({
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

	@BeforeInsert()
	@BeforeUpdate()
	hashPassword() {
		if (this.password) {
			
			this.password = bcrypt.hashSync(this.password, 10);
		}
	}

}
