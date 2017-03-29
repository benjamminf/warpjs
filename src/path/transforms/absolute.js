export default function absoluteGenerator()
{
	const xProps = ['x', 'x1', 'x2']
	const yProps = ['y', 'y1', 'y2']
	const drawingCmdExpr = /[lhvcsqta]/

	let prevX = 0
	let prevY = 0
	let pathStartX = NaN
	let pathStartY = NaN

	return function absolute(segment, i, path)
	{
		if(isNaN(pathStartX) && drawingCmdExpr.test(segment.command))
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		if(segment.command === 'z' && !isNaN(pathStartX))
		{
			prevX = pathStartX
			prevY = pathStartY
			pathStartX = NaN
			pathStartY = NaN
		}

		if(segment.relative)
		{
			for(let x of xProps)
			{
				if(x in segment)
				{
					segment[x] += prevX
				}
			}

			for(let y of yProps)
			{
				if(y in segment)
				{
					segment[y] += prevY
				}
			}

			segment.relative = false
		}
		
		prevX = ('x' in segment ? segment.x : prevX)
		prevY = ('y' in segment ? segment.y : prevY)

		if(segment.command === 'm')
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		return segment
	}
}
