export default function spiralFactory(radius, angle, cx=0, cy=0)
{
	return function spiral([ x, y, ...points ])
	{
		const ox = x - cx
		const oy = y - cy
		const dist = Math.sqrt(ox**2 + oy**2)
		const rad = dist / radius * angle
		const cos = Math.cos(rad)
		const sin = Math.sin(rad)

		return [
			ox * cos + oy * sin + cx,
			oy * cos - ox * sin + cy,
			...points,
		]
	}
}
