import { approxDeepEqual } from './assert'
import interpolator from '../src/interpolator'

describe('interpolator()', function()
{
	it('should interpolate straight line', function()
	{
		approxDeepEqual([
			[ [10, 10], [15, 20] ],
			[ [15, 20], [20, 30] ],
		], interpolator([ [10, 10], [20, 30] ]), 0.01)
	})

	it('should interpolate quadratic bezier', function()
	{
		approxDeepEqual([
			[ [10, 10], [15, 10], [20, 10] ],
			[ [20, 10], [25, 10], [30, 10] ],
		], interpolator([ [10, 10], [20, 10], [30, 10] ]), 0.01)
	})
})
