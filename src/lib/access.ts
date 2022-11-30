
// otherwise is default value if obtain truy
export function accessPath(path: string | string[], otherwise: any, obj: any, obtain?: boolean, value?: any): any {
  const isSet: boolean = !!obtain && arguments.length >= 5;

  if (!obj || typeof obj !== 'object') return otherwise;

  if (!path || path.length === 0) return obj;

  if (typeof path === 'string') path = path.split('.');

  let name: string|undefined, child: any, last: number = path.length-1;
  while (last >= 0 && !path[last]) last--;
  if (last < 0) return obj;

  for (let i=0; i<last; i++) {
    name = path[i];
    if (!name) continue;

    child = obj[name];
    if (child === undefined) {
      if (!obtain) return otherwise;

      obj = (obj[name] = {});
    } else if (child && typeof child === 'object') {
      obj = child;
    } else {
      return obtain ? undefined : otherwise; 
    }
  }

  name = path[last];
  if (!name) return obj;

  if (isSet) {
    if (value === undefined) {
      delete obj[name];
    } else {
      obj[name] = value;
    }
    return value;
  }

  child = obj[name];
  if (obtain && child === undefined && otherwise !== undefined) {
    child = obj[name] = otherwise;
  }
  return child;
}

export function getPath(obj: any, path: string | string[], otherwise: any): any {
  return accessPath(path, otherwise, obj);
};

export function obtainPath(obj: any, path: string | string[], defaultVal: any): any {
  return accessPath(path, defaultVal, obj, true);
};

export function setPath(obj: any, path: string | string[], value: any): any {
  return accessPath(path, undefined, obj, true, value);
};

export function delPath(obj: any, path: string | string[], key: string): void {
  const data = getPath(obj, path, undefined);
  if (data && typeof data === 'object') delete data[key];
};

export function mergePath(obj: any, path: string | string[], data: any): any {
  if (data && typeof data === 'object') {
    const ret = obtainPath(obj, path, {});
    if (ret && typeof ret === 'object') return Object.assign(ret, data);
  }
};

export function pushPath(obj: any, path: string | string[], value: any): any {
  const arr = obtainPath(obj, path, []);
  if (Array.isArray(arr)) {
    arr.push(value);
  }
  return arr;
};

export function mapPath(arr: any[], path: string | string[], otherwise: any): any {
  if (typeof path === 'string') path = path.split('.');
  return arr.map(it => accessPath(path, otherwise, it));
};

export function findPath(arr: any[], path: string | string[], val: any): any {
  if (!arr || !path) return;

  if (typeof path === 'string') path = path.split('.');

  for (var i=0, n=arr.length; i<n; i++) {
    var obj = arr[i];
    if (accessPath(path, undefined, obj) === val) return obj;
  }
};

