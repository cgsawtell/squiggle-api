import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { Stroke } from "../interfaces";

@Entity()
export class Drawing extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type:"json"})
	canvas: {
		strokes: Stroke[]
	}

	
}
