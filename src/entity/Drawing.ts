import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";
import { Stroke } from "../../../common/interfaces";

@Entity()
export class Drawing extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	version: string;

	@Column({type:"json"})
	canvas: {
		strokes: Stroke[]
	}

	
}