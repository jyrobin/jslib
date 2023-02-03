
import { resolve, join, normalize, basename } from 'path';
import { mkdirSync, existsSync, statSync, Stats, readdirSync } from 'fs';

export function findStats(name: string, startPath?: string, dirs?: string[]): [Stats|undefined, string] {
	let dir = resolve(startPath || '.');
	let fpath = join(dir, name);
	let found = existsSync(fpath);
	while (dir.length > 1 && !found) {
		dir = resolve(join(dir, '..'));
		fpath = join(dir, name);
		found = existsSync(fpath);
	}

	if (!found && dirs) {
		for (let dir of dirs) {
			fpath = join(dir, name);
			found = existsSync(fpath);
			if (found) break;
		}
	}

	if (found) {
		try {
			return [statSync(fpath), fpath];
		} catch {}
	}

	return [undefined, fpath];
}

export function findFile(name: string, startPath?: string, dirs?: string[]): string {
	let pair = findStats(name, startPath, dirs);
	return pair ? pair[1] : ''
}

export function findDir(name: string, startPath?: string, dir?: string[]): string {
	const [stats, fpath] = findStats(name, startPath, dir);
	return stats && stats.isDirectory() ? fpath : '';
}

export function fileStats(fpath: string): [Stats|undefined, string] {
	try {
        if (fpath) {
            fpath = resolve(fpath);
            if (existsSync(fpath)) {
                return [statSync(fpath), fpath];
            }
        }
	} catch {}

	return [undefined, ''];
}

export function isFile(fpath: string): boolean {
    if (!fpath) return false;

	const [stats, _] = fileStats(fpath);
	return stats?.isFile() || false;
}

export function isDir(fpath: string): boolean {
    if (!fpath) return false;

	let [stats, _] = fileStats(fpath);
	return stats?.isDirectory() || false;
}

export function assertDir(fpath: string, msg?: string) {
    if (!isDir(fpath)) throw Error(msg || `${fpath} not a folder`);
}
export function assertFile(fpath: string, msg?: string) {
    if (!isFile(fpath)) throw Error(msg || `${fpath} not a file`);
}

// const asciiPathRegExp = /^[0-9a-zA-Z\.\/]+$/;

// no leading '..'
export function sanitizePath(fpath: string, prefix?: string, re?: RegExp): string {
    if (fpath.indexOf('\\') >= 0) fpath = fpath.replace(/\\/g, '');
    let ret = normalize(fpath).replace(/^(\.\.(\/|$))+/, '');
    if (prefix && !ret.startsWith(prefix)) return '';
    if (re && !re.test(ret)) return '';
    return ret;
}


