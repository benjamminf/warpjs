export default function hvzToLineGenerator()
{
	let prevX = 0
	let prevY = 0
	let pathStartX = NaN
	let pathStartY = NaN

	return function hvzToLineGenerator(segment)
	{
		switch(segment.command)
		{
			case 'm':
			{
				if(isNaN(pathStartX))
				{
					throw new Error(`Transform path error: path must start with "moveto"`)
				}
			}
			break
			case 'h':
			{
				segment.command = 'l'
				segment.y = (segment.relative ? 0 : prevY)
			}
			break
			case 'v':
			{
				segment.command = 'l'
				segment.x = (segment.relative ? 0 : prevX)
			}
			break
			case 'z':
			{
				segment.command = 'l'
				segment.x = (segment.relative ? pathStartX - prevX : pathStartX)
				segment.y = (segment.relative ? pathStartY - prevY : pathStartY)
			}
			break
			case 'a':
			{
				if(segment.rx === 0 || segment.ry === 0)
				{
					segment.command = 'l'

					delete segment.rx
					delete segment.ry
					delete segment.xRotation
					delete segment.largeArc
					delete segment.sweep
				}
			}
			break
		}

		prevX = (segment.relative ? prevX + segment.x : segment.x)
		prevY = (segment.relative ? prevY + segment.y : segment.y)

		if(segment.command === 'm')
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		return segment
	}
}
