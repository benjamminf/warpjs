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

export const pointGroups = [
	['x1', 'y1'],
	['x2', 'y2'],
	['x', 'y'],
]

const drawingCmdExpr = /[lhvcsqta]/

export function getSegmentSchema(type)
{
	return segmentSchemas[ type.toLowerCase() ]
}

export function isDrawingSegment(segment)
{
	return drawingCmdExpr.test(segment.type)
}

export function createLineSegment(points)
{
	const segment = { relative: false }

	switch(points.length)
	{
		case 2: { segment.type = 'l' } break
		case 3: { segment.type = 'q' } break
		case 4: { segment.type = 'c' } break
		default: return false
	}

	for(let i = 1; i < points.length; i++)
	{
		const g = (i < points.length - 1 ? i : pointGroups.length) - 1
		const [x, y] = pointGroups[g]

		segment[x] = points[i][0]
		segment[y] = points[i][1]

		if(points[i].length > 2)
		{
			segment.extended = segment.extended || {}
			segment.extended[g] = points[i].slice(2)
		}
	}

	return segment
}
