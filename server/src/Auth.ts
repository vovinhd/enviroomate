import {User} from "./entity/User";
import {getRepository} from "typeorm";

import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJWT from "passport-jwt";

let LocalStrategy = passportLocal.Strategy;
let JwtStrategy = passportJWT.Strategy;
let config = require("../config.json");
let userRepository = getRepository(User);

export class Auth {


    async initPassport () {
        let opts =  {
            jwtFromRequest : passportJWT.ExtractJwt.fromAuthHeader() ,
            secretOrKey : config.secret
        };

        passport.use( new LocalStrategy (
            async function (username: string, password: string, done: Function) {
                const user = await userRepository.findOne({userName: username});
                if (!user) {
                    return done(null, false)
                }
                const validPassword = await user.validatePassword(password);
                if(validPassword) {
                    return done(null, true)
                }

                return done(null, false)
            }
        ));

        passport.use( new JwtStrategy  (opts,
            (jwtPayload, done) => {

            }
        ));
    }
}

