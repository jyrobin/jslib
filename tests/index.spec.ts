import 'mocha';
import { assert } from 'chai';

import { allPropertyNames } from '../src';

describe('allPropertyNames()', () => {
  it('should list own property names', () => {
    const names = allPropertyNames({ a: 'b' });
    assert.include(names, 'a');
  });

  it('should list inherited property names', () => {
    const names = allPropertyNames({});
    assert.include(names, 'hasOwnProperty');
  });
});
