import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import * as passport from "passport";

export class LoginController {

    private userRepository = getRepository(User);


    login(request: Request, response: Response, next: NextFunction) {
        return response.render('login', {login_active: "active"});
    }

    async postLogin(request: Request, response: Response, next: NextFunction) {
        return passport.authenticate('local', { successRedirect: '/',
            failureRedirect: '/somewhere',
            failureFlash: false })
    }

    register(request: Request, response: Response, next: NextFunction) {
        return response.render('register', {reg_active: "active"});
    }

    postRegister(request: Request, response: Response, next: NextFunction) {

        //validate
        request.checkBody('username', 'Email is required').notEmpty();
        request.checkBody('username', 'Email is not valid').isEmail();
        request.checkBody('screenname', 'Username is required').notEmpty();
        request.checkBody('password', 'Password is required').notEmpty();
        request.checkBody('confirm_password', 'Passwords do not match').equals(request.body.password);

        let err = request.validationErrors();
        if (err) {
            return response.render('register', {reg_active: "active", errors: err});
        }

        //get form data
        let username = request.body.username;
        let screename = request.body.screenname;
        let password = request.body.password;
        let confirmPassword = request.body.confirm_password;

        this.userRepository.findOne({userName: username }).then((user) =>{
            if (user == null) {
                let newUser = new User();
                newUser.userName = username;
                newUser.screenName = screename;
                newUser.password = password;
                request.flash('success_msg', 'You are registered and can now login');
                return response.render('login', {login_active: "active"});
            } else {
                return response.render('register', {reg_active: "active", username: username});
            }
        })
        return response.render('register', {reg_active: "active"});
    }
}