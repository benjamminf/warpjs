import { getSegmentSchema } from './utils'

export default function encoder(pathData, precision=2)
{
	let prevType = false
	let magnitude = 10**precision

	return pathData.map(function(segment)
	{
		const output = []
		const outputType = (segment.relative ? segment.type : segment.type.toUpperCase())

		const schema = getSegmentSchema(segment.type)

		if(prevType !== outputType)
		{
			output.push(outputType)
			prevType = outputType
		}

		for(let property of schema)
		{
			const value = segment[property]
			let outputValue

			switch(typeof value)
			{
				case 'boolean': { outputValue = value|0 } break
				case 'number': { outputValue = ((value * magnitude)|0) / magnitude } break
				default: throw new Error('Invalid path data')
			}

			output.push(' ', outputValue)
		}

		return output.join('')
		
	}).join('')
}
