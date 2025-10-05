import {describe} from "@jest/globals";
import {createStore} from "../../src";
import {logger} from "../../src/middlewares/logger";

describe("Logger Middleware", () => {
    it("should log state", () => {
        const consoleLog = jest.spyOn(console, "log");

        const store = createStore({counter: 0}, {middlewares: [logger]});
        store.setState({counter: 1});

        expect(consoleLog.mock.calls[0]).toEqual(["Prev State: ", {counter: 0}]);
        expect(consoleLog.mock.calls[1]).toEqual(["New State: ", {counter: 1}]);
    });
});