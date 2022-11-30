
import { StrMap } from '../lib';

export function formField(data: FormData, name: string): string | undefined {
    const ret = data.get(name);
    return typeof ret === 'string' ? ret : undefined;
}
export function formFields(data: FormData, ...names: string[]): StrMap {
    const ret: StrMap = {}
    if (names.length > 0) {
        names.forEach(name => {
            const val = data.get(name);
            if (typeof val === 'string') {
                ret[name] = val;
            }
        });
    } else {
        for (const [name, val] of data.entries()) {
            if (typeof val === 'string') {
                ret[name] = val;
            }
        }
    }
    return ret;
}
