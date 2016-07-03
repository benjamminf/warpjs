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
		const points = new Set()

		for(let segment of this.segments)
		{
			for(let point of segment.points())
			{
				points.add(point)
			}
		}

		return points.values()
	}
}
