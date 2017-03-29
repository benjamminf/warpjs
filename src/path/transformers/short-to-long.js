export default function shortToLongGenerator()
{
	let prevX = 0
	let prevY = 0
	let pathStartX = NaN
	let pathStartY = NaN
	let prevCurveC2X = NaN
	let prevCurveC2Y = NaN
	let prevQuadCX = NaN
	let prevQuadCY = NaN

	return function shortToLong(segment)
	{
		if(isNaN(pathStartX) && segment.type !== 'm')
		{
			throw new Error(`Transform path error: path must start with "moveto"`)
		}
		
		if(segment.type === 's')
		{
			prevCurveC2X = isNaN(prevCurveC2X) ? prevX : prevCurveC2X
			prevCurveC2Y = isNaN(prevCurveC2Y) ? prevY : prevCurveC2Y

			segment.type = 'c'
			segment.x1 = (segment.relative ? 1 : 2) * prevX - prevCurveC2X
			segment.y1 = (segment.relative ? 1 : 2) * prevY - prevCurveC2Y
		}

		if(segment.type === 'c')
		{
			prevCurveC2X = (segment.relative ? prevX : 0) + segment.x2
			prevCurveC2Y = (segment.relative ? prevY : 0) + segment.y2
		}
		else
		{
			prevCurveC2X = NaN
			prevCurveC2Y = NaN
		}

		if(segment.type === 't')
		{
			prevQuadCX = isNaN(prevQuadCX) ? prevX : prevQuadCX
			prevQuadCY = isNaN(prevQuadCY) ? prevY : prevQuadCY

			segment.type = 'q'
			segment.x1 = (segment.relative ? 1 : 2) * prevX - prevQuadCX
			segment.y1 = (segment.relative ? 1 : 2) * prevY - prevQuadCY
		}

		if(segment.type === 'q')
		{
			prevQuadCX = (segment.relative ? prevX : 0) + segment.x1
			prevQuadCY = (segment.relative ? prevY : 0) + segment.y1
		}
		else
		{
			prevQuadCX = NaN
			prevQuadCY = NaN
		}

		if(segment.type === 'z')
		{
			prevX = pathStartX
			prevY = pathStartY
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
