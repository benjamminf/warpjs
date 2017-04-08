import { approxDeepEqual } from '../../assert'
import transform from '../../../src/path/transform'
import encoder from '../../../src/path/encoder'
import arcToCurve from '../../../src/path/transformers/arc-to-curve'

describe('arcToCurve()', function()
{
	it('should convert absolute arc to one absolute cubic bezier curve', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'c', relative: false, x1: 155.23, y1: 100, x2: 200, y2: 144.77, x: 200, y: 200 },
		], transform([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'a', relative: false, rx: 100, ry: 100, xRotation: 0, largeArc: false, sweep: true, x: 200, y: 200 },
		], arcToCurve()), 0.01)
	})

	it('should convert relative arc to one relative cubic bezier curve', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'c', relative: true, x1: 55.23, y1: 0, x2: 100, y2: 44.77, x: 100, y: 100 },
		], transform([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'a', relative: true, rx: 100, ry: 100, xRotation: 0, largeArc: false, sweep: true, x: 100, y: 100 },
		], arcToCurve()), 0.01)
	})

	it('should convert absolute arc to two absolute cubic bezier curves', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'l', relative: false, x: 100, y: 200 },
			{ type: 'c', relative: false, x1: 72.39, y1: 200, x2: 50, y2: 177.61, x: 50, y: 150 },
			{ type: 'c', relative: false, x1: 50, y1: 122.39, x2: 72.39, y2: 100, x: 100, y: 100 },
		], transform([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'l', relative: false, x: 100, y: 200 },
			{ type: 'a', relative: false, rx: 50, ry: 50, xRotation: 0, largeArc: false, sweep: true, x: 100, y: 100 },
		], arcToCurve()), 0.01)
	})

	it('should convert relative arc to two relative cubic bezier curves', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'c', relative: true, x1: -27.61, y1: 0, x2: -50, y2: -22.39, x: -50, y: -50 },
			{ type: 'c', relative: true, x1: 0, y1: -27.61, x2: 22.39, y2: -50, x: 50, y: -50 },
		], transform([
			{ type: 'm', relative: false, x: 100, y: 100 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'a', relative: true, rx: 50, ry: 50, xRotation: 0, largeArc: false, sweep: true, x: 0, y: -100 },
		], arcToCurve()), 0.01)
	})

	it('should convert two isolated paths with relative arcs to four relative cubic bezier curves', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 100, y: 0 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'c', relative: true, x1: -27.61, y1: 0, x2: -50, y2: -22.39, x: -50, y: -50 },
			{ type: 'c', relative: true, x1: 0, y1: -27.61, x2: 22.39, y2: -50, x: 50, y: -50 },
			{ type: 'z', relative: false },
			{ type: 'm', relative: false, x: 100, y: 200 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'c', relative: true, x1: -27.61, y1: 0, x2: -50, y2: -22.39, x: -50, y: -50 },
			{ type: 'c', relative: true, x1: 0, y1: -27.61, x2: 22.39, y2: -50, x: 50, y: -50 },
			{ type: 'z', relative: false },
		], transform([
			{ type: 'm', relative: false, x: 100, y: 0 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'a', relative: true, rx: 50, ry: 50, xRotation: 0, largeArc: false, sweep: true, x: 0, y: -100 },
			{ type: 'z', relative: false },
			{ type: 'm', relative: false, x: 100, y: 200 },
			{ type: 'l', relative: true, x: 0, y: 100 },
			{ type: 'a', relative: true, rx: 50, ry: 50, xRotation: 0, largeArc: false, sweep: true, x: 0, y: -100 },
			{ type: 'z', relative: false },
		], arcToCurve()), 0.01)
	})

	it('should convert two consecutive arcs to two four cubic bezier curves', function()
	{
		approxDeepEqual([
			{ type: 'm', relative: false, x: 50, y: 40 },
			{ type: 'c', relative: false, x1: 55.52, y1: 40, x2: 60, y2: 44.48, x: 60, y: 50 },
			{ type: 'c', relative: false, x1: 60, y1: 55.52, x2: 55.52, y2: 60, x: 50, y: 60 },
			{ type: 'c', relative: false, x1: 44.48, y1: 60, x2: 40, y2: 55.52, x: 40, y: 50 },
			{ type: 'c', relative: false, x1: 40, y1: 44.48, x2: 44.48, y2: 40, x: 50, y: 40 },
		], transform([
			{ type: 'm', relative: false, x: 50, y: 40 },
			{ type: 'a', relative: false, rx: 10, ry: 10, xRotation: 0, largeArc: false, sweep: true, x: 50, y: 60 },
			{ type: 'a', relative: false, rx: 10, ry: 10, xRotation: 0, largeArc: false, sweep: true, x: 50, y: 40 },
		], arcToCurve()), 0.01)
	})
})
