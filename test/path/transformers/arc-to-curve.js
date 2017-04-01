import { approxDeepEqual } from '../../utils'
import transformer from '../../../src/path/transformer'
import encoder from '../../../src/path/encoder'
import arcToCurve from '../../../src/path/transformers/arc-to-curve'

describe('arcToCurve()', function()
{
	it('should convert absolute arc to one absolute cubic bezier curve', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'c', relative: false, x1: 155.23, y1: 100, x2: 200, y2: 144.77, x: 200, y: 200 },
		], transformer([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'a', relative: false, rx: 100, ry: 100, xRotation: 0, largeArc: false, sweep: true, x: 200, y: 200 },
		], arcToCurve()), 0.01)
	})

	it('should convert relative arc to one relative cubic bezier curve', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'c', relative: true, x1: 55.23, y1: 0, x2: 100, y2: 44.77, x: 100, y: 100 },
		], transformer([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'a', relative: true, rx: 100, ry: 100, xRotation: 0, largeArc: false, sweep: true, x: 100, y: 100 },
		], arcToCurve()), 0.01)
	})
})
