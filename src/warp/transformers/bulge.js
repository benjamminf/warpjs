export default function bulgeFactory(radius, weight, cx=0, cy=0)
{
	return function bulge([ x, y, ...points ])
	{
		return [
			x,
			y,
			...points,
		]
	}
}
