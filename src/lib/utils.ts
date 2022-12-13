
export type AsyncVoid = () => Promise<void>;
export type AnyMap = { [key: string]: any };
export type NumberMap = { [key: string]: number };
export type UnknownMap = { [key: string]: unknown };
export type StrMap = { [key: string]: string };

export function assert(b: boolean, msg?: string): void {
	if (!b) throw Error(msg);
}

// throws for bad obj 
export function allPropertyNames(obj: any): string[] {
    const props: string[] = [];
    do {
        props.push(...Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));
    return props;
}

export function pick(obj: UnknownMap, ...names: string[]): UnknownMap {
    const ret: UnknownMap = {};
    if (names.length === 0) {
        for (let [k, v] of Object.entries(obj)) {
            if (v !== undefined) ret[k] = v;
        }
    } else {
        for (let k of names) {
            const v = obj[k];
            if (v !== undefined) ret[k] = v;
        }
    }
    return ret;
}

export function pickStrings(obj: UnknownMap, ...names: string[]): StrMap {
    const ret: StrMap = {};
    if (names.length === 0) {
        for (let [k, v] of Object.entries(obj)) {
            if (typeof v === 'string') ret[k] = v;
        }
    } else {
        for (let k of names) {
            const v = obj[k];
            if (typeof v === 'string') ret[k] = v;
        }
    }
    return ret;
}
