import { resolve, join, normalize, basename } from 'path';
import { existsSync, statSync, Stats, readdirSync } from 'fs';

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

	const [stats, fp] = fileStats(fpath);
	return stats?.isFile() || false;
}

export function isDir(fpath: string): boolean {
    if (!fpath) return false;

	let [stats, fp] = fileStats(fpath);
	return stats?.isDirectory() || false;
}

export function assertDir(fpath: string, msg?: string) {
    if (!isDir(fpath)) throw new Error(msg || `${fpath} not a folder`);
}
export function assertFile(fpath: string, msg?: string) {
    if (!isFile(fpath)) throw new Error(msg || `${fpath} not a file`);
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

export interface Node {
  id: string;
  name: string;
  parent?: string;
  children?: string[]; // undefined is leaf
}

export type NodeMap = { [key: string]: Node };

// baseDir sanitized
function _collectNodes(ret: Node[], baseDir: string, parentPath: string, relPaths: string[], depth: number): Node[] {
    if (depth === 0) return ret;

    for (const relPath of relPaths) {
        let newPath = join(parentPath, relPath); // join seems to normalize
        if (newPath === '.') newPath = '';
        const fpath = join(baseDir, newPath);
        if (isDir(fpath)) {
            const fnames = readdirSync(fpath);
            ret.push({
                id: newPath,
                parent: newPath || undefined,
                name: basename(fpath) + '/',
                children: fnames.map(fname => join(newPath, fname)),
            });
            _collectNodes(ret, baseDir, newPath, fnames, depth - 1);
        } else if (isFile(fpath)) {
            ret.push({
                id: newPath,
                parent: newPath || undefined,
                name: basename(fpath),
            });
        }
    }
    return ret;
}

export function collectNodes(nodes: Node[], baseDir: string, relPaths: string[], depth: number): Node[] {
    if (depth === 0) return nodes;

    baseDir = sanitizePath(baseDir).replace(/\/+$/, ''); // no tailing slashes
    if (!isDir(baseDir)) return nodes;

    relPaths = relPaths
        .map(name => sanitizePath(name).replace(/\/+$/, '')) // no tailing slashes
        .filter(x => x);

    return _collectNodes(nodes, baseDir, '', relPaths, depth);
}

export function getTreeNodes(baseDir: string, relPaths: string[] | undefined, depth: number, prefix?: string): Node[] {
    if (!relPaths) {
        relPaths = [''];
    } else {
        const len = prefix ? prefix.length : 0;
        if (prefix) relPaths = relPaths.filter(p => p.startsWith(prefix)).map(p => p.slice(len));
    }

    const ret = collectNodes([] as Node[], baseDir, relPaths, depth);
    return !prefix ? ret : ret.map(n => ({
        id: prefix + n.id,
        parent: n.parent === undefined ? undefined : prefix + n.parent,
        name: n.name,
        children: n.children?.map(ch => prefix + ch),
    }));
}
