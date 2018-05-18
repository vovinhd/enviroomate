import "reflect-metadata";
import {createConnection, getRepository} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as passport from "passport";
import * as flash from "flash";
import {Request, Response} from "express";
import {Routes} from "./routes";
import * as session from "express-session";
import * as expressValidator from "express-validator";
import * as cookieParser from "cookie-parser";
import * as path from "path";
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as forceSsl from "express-force-ssl";
import * as passportLocal from "passport-local";
import {User} from "./entity/User";
import {validationResult} from "express-validator/check";

let LocalStrategy = passportLocal.Strategy;

let config = require("../config.json");
let RedisStore = require("connect-redis")(session);
let express_handlebars = require("express-handlebars")({defaultLayout: 'layout'});
let httpsOptions = {
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
}

createConnection().then(async connection => {
    passport.serializeUser<any, any>((user, done) => {
        done(undefined, user.id);
    });

    passport.deserializeUser((id, done) => {
        getRepository(User).findOne(id).then((user) => {
            if(user == undefined) done(null,null);
            done(null, user);
        });
    });

    passport.use( new LocalStrategy (
        async (username: string, password: string, done: Function) => {
            getRepository(User).findOne({userName: username}).then(user => {
                if(user == null) {
                    return done(undefined, false, {message: "Email not found"});
                }
                if(user.validatePassword(password)) return done(undefined, user);
                return done(undefined, false, {message: "Invalid name or password!"});

            })
        }
    ));

    // create express app
    const app = express();
    // setup express app

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    //
    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: !config.dev }
    }));
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(expressValidator());

    // cache static files
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
    app.post('/login',
        passport.authenticate('local'),
        function(req, res) {
            // If this function gets called, authentication was successful.
            // `req.user` contains the authenticated user.
            res.redirect('/');
        });
    //setup views
    app.set('views', path.join(__dirname, 'views'));
    app.engine('handlebars', express_handlebars);
    app.set('view engine', 'handlebars');

    //setup static assets
    app.use(express.static('public'));

    app.enable('view cache');

    // start express server
    //app.listen(config.port);

    https.createServer(httpsOptions, app).listen(config.port || 80);
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



    app._router.stack.forEach(function(r){
        if (r.route && r.route.path){
            console.log(r.route.path)
        }
    })


}).catch(error => console.log(error));
