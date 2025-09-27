import {withImmer} from "../../src/middlewares/withImmer";

jest.mock("immer", () => ({
    produce: jest.fn((state, fn) => {
        const copy = { ...state };
        fn(copy);
        return copy;
    }),
}));

describe("withImmer middleware", () => {
    let store: any;
    let next: jest.Mock;

    beforeEach(() => {
        store = {
            getState: jest.fn(() => ({ count: 0 })),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should call produce when changed is a function", () => {
        const changed = jest.fn((draft: any) => {
            draft.count = 1;
        });

        withImmer(store, changed, next);

        expect(changed).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ count: 1 });
    });

    it("should pass partial state directly when changed is an object", () => {
        const changed = { count: 42 };

        withImmer(store, changed, next);

        expect(next).toHaveBeenCalledWith({ count: 42 });
    });
});

describe("withImmer middleware without immer", () => {
    it("should throw error if immer is not installed", () => {
        jest.resetModules();
        jest.doMock("immer", () => {
            throw new Error("Module not found");
        });

        expect(() => require("../../src/middlewares/withImmer")).toThrow(
            "Please install immer it to use withImmer middleware. User npm install immer"
        );
    });
});
