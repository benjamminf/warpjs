export default function bulgeFactory(radius, weight, cx=0, cy=0)
{
	return function bulge([ x, y, ...points ])
	{
		const ox = x - cx
		const oy = y - cy
		const rx = ox / radius
		const ry = oy / radius
		const r = Math.sqrt(rx**2 + ry**2)
		const theta = Math.atan2(ry, rx)
		const rn = 2 * r**2.5
		const rw = r * (1 - weight) - rn * weight

		return [
			rw * Math.cos(theta) * radius + cx,
			rw * Math.sin(theta) * radius + cy,
			...points,
		]
	}
}
