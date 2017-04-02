export function line(x1, y1, x2, y2)
{
	const relative = false

	return [
		{ type: 'm', relative, x: x1, y: y1 },
		{ type: 'l', relative, x: x2, y: y2 },
	]
}

export function polyline(...points)
{
	return points.map((p, i) => ({
		type: i === 0 ? 'm' : 'l',
		relative: false,
		x: p.x || p[0],
		y: p.y || p[1],
	}))
}

export function polygon(...points)
{
	const path = polyline(...points)
	path.append({ type: 'z', relative: false })

	return path
}

export function rectangle(x, y, width, height, rx=0, ry=0)
{
	const relative = false
	let path

	if(rx > 0 || ry > 0)
	{
		// If one of the properties is not defined or zero, then it's just given the value of the other
		rx = rx || ry
		ry = ry || rx

		const xRotation = 0
		const largeArc = false
		const sweep = true

		path = [
			{ type: 'm', relative, x: x + rx, y },
			{ type: 'h', relative, x: x + width - rx },
			{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x: x + width, y: y + ry },
			{ type: 'v', relative, y: y + height - ry },
			{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x: x + width - rx, y: y + height },
			{ type: 'h', relative, x: x + rx },
			{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x, y: y + height - ry },
			{ type: 'v', relative, y: y + ry },
			{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x: x + rx, y },
		]
	}
	else
	{
		path = [
			{ type: 'm', relative, x, y },
			{ type: 'h', relative, x: x + width },
			{ type: 'v', relative, y: y + height },
			{ type: 'h', relative, x },
			{ type: 'v', relative, y },
		]
	}

	return path
}

export function ellipse(cx, cy, rx, ry)
{
	const relative = false
	const xRotation = 0
	const largeArc = false
	const sweep = true

	return [
		{ type: 'm', relative, x: cx, y: cy - ry },
		{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x: cx, y: cy + ry },
		{ type: 'a', relative, rx, ry, xRotation, largeArc, sweep, x: cx, y: cy - ry },
	]
}

export function circle(cx, cy, r)
{
	return ellipse(cx, cy, r, r)
}
