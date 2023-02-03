import format from 'format-util';

export interface Printer {
    log(msg: string, ...args: any[]): void;
}

export class MemPrinter {
    private concat: string = '';
    private buf: string[] | undefined;
    readonly logger = this.log.bind(this);
    
    log(msg: any, ...args: any[]) {
        this.write(format(msg, ...args));
        this.write('\n');
    }

    write(arg: string) {
        if (this.buf === undefined) {
            this.concat = '';
            this.buf = arg ? [arg] : [];
        } else if (arg) {
            this.buf.push(arg);
        }
    }
    toString() {
        if (this.buf !== undefined) {
            this.concat += this.buf.join('');
            this.buf === undefined;
        }
        return this.concat;
    }
    clear() {
        this.concat = '';
        this.buf = undefined;
    }
}
