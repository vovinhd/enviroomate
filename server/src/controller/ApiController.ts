import {Router,Request,Response} from "express";

let router = Router();

router.use("/profile", (request: Request, response: Response, done: Function) => {
   return response.json(request.user);
});
export {router as ApiContoller} ;