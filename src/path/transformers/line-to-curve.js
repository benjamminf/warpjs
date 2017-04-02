import { isDrawingSegment } from '../utils'

export default function lineToCurveGenerator(curveType='q')
{
	let prevX = 0
	let prevY = 0
	let pathStartX = NaN
	let pathStartY = NaN

	return function lineToCurve(segment)
	{
		if(isNaN(pathStartX) && isDrawingSegment(segment.type))
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		if(segment.type === 'z' && !isNaN(pathStartX))
		{
			prevX = pathStartX
			prevY = pathStartY
			pathStartX = NaN
			pathStartY = NaN
		}

		if(segment.type === 'l')
		{
			const startX = (segment.relative ? 0 : prevX)
			const startY = (segment.relative ? 0 : prevY)

			segment.type = curveType

			switch(curveType)
			{
				case 'q':
				{
					segment.x1 = (startX + segment.x) / 2
					segment.y1 = (startY + segment.y) / 2
				}
				break
				case 'c':
				{
					const offsetX = (segment.x - startX) / 3
					const offsetY = (segment.y - startY) / 3

					segment.x1 = startX + offsetX
					segment.y1 = startY + offsetY
					segment.x2 = startX + 2 * offsetX
					segment.y2 = startY + 2 * offsetY
				}
				break
				default:
				{
					throw new Error(`Invalid curve type "${curveType}"`)
				}
			}
		}

		prevX = ('x' in segment ? (segment.relative ? prevX : 0) + segment.x : prevX)
		prevY = ('y' in segment ? (segment.relative ? prevY : 0) + segment.y : prevY)

		if(segment.type === 'm')
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		return segment
	}
}
