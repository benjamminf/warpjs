/**
 *
 * @param p [StartPoint{x,y}, ControlPoint{x,y}..., EndPoint{x,y}]
 * @param t [0-1]
 * @returns {*[]}
 */
export function split(p, t = 0.5)
{
	p = Array.from(p)
	t = Math.max(0, Math.min(t, 1))

	const seg0 = []
	const seg1 = []
	const orders = [p]
	let i, q, q0, q1, r

	while(orders.length < p.length)
	{
		q = orders[orders.length - 1]
		r = []

		for(i = 1; i < q.length; i++)
		{
			q0 = q[i - 1]
			q1 = q[i]

			r.push({
				x: q0.x + (q1.x - q0.x) * t,
				y: q0.y + (q1.y - q0.y) * t
			})
		}

		orders.push(r)
	}

	for(i = 0; i < orders.length; i++)
	{
		seg0.push(orders[i][0])
		seg1.push(orders[orders.length - 1 - i][i])
	}

	return [seg0, seg1]
}

/**
 *
 * @param p [StartPoint{x,y}, ControlPoint{x,y}..., EndPoint{x,y}]
 * @param t [0-1]
 * @returns Point{x,y}
 */
export function interpolate(p, t = 0.5)
{
	const [seg] = split(p, t)

	return seg[seg.length - 1]
}
