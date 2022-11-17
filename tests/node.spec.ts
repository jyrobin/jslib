import 'mocha';
import { assert } from 'chai';

import { isDir } from '../src/node/fs';

describe('isDir()', () => {
  it('should work for current dir', () => {
    assert.isTrue(isDir('.'));
  });
});
