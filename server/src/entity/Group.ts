import {BeforeInsert, Column, Entity, getRepository, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Group {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => User, user => user.group)
    members: User[];

    @Column()
    inviteId: string;

    @BeforeInsert()
    async generateInviteId() {
        if (this.inviteId == null) { // TODO simplify
            let candidate: string = null;
            while (candidate == null) {
                let temp = Math.random().toString(36).substring(7);
                let group = await getRepository(Group).find({inviteId: temp});
                if (group == null) {
                    candidate  = Math.random().toString(36).substring(7);
                }
            }
            this.inviteId = candidate;
        }
    }

}
