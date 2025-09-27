import {Middleware} from "../core";

export const logger: Middleware<any> = (store, changed, next) => {
    console.log("Prev State: ", store.getState());
    next(changed);
    console.log("New State: ", store.getState());
};