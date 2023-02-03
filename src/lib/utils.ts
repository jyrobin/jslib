
export type AsyncVoid = () => Promise<void>;
export type AnyMap = { [key: string]: any };
export type NumberMap = { [key: string]: number };
export type UnknownMap = { [key: string]: unknown };
export type StrMap = { [key: string]: string };

export function assert(b: boolean, msg?: string): void {
	if (!b) throw Error(msg);
}

// throws for bad obj 
export function allPropertyNames(obj: unknown): string[] {
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

export class StringBuffer {
    private concat: string = '';
    private buf: string[] | undefined = undefined; 
    log(s: string) {
        this.push(s, '\n');
    }
    push(...args: string[]) {
        if (this.buf === undefined) {
            this.buf = args; // safe?
        } else {
            this.buf.push(...args);
        }
    }
    toString() {
        if (this.buf !== undefined) {
            this.concat += this.buf.join('');
            this.buf === undefined;
        }
        return this.concat;
    }
}

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
  (obj: X, prop: Y): obj is X & Record<Y, unknown>
{
  return obj.hasOwnProperty(prop);
}

export type Struct = Record<string, unknown>;

export function isStruct(obj: unknown):  obj is Struct {
    return !!obj && typeof obj === 'object' && !Array.isArray(obj);
}

export function mergeStruct(r: Struct, s: Struct): Struct {
    Object.keys(s).forEach(key => {
        r[key] = s[key];
    });
    return r;
}
