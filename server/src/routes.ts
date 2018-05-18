import {UserController} from "./controller/UserController";
import {LoginController} from "./controller/LoginController";
import {IndexController} from "./controller/IndexController";
import {Index} from "typeorm";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users",
    controller: UserController,
    action: "remove"
},{
    method: "get",
    route: "/register",
    controller: LoginController,
    action: "register"
}, {
    method: "post",
    route: "/register",
    controller: LoginController,
    action: "postRegister"
}, {
    method: "get",
    route: "/login",
    controller: LoginController,
    action: "login"
},
{
    method: "get",
    route: "/",
    controller: IndexController,
    action: "index"
}

];