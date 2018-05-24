import {Router,Request,Response} from "express";
import {getRepository} from "typeorm";
import {Group} from "../entity/Group";

let router = Router();

router.get("/profile", (request: Request, response: Response, done: Function) => {
   done(response.json(request.user));
});

router.get("/wg", async (request: Request, response: Response, done: Function) => {

    if (request.user.group != null) {
        await getRepository(Group).findOne(request.user.group).then(g => {
            response.json({group: g})
        });
    } else {
        response.json({group: null});
    }

    return response.json();
});

router.post("/new-wg", (request: Request, response: Response, done: Function) => {

    let newGroup = new Group();
    newGroup.members += request.user;
    getRepository(Group).insert(newGroup).then((g) => g == null ? response.json({group: null}): response.json(g));
    return response.json(request.user);
});

router.post("/join-wg", (request: Request, response: Response, done: Function) => {
    return response.json(request.user);
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