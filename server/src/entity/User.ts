import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToOne} from "typeorm";
import * as bcrypt from 'bcrypt-nodejs';
import {Group} from "./Group";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    screenName: string;

    @Column()
    dateCreated: Date;

    @Column()
    emailConfirmed: boolean = false;

    @Column()
    isBanned: boolean = false;

    @Column()
    hash: string;
    password: string;

    @ManyToOne(type => Group, group => group.members)
    group: Group;

    @BeforeInsert()
    public encrypt () {
        this.hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync()); //TODO make more async
    }

    public validatePassword(candidate: string): boolean {
        return bcrypt.compareSync(candidate, this.hash)
    }
}
