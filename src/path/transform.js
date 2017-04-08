export default function transform(path, transformer)
{
	const newPath = []

	for(let i = 0; i < path.length; i++)
	{
		const segment = JSON.parse(JSON.stringify(path[i]))
		const result = transformer(segment, i, path, newPath)

		if(Array.isArray(result))
		{
			newPath.push(...result)
		}
		else if(result)
		{
			newPath.push(result)
		}
	}

	return newPath
}
