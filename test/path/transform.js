import assert from 'assert'
import transform from '../../src/path/transform'

describe('transform()', function()
{
	it('should not transform if transformer returns the same segment', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], segment => segment))
	})

	it('should extend the path when transformer returns array of segments', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], segment => segment.type === 'm' ? [segment, segment] : segment))
	})

	it('should remove a segment when transformer returns a falsy value', function()
	{
		assert.deepEqual([
			{ type: 'l', relative: false, x: 2, y: 3 },
		], transform([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], segment => segment.type === 'm' ? false : segment))
	})
})
