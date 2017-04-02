export default function interpolator(p, t=0.5)
{
	const seg0 = []
	const seg1 = []
	const orders = [p]

	while(orders.length < p.length)
	{
		const q = orders[orders.length - 1]
		const r = []

		for(let i = 1; i < q.length; i++)
		{
			const q0 = q[i - 1]
			const q1 = q[i]
			const s = []
			const dim = Math.max(q0.length, q1.length)

			for(let j = 0; j < dim; j++)
			{
				const s0 = q0[j] || 0
				const s1 = q1[j] || 0

				s.push(s0 + (s1 - s0) * t)
			}

			r.push(s)
		}

		orders.push(r)
	}

	for(let i = 0; i < orders.length; i++)
	{
		seg0.push(orders[i][0])
		seg1.push(orders[orders.length - 1 - i][i])
	}

	return [seg0, seg1]
}
