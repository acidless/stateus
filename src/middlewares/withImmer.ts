import {Middleware} from "../core";

let produce: any;

export const withImmer: Middleware = (store, changed, next) => {
    if(!produce) {
        try {
            produce = require("immer").produce;
        } catch {
            throw new Error(
                "Please install immer it to use withImmer middleware. User npm install immer"
            );
        }
    }

    if (typeof changed === "function") {
        next(produce(store.getState(), changed));
    } else {
        next(changed);
    }
};