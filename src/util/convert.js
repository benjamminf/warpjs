import {create, attribute} from 'svg'

export function line(element)
{
	const x1 = attribute(element, 'x1')
	const y1 = attribute(element, 'y1')
	const x2 = attribute(element, 'x2')
	const y2 = attribute(element, 'y2')

	return create('path', {
		fill: 'transparent',
		d: [
			'M', x1, y1,
			'L', x2, y2
		].join(' ')
	})
}

export function circle(element)
{
	const cx = attribute(element, 'cx')
	const cy = attribute(element, 'cy')
	const r  = attribute(element, 'r')

	return create('path', {
		d: [
			'M', cx, cy - r,
			'A', r, r, 0, 0, 1, cx + r, cy,
			'A', r, r, 0, 0, 1, cx, cy + r,
			'A', r, r, 0, 0, 1, cx - r, cy,
			'A', r, r, 0, 0, 1, cx, cy - r,
			'Z'
		].join(' ')
	})
}

export function ellipse(element)
{
	const cx = attribute(element, 'cx')
	const cy = attribute(element, 'cy')
	const rx = attribute(element, 'rx')
	const ry = attribute(element, 'ry')

	return create('path', {
		d: [
			'M', cx, cy - ry,
			'A', rx, ry, 0, 0, 1, cx + rx, cy,
			'A', rx, ry, 0, 0, 1, cx, cy + ry,
			'A', rx, ry, 0, 0, 1, cx - rx, cy,
			'A', rx, ry, 0, 0, 1, cx, cy - ry,
			'Z'
		].join(' ')
	})
}

export function polygon(element)
{
	const points = element.points
	const path = ['M', points[0].x, points[0].y]

	for(let i = 1; i < points.length; i++)
	{
		path.push('L', points[i].x, points[i].y)
	}

	path.push('Z')

	return create('path', {
		d: path.join(' ')
	})
}

export function polyline(element)
{
	const points = element.points
	const path = ['M', points[0].x, points[0].y]

	for(let i = 1; i < points.length; i++)
	{
		path.push('L', points[i].x, points[i].y)
	}

	return create('path', {
		fill: 'transparent',
		d: path.join(' ')
	})
}

export function rect(element)
{
	let rx = attribute(element, 'rx')
	let ry = attribute(element, 'ry')
	const x = attribute(element, 'x')
	const y = attribute(element, 'y')
	const width = attribute(element, 'width')
	const height = attribute(element, 'height')
	const path = []

	// Apparently if one of the properties is not defined or zero, then it's just given the value of the other
	if(rx > 0 || ry > 0)
	{
		if(!rx) rx = ry
		if(!ry) ry = rx

		path.push(
			'M', x + rx, y,
			'H', x + width - rx,
			'A', rx, ry, 0, 0, 1, x + width, y + ry,
			'V', y + height - ry,
			'A', rx, ry, 0, 0, 1, x + width - rx, y + height,
			'H', x + rx,
			'A', rx, ry, 0, 0, 1, x, y + height - ry,
			'V', y + ry,
			'A', rx, ry, 0, 0, 1, x + rx, y
		)
	}
	else
	{
		path.push(
			'M', x, y,
			'H', x + width,
			'V', y + height,
			'H', x,
			'V', y
		)
	}

	path.push('Z')

	return create('path', {
		d: path.join(' ')
	})
}