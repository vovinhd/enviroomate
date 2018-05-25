import {Router,Request,Response} from "express";
import {getRepository} from "typeorm";
import {Group} from "../entity/Group";
import {User} from "../entity/User";

let router = Router();

router.get("/profile", (request: Request, response: Response, done: Function) => {
   done(response.json(((request.user) as User).transfer(true)));
});

router.get("/wg", async (request: Request, response: Response, done: Function) => {

    if (request.user.group != null) {
        await getRepository(Group).findOne(request.user.group).then(g => {
            response.json(g.transfer(true))
        });
    } else {
        response.json({});
    }

    done(request.user.group.transfer(true));
});

router.post("/new-wg", async (request: Request, response: Response, done: Function) => {

    let newGroup = new Group();
    newGroup.members = [request.user];
    await getRepository(Group).save(newGroup).then((g) => {
        g == null ? response.json({}): response.json(g.transfer(true));
    });
    done(response)

});

router.post("/update-wg", async (request: Request, response: Response, done: Function) => {

    if (request.user.group == null) {
        response.status = 400
        response.json({message : "Group not found"})
        done(response)
    }

    request.user.group.name = request.body.newName ;
    await getRepository(Group).save(request.user.group).then((g) => {
        if(g == null){
            response.status = 400
            response.json({message : "Group not found"})
        } else {
            response.json(g.transfer(true));
        }
    });
    done(response)

});

router.post("/join-wg", async (request: Request, response: Response, done: Function) => {
    if (request.user.group != null) {
        response.status = 400
        response.json({message : "Invald invite Link"})
        done(response)
    }

    await getRepository(Group).findOne({inviteId: request.body.inviteLink}).then( g => {
        if(g == null){
            response.status = 400
            response.json({message : "Invald invite Link"})
        } else {
            response.json(g.transfer(true));
        }
    })

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