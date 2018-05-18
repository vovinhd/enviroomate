import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import {Request, Response} from "express";
import {Routes} from "./routes";
import * as session from "express-session";
import {User} from "./entity/User";
import * as passportLocal from "passport-local";
import * as passportJWT from "passport-jwt";


let config = require("../config.json");
let RedisStore = require("connect-redis")(session);


createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());


    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });



    // setup express app
    app.use(session({
        store: new RedisStore({
            url: config.redisStore.url
        }),
        secret: config.secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    // start express server
    app.listen(config.port);

    /*
   // insert new users for test
    await connection.manager.save(connection.manager.create(User, {
        userName: "a",
        password: "password"
    }));
    await connection.manager.save(connection.manager.create(User, {
        userName: "b",
        password: "password"
    }));
    */

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

}).catch(error => console.log(error));
