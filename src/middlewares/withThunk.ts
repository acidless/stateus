import {Middleware} from "../core";

export const withThunk: Middleware = async (store, changed, next) => {
    if (typeof changed === "function") {
        try {
            await (changed as Function)(store);
        } catch (err) {
            console.error("[withThunk error]", err);
        }
    } else {
        next(changed);
    }
};