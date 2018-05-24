import {ApiContoller} from "../../src/controller/ApiController";
import * as HttpMocks from "node-mocks-http";
import * as Events from "events";
import * as typeOrm from "typeorm";
import * as expect from "expect.js";
import "mocha";
import * as sinon from"sinon";
import {User} from "../../src/entity/User";
import {Group} from "../../src/entity/Group";


//TODO how to test things with typescript?

let user = new User();
let group = new Group();

user.id          = 10000;
user.userName    = "test@testmail.com";
user.hash        = "hash";
user.screenName  = "testuser";
user.dateCreated = new Date(Date.now());
user.group       = group;

group.id      = 99999;
group.name    = "foo group";

function createUserRepositoryMock() {
    return {
        find: (id) => Promise.resolve(user),
        findOne: (id) => Promise.resolve(user),
    }
}

function createGroupRepositoryMock() {
    return {
        find: (id) => Promise.resolve(group),
        findOne: (id) => Promise.resolve(group),
        insert: (group) => Promise.resolve(group),
    }
}

const mockUserRepo = createUserRepositoryMock();
const mockGroupRepo = createGroupRepositoryMock();

const s = sinon.stub(typeOrm, 'getRepository');
s.withArgs(User).returns(mockUserRepo);
s.withArgs(Group).returns(mockGroupRepo);



function buildResponse() {
    return HttpMocks.createResponse({eventEmitter: Events.EventEmitter})
}

describe('ApiController', () => {
    before( () => {

    })

    it("should show their profile to a logged in user", (done : Function) => {
        let request = HttpMocks.createRequest({
            method: 'GET',
            url: '/profile',
            user: user
        });
        let response = HttpMocks.createResponse();

        ApiContoller.handle(request,response, () => {
            expect(response._isJSON).to.be.ok();
            expect(response._getData()).to.contain("test@testmail.com");
            done();
        });
    })
});