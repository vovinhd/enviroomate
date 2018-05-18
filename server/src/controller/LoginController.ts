import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class LoginController {

    private userRepository = getRepository(User);


    login(request: Request, response: Response, next: NextFunction) {
        return response.render('login', {login_active: "active"});
    }


    register(request: Request, response: Response, next: NextFunction) {
        return response.render('register', {reg_active: "active"});
    }

    post_register(request: Request, response: Response, next: NextFunction) {

        //validate
        request.checkBody('username', 'Email is required').notEmpty();
        request.checkBody('username', 'Email is not valid').isEmail();
        request.checkBody('screenname', 'Username is required').notEmpty();
        request.checkBody('password', 'Password is required').notEmpty();
        request.checkBody('confirmpassword', 'Passwords do not match').equals(request.body.password);

        let err = request.validationErrors();
        if (err) {
            return response.render('register', {reg_active: "active", errors: err});
        }

        //get form data
        let username = request.body.username;
        let screename = request.body.screenname;
        let password = request.body.password;
        let confirmPassword = request.body.confirmpassword;


        return response.render('register', {reg_active: "active"});
    }
}