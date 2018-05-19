import {Request, Response, Router} from "express";
import * as passport from "passport";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";
let router = Router();
const config = require("../../config.json");

router.post('/', (req: Request, res: Response, done: Function) =>{
    console.log("test");
    passport.authenticate('local', (err, user) =>{
        console.log("test4");
        const id = user.id;
        const token = jwt.sign(id, config.tokenSecret);
        return res.json({id, token});
    })(req,res);
    console.log("!");
});

export {router as ApiLandingContoller} ;