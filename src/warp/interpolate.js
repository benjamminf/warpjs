import pathTransform from '../path/transform'
import { until as interpolateUntil } from '../path/interpolate'
import { createLineSegment, pointGroups } from '../path/utils'

const interpolationTypesExpr = /[lqc]/

export default function interpolate(path, threshold, deltaFunction)
{
	let prevPoints = []

	return pathTransform(path, function(segment)
	{
		let segments = segment

		if(interpolationTypesExpr.test(segment.type))
		{
			const points = [prevPoints]

			for(let j = 0; j < pointGroups.length; j++)
			{
				const [x, y] = pointGroups[j]

				if(x in segment && y in segment)
				{
					const extendedPoints = (segment.extended ? segment.extended[j] : null) || []
					const pointList = [segment[x], segment[y], ...extendedPoints]

					points.push(pointList)
				}
			}

			const rawSegments = interpolateUntil(points, threshold, deltaFunction)

			if(rawSegments.length > 1)
			{
				segments = rawSegments.map(rawSegment => createLineSegment(rawSegment))
			}
		}

		if('x' in segment && 'y' in segment)
		{
			const extendedPoints = (segment.extended ? segment.extended[2] : null) || []
			const pointList = [segment.x, segment.y, ...extendedPoints]

			prevPoints = pointList
		}

		return segments
	})
}
