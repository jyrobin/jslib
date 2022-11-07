// throws for bad obj 
export function allPropertyNames(obj) {
    const props = [];
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}
