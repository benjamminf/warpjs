import { isDrawingSegment } from '../utils'

export default function arcToCurveGenerator()
{
	let prevX = 0
	let prevY = 0
	let pathStartX = NaN
	let pathStartY = NaN

	return function arcToCurve(segment)
	{
		if(isNaN(pathStartX) && isDrawingSegment(segment.type))
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		if(segment.type === 'z' && !isNaN(pathStartX))
		{
			prevX = pathStartX
			prevY = pathStartY
			pathStartX = NaN
			pathStartY = NaN
		}

		if(segment.type === 'a')
		{
			const s = segment
			const startX = (segment.relative ? 0 : prevX)
			const startY = (segment.relative ? 0 : prevY)
			const curveSegments = converter(startX, startY, s.rx, s.ry, s.xRotation, s.largeArc, s.sweep, s.x, s.y)

			for(let curveSegment of curveSegments)
			{
				curveSegment.relative = segment.relative
			}

			return curveSegments
		}

		prevX = ('x' in segment ? (segment.relative ? prevX : 0) + segment.x : prevX)
		prevY = ('y' in segment ? (segment.relative ? prevY : 0) + segment.y : prevY)

		if(segment.type === 'm')
		{
			pathStartX = prevX
			pathStartY = prevY
		}

		return segment
	}
}

function converter(sx, sy, rx, ry, angle, large, sweep, x, y)
{
	if(sx === x && sy === x)
	{
		return false
	}

	if(!rx && !ry)
	{
		return { type: 'l', x, y }
	}

	const sinPhi = Math.sin(angle * Math.PI / 180)
	const cosPhi = Math.cos(angle * Math.PI / 180)

	const xd =  cosPhi * (sx - x) / 2 + sinPhi * (sy - y) / 2
	const yd = -sinPhi * (sx - x) / 2 + cosPhi * (sy - y) / 2

	const rx2 = rx * rx
	const ry2 = ry * ry

	const xd2 = xd * xd
	const yd2 = yd * yd

	let root = 0
	const numerator = rx2 * ry2 - rx2 * yd2 - ry2 * xd2

	if(numerator < 0)
	{
		const s = Math.sqrt(1 - numerator / (rx2 * ry2))

		rx *= s
		ry *= s
	}
	else
	{
		root = ((large && sweep) || (!large && !sweep) ? -1 : 1) * Math.sqrt(numerator / (rx2 * yd2 + ry2 * xd2))
	}

	const cxd =  root * rx * yd / ry
	const cyd = -root * ry * xd / rx

	const cx = cosPhi * cxd - sinPhi * cyd + (sx + x) / 2
	const cy = sinPhi * cxd + cosPhi * cyd + (sy + y) / 2

	let theta1 = angleBetween(1, 0, (xd - cxd) / rx, (yd - cyd) / ry)
	let dtheta = angleBetween((xd - cxd) / rx, (yd - cyd) / ry, (-xd - cxd) / rx, (-yd - cyd) / ry)

	if(!sweep && dtheta > 0)
	{
		dtheta -= Math.PI * 2
	}
	else if(sweep && dtheta < 0)
	{
		dtheta += Math.PI * 2
	}

	const segments = []
	const numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)))
	const delta = dtheta / numSegs
	const t = 8 / 3 * Math.sin(delta / 4) * Math.sin(delta / 4) / Math.sin(delta / 2)

	for(let i = 0; i < numSegs; i++)
	{
		const cosTheta1 = Math.cos(theta1)
		const sinTheta1 = Math.sin(theta1)
		const theta2 = theta1 + delta
		const cosTheta2 = Math.cos(theta2)
		const sinTheta2 = Math.sin(theta2)

		const epx = cosPhi * rx * cosTheta2 - sinPhi * ry * sinTheta2 + cx
		const epy = sinPhi * rx * cosTheta2 + cosPhi * ry * sinTheta2 + cy

		const dx = t * (-cosPhi * rx * sinTheta1 - sinPhi * ry * cosTheta1)
		const dy = t * (-sinPhi * rx * sinTheta1 + cosPhi * ry * cosTheta1)

		const dxe = t * (cosPhi * rx * sinTheta2 + sinPhi * ry * cosTheta2)
		const dye = t * (sinPhi * rx * sinTheta2 - cosPhi * ry * cosTheta2)

		segments.push({
			type: 'c',
			x1: epx,
			y1: epy,
			x2: sx + dx,
			y2: sy + dy,
			x: epx + dxe,
			y: epy + dye,
		})

		theta1 = theta2
		sx = epx
		sy = epy
	}

	return segments
}

function angleBetween(ux, uy, vx, vy)
{
	const ta = Math.atan2(uy, ux)
	const tb = Math.atan2(vy, vx)

	if(tb >= ta)
	{
		return tb - ta
	}

	return Math.PI * 2 - (ta - tb)
}
