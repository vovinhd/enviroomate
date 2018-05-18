import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert} from "typeorm";
import * as bcrypt from 'bcrypt-nodejs';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userName: string;

    @Column()
    hash: string;
    password: string;

    @BeforeInsert()
    public encrypt () {
        this.hash = bcrypt.hashSync(this.password, bcrypt.genSaltSync()); //TODO make more async
    }

    public async validatePassword(candidate: string): Promise<boolean> {
        return bcrypt.compare(candidate, this.hash)
    }
}
