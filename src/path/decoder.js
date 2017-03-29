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

const segmentExpr = /([mzlhvcsqta])([^mzlhvcsqta]*)/ig
const numberExpr = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig

export default function decoder(pathString)
{
	const pathData = []

	let segmentMatch
	segmentExpr.lastIndex = 0
	
	while( (segmentMatch = segmentExpr.exec(pathString)) )
	{
		const command = segmentMatch[1].toLowerCase()
		const numbers = (segmentMatch[2].match(numberExpr) || []).map(parseFloat)
		const relative = (command === segmentMatch[1])

		const schema = segmentSchemas[command]

		if(numbers.length < schema.length)
		{
			throw new Error(`Malformed path data: command "${command}" has ${numbers.length} arguments, expected ${scheme.length}`)
		}

		if(numbers.length % schema.length !== 0)
		{
			throw new Error(`Malformed path data: command "${command}" has ${numbers.length} arguments, ${numbers.length % schema.length} too many`)
		}

		for(let i = 0; i < numbers.length / schema.length; i++)
		{
			const segmentData = { command, relative }

			for(let j = 0; j < schema.length; j++)
			{
				segmentData[ schema[j] ] = numbers[j]
			}

			pathData.append(segmentData)
		}
	}

	return pathData
}
