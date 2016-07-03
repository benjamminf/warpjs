import {interpolate} from '../util/piece'

export default class Point
{
	constructor(x = 0, y = 0)
	{
		this.x = x
		this.y = y
	}

	static interpolate(pointA, pointB, t = 0.5)
	{
		const {x, y} = interpolate([pointA, pointB], t)

		return new Point(x, y)
	}
}
