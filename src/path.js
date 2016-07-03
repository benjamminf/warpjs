export default class Path
{
	constructor(...segments)
	{
		this.segments = Array.from(segments)
	}

	interpolate(threshold = 10)
	{
		for(let segment of this.segments)
		{
			segment.interpolate(threshold)
		}
	}

	points()
	{
		const points = []

		for(let segment of this.segments)
		{
			points.push(...segment.points())
		}

		return points
	}
}
