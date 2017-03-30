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
})
