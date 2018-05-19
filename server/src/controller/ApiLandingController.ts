import {Request, Response, Router} from "express";
import * as passport from "passport";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";
let router = Router();
const config = require("../../config.json");

router.post('/', (req: Request, res: Response, done: Function) =>{
    passport.authenticate('local', {session: false},(err, user) =>{
        const id = user.id;
        const token = jwt.sign(id, config.tokenSecret);
        return res.json({id, token});
    })(req,res);
});

export {router as ApiLandingContoller} ;