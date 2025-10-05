import { withThunk } from "../../src/middlewares/withThunk";

describe("withThunk middleware", () => {
    let store: any;
    let next: jest.Mock;

    beforeEach(() => {
        store = {
            getState: jest.fn(() => ({ count: 0 })),
            setState: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should call next when changed is an object", () => {
        const changed = { count: 5 };

        withThunk(store, changed, next);

        expect(next).toHaveBeenCalledWith({ count: 5 });
        expect(store.setState).not.toHaveBeenCalled();
    });

    it("should call function if changed is a function", () => {
        const thunk = jest.fn((storeArg) => {
            expect(storeArg).toBe(store);
            expect(storeArg.getState()).toEqual({ count: 0 });
        });

        withThunk(store, thunk, next);

        expect(thunk).toHaveBeenCalledTimes(1);
        expect(thunk).toHaveBeenCalledWith(store);
        expect(next).not.toHaveBeenCalled();
    });

    it("should handle async thunks", async () => {
        const asyncThunk = jest.fn(async (storeArg) => {
            expect(storeArg.getState()).toEqual({ count: 0 });
            await new Promise((r) => setTimeout(r, 10));
            storeArg.setState({ count: 1 });
        });

        await withThunk(store, asyncThunk, next);

        expect(asyncThunk).toHaveBeenCalled();
        expect(store.setState).toHaveBeenCalledWith({ count: 1 });
    });

    it("should catch errors from rejected async thunk", async () => {
        const error = new Error("Thunk failed");
        const badThunk = jest.fn(async () => {
            throw error;
        });

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        await withThunk(store, badThunk, next);

        expect(badThunk).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith("[withThunk error]", error);

        consoleSpy.mockRestore();
    });
});
