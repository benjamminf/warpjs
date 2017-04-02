import assert from 'assert'
import parser from '../../src/path/parser'

describe('parser()', function()
{
	it('should parse empty path string', function()
	{
		assert.deepEqual([], parser(' '))
	})
	
	it('should parse space separated path string', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], parser('M 0 1 L 2 3'))
	})

	it('should parse comma separated path string', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], parser('M 0,1 L 2,3'))
	})

	it('should parse comma-and-space separated path string', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
		], parser('M 0, 1 L 2 , 3'))
	})

	it('should parse floating point numbers', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0.1, y: 1.23 },
			{ type: 'l', relative: false, x: 2.456, y: 3.7891 },
		], parser('M 0.1 1.23 L 2.456 3.78910'))
	})

	it('should parse exponent numbers', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 10 },
			{ type: 'l', relative: false, x: 210, y: 3230 },
		], parser('M 0e0 1e1 L 2.1e2 3.23e3'))
	})

	it('should parse short-hand segments', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
			{ type: 'l', relative: false, x: 4, y: 5 },
			{ type: 'l', relative: false, x: 6, y: 7 },
		], parser('M 0,1 L 2,3 4,5 6,7'))
	})

	it('should parse with closing segment', function()
	{
		assert.deepEqual([
			{ type: 'm', relative: false, x: 0, y: 1 },
			{ type: 'l', relative: false, x: 2, y: 3 },
			{ type: 'z', relative: false },
		], parser('M 0,1 L 2,3 Z'))
	})
})
