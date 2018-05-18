import {User} from "./entity/User";
import {getRepository} from "typeorm";
import {Request, Response, NextFuction} from "express";

import * as passport from "passport";
import * as passportLocal from "passport-local";
import * as passportJWT from "passport-jwt";

let LocalStrategy = passportLocal.Strategy;
let JwtStrategy = passportJWT.Strategy;
let config = require("../config.json");
let userRepository = getRepository(User);

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    userRepository.findOne(id).then((user) => {
        if(user == undefined) done(null,null);
        done(null, user);
    });
});

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
/*
passport.use( new JwtStrategy  (opts,
    (jwtPayload, done) => {

    }
));
*/

export let isAuthenticated = (request: Request, response: Response, next: NextFuction ) => {
    if(request.isAuthenticated()) {
        return next();
    }
    response.redirect("/login");
};

export let isAuthorised = (request: Request, response: Response, next: NextFuction ) => {
    return next();
};
