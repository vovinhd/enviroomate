import {NextFunction, Request, Response} from "express";

export class IndexController {


    index(request: Request, response: Response, next: NextFunction) {
        return response.render('index', {home_active: "active"})
    }


}