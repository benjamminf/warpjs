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

export function joinSegments(segmentA, segmentB)
{
	if(segmentA.type === segmentB.type && segmentA.relative === segmentB.relative)
	{
		const { type, relative, x, y } = segmentB
		const bothExtended = !!segmentA.extended && !!segmentB.extended
		const extended = {}
		const segment = {
			type,
			relative,
			x,
			y,
			extended,
		}

		function setExtended(pointsA, pointsB, type)
		{
			if(pointsA && pointsB)
			{
				const points = []
				const pointCount = Math.min(pointsA.length, pointsB.length)

				for(let i = 0; i < pointCount; i++)
				{
					points.push((pointsA[i] + pointsB[i]) / 2)
				}

				segment.extended[type] = points
			}
		}

		switch(type)
		{
			case 'l': break
			case 'q':
			{
				segment = {
					type,
					relative,
					x1: (segmentA.x1 + segmentB.x1) / 2,
					y1: (segmentA.y1 + segmentB.y1) / 2,
					x,
					y,
					extended,
				}

				if(bothExtended)
				{
					setExtended(segmentA.extended[0], segmentB.extended[0], 0)
				}
			}
			break
			case 'c':
			{
				segment = {
					type,
					relative,
					x1: (segmentA.x1 + segmentA.x2) / 2,
					y1: (segmentA.y1 + segmentA.y2) / 2,
					x2: (segmentB.x1 + segmentB.x2) / 2,
					y2: (segmentB.y1 + segmentB.y2) / 2,
					x,
					y,
					extended,
				}

				if(bothExtended)
				{
					setExtended(segmentA.extended[0], segmentA.extended[1], 0)
					setExtended(segmentB.extended[0], segmentB.extended[1], 1)
				}
			}
			break
			default:
			{
				return false
			}
		}

		if(segmentB.extended && segmentB.extended[2])
		{
			extended[2] = segmentB.extended[2]
		}

		return segment
	}

	return false
}
