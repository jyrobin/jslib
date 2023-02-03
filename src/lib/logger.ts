
import { AnyMap } from './utils.js';

export interface Logger {
    error(obj: string|AnyMap, ...args: any[]): void;
    warn(obj: string|AnyMap, ...args: any[]): void;
    info(obj: string|AnyMap, ...args: any[]): void;
    debug(obj: string|AnyMap, ...args: any[]): void;
    with(opts: AnyMap): Logger;
}
