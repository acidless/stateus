import {Middleware} from "../core";

let produce: any;

try {
    produce = require("immer").produce;
} catch {
    throw new Error(
        "Please install immer it to use withImmer middleware. User npm install immer"
    );
}

export const withImmer: Middleware<any> = (store, changed, next) => {
    if (typeof changed === "function") {
        next(produce(store.getState(), changed));
    } else {
        next(changed);
    }
};