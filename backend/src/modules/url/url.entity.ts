import { Expose } from "class-transformer";
import { IsDate, IsDefined, IsOptional, IsUrl } from "class-validator";
import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from "typeorm";
import { Status } from "./url.types";

@Entity()
export class Url {

    @PrimaryColumn({
        length: 6
    })
    readonly id: string;

    @Column()
    @IsUrl()
    @IsDefined()
    readonly originalUrl: string;

    @Column()
    @IsDate()
    readonly creationDate: Date = new Date();

    @Column()
    @IsDate()
    @IsOptional()
    @Expose()
    readonly expirationDate: Date

    @Column()
    @IsDefined()
    readonly userId: string

    @Column()
    readonly hits: number = 0

    @Column()
    readonly status : Status = Status.ACTIVE

    @ObjectIdColumn()
    _id: ObjectID;

    public isExpired(): boolean {

        return this.status === Status.DELETED || (this.expirationDate && this.expirationDate < new Date())
    }
}