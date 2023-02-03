import { isDir } from './fs.js';
import { test } from 'uvu';
import * as assert from 'uvu/assert';

test('should work for current dir', () => {
    assert.is(isDir('..'), true);
});

test.run();
