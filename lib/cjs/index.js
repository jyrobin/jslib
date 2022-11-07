"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPropertyNames = void 0;
// throws for bad obj 
function allPropertyNames(obj) {
    const props = [];
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}
exports.allPropertyNames = allPropertyNames;
