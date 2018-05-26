import {Request, Response, Router} from "express";
import * as passport from "passport";
import {User} from "../entity/User";
import * as jwt from "jsonwebtoken";
let router = Router();
const config = require("../../config.json");

/**
 * @api {post} /api-login
 * @apiName Login
 * @apiGroup Client Login
 * @apiExample Example usage:
     POST http://enviroommate.org:3000/api-login
     Accept: application/json
     Cache-Control: no-cache
     Content-Type: application/json

     {"username" : "1@test.com", "password":"test"}

    res: {"id":3,"token":"eyJhbGciOiJIUzI1NiJ9.Mw.s8smHWCZOUQBxQY-U5Ds2HhsjpNcRY08p_OfNGmimi4"}
 */
router.post('/', (req: Request, res: Response, done: Function) =>{
    passport.authenticate('local', {session: false},(err : Error, user : User) =>{
        console.log(err);
        console.log(user);
        if (!user) return res.json({message: "No such user!"});
        const id = user.id;
        const token = jwt.sign(id, config.tokenSecret);
        return res.json({id, token});
    })(req,res);
});

export {router as ApiLandingContoller} ;