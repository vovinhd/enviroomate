import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";

export class LoginController {

    private userRepository = getRepository(User);

    async login(request: Request, response: Response, next: NextFunction) {

    }

}