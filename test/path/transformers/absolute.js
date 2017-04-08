import assert from 'assert'
import transform from '../../../src/path/transform'
import absolute from '../../../src/path/transformers/absolute'

describe('absolute()', function()
{
	it('should not transform if all segments are already absolute', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], transform([
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
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: true, x: 2, y: 3 },
			{ type: 'l', relative: true, x: 4, y: 5 },
		], absolute()))
	})

	it('should correctly handle closing paths followed by a move segment', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 4 },
			{ type: 'z', relative: false },
			{ type: 'm', relative: false, x: 4, y: 6 },
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: true, x: 2, y: 3 },
			{ type: 'z', relative: true },
			{ type: 'm', relative: true, x: 4, y: 5 },
		], absolute()))
	})

	it('should correctly handle closing paths followed by a drawing segment', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 4 },
			{ type: 'z', relative: false },
			{ type: 'l', relative: false, x: 4, y: 6 },
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: true, x: 2, y: 3 },
			{ type: 'z', relative: true },
			{ type: 'l', relative: true, x: 4, y: 5 },
		], absolute()))
	})

	it('should correctly handle paths starting with a drawing segment', function()
	{
		assert.deepEqual([
			{ type: 'l', relative: false, x: 0, y: 1 },
		], transform([
			{ type: 'l', relative: true, x: 0, y: 1 },
		], absolute()))
	})
})
