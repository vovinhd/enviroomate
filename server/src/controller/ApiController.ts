import {Router,Request,Response} from "express";
import {getRepository} from "typeorm";
import {Group} from "../entity/Group";
import {User} from "../entity/User";
import * as bodyParser from "body-parser"
let router = Router();

async function loadRelations(user : User) : Promise<User> {
    let u = await getRepository(User).findOne({where: {id : user.id}, relations: ["group"]});
    if (!u) throw new Error ("no such user");
    return u;
}

router.use(bodyParser.json());
router.get("/profile", (request: Request, response: Response, done: Function) => {
   done(response.json(((request.user) as User).transfer(true)));
});

router.get("/wg", async (request: Request, response: Response, done: Function) => {
    loadRelations(request.user).then( u =>{
        if(u.group) {
            done(response.json(u.group.transfer(true)));
        } else {
            response.status = 400
            response.json({message : "Group not found"})
            done(response)
        }
    }).catch(response);
});

router.post("/new-wg", (request: Request, response: Response, done: Function) => {
    loadRelations(request.user).then( u =>{
        if(u.group) {
            response.status = 400;
            done(response.json({message: "already in a group"}));
        } else {
            let newGroup = new Group();
            newGroup.members = [request.user];
            getRepository(Group).save(newGroup).then((g) => {
                if(g == null){
                    response.status = 500
                    response.json({message : "Group not created"})
                    done(response)
                } else {
                    response.json(g.transfer(true));
                    done(response)
                }
            }).catch(response);
        }
    }).catch(response);


});

router.post("/update-wg", async (request: Request, response: Response, done: Function) => {
    loadRelations(request.user).then( u =>{
        if(u.group) {
            u.group.name = request.body.newName ;
            getRepository(Group).save(u.group).then((g) => {
                if(g == null){
                    response.status = 400
                    response.json({message : "Group not found"})
                    done(response)
                } else {
                    response.json(g.transfer(true));
                    done(response)
                }
            }).catch(response);
        } else {
            response.status = 400
            response.json({message : "Group not found"})
            done(response)
        }
    }).catch(response);
});

router.post("/join-wg", async (request: Request, response: Response, done: Function) => {
    loadRelations(request.user).then( u => {

        if (u.group != null) {
            response.status = 400
            response.json({message: "already in a group"})
            done(response)
        }

        getRepository(Group).findOne({inviteId: request.body.inviteLink}).then(async g => {
            if (g == null) {
                response.status = 400
                response.json({message: "Invalid invite link"})
                done(response)
            } else {
                u.group = g;
                await getRepository(User).save(u);
                let updated = await getRepository(Group).findOne({id: g.id});
                response.json(updated.transfer(true));
                done(response)
            }
        }).catch(response)
    }).catch(response);
});

router.get("/followed-wgs", (request: Request, response: Response, done: Function) => {
    return response.json(request.user);
});

router.post("/follow-wg", (request: Request, response: Response, done: Function) => {
    return response.json(request.user);
});

router.get("/current-challenge", (request: Request, response: Response, done: Function) => {
    return response.json(request.user);
});

export {router as ApiContoller} ;