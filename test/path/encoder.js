import assert from 'assert'
import encoder from '../../src/path/encoder'

describe('encoder()', function()
{
	it('should encode basic path string', function()
	{
		assert.equal('M0 1L2 3', encoder([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		]))
	})

	it('should encode path string with boolean values', function()
	{
		assert.equal('M0 1A2 3 0 0 1 4 5', encoder([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'a', relative: false, rx: 2, ry: 3, xRotation: 0, largeArc: false, sweep: true, x: 4, y: 5 },
		]))
	})
})
