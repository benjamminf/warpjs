import pathTransform from '../path/transform'
import { joinSegments, pointGroups } from '../path/utils'

const extrapolationTypesExpr = /[lqc]/

export default function extrapolate(path, threshold, deltaFunction)
{
	return pathTransform(path, function(segment, i, oldPath, newPath)
	{
		if(i > 1)
		{
			const prevSegment = newPath[newPath.length - 1]
			const prevSegment2 = newPath[newPath.length - 2]

			if(extrapolationTypesExpr.test(segment.type) && prevSegment.type === segment.type)
			{
				const points = [
					[prevSegment2.x, prevSegment2.y],
					[segment.x, segment.y],
				]

				if(deltaFunction(points) <= threshold)
				{
					const newSegment = joinSegments(prevSegment, segment)

					if(newSegment)
					{
						newPath[newPath.length - 1] = newSegment

						return false
					}
				}
			}
		}

		return segment
	})
}
