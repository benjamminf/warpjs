const segmentSchemas = {
	m: ['x', 'y'],
	z: [],
	l: ['x', 'y'],
	h: ['x'],
	v: ['y'],
	c: ['x1', 'y1', 'x2', 'y2', 'x', 'y'],
	s: ['x2', 'y2', 'x', 'y'],
	q: ['x1', 'y1', 'x', 'y'],
	t: ['x', 'y'],
	a: ['rx', 'ry', 'xRotation', 'largeArc', 'sweep', 'x', 'y'],
}

const drawingCmdExpr = /[lhvcsqta]/

export function getSegmentSchema(type)
{
	return segmentSchemas[ type.toLowerCase() ]
}

export function isDrawingSegment(segment)
{
	return drawingCmdExpr.test(segment.type)
}
