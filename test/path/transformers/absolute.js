import assert from 'assert'
import transformer from '../../../src/path/transformer'
import absolute from '../../../src/path/transformers/absolute'

describe('absolute()', function()
{
	it('should not transform if all segments are already absolute', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], transformer([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], absolute()))
	})

	it('should transform segments that are relative to absolute', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 4 },
			{ type: 'l', relative: false, x: 6, y: 9 },
		], transformer([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: true, x: 2, y: 3 },
			{ type: 'l', relative: true, x: 4, y: 5 },
		], absolute()))
	})
})
