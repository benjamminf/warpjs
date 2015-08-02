/**
 *
 * @param path
 * @param segment
 * @param order
 */
function interpolate(path, segment, order)
{
	// Remember to check for close path types

	var points;

	switch(segment.pathSegTypeAsLetter)
	{
		case 'L':

			points = [
				[]
			];
			break;
	}
}


/**
 *
 * @param p
 * @param t
 * @returns {*[]}
 */
interpolate.divide = function(p, t)
{
	var seg0 = [];
	var seg1 = [];
	var orders = [p];
	var i, q, q0, q1, r;

	while(orders.length < p.length)
	{
		q = orders[orders.length - 1];
		r = [];

		for(i = 1; i < q.length; i++)
		{
			q0 = q[i - 1];
			q1 = q[i];

			r.push([
				q0[0] + (q1[0] - q0[0]) * t,
				q0[1] + (q1[1] - q0[1]) * t
			]);
		}

		orders.push(r);
	}

	for(i = 0; i < orders.length; i++)
	{
		seg0.push(orders[i][0]);
		seg1.push(orders[orders.length - 1 - i][i]);
	}

	return [seg0, seg1];
};

/**
 *
 * @param p
 * @param n
 * @returns {*[]}
 */
interpolate.compute = function(p, n)
{
	var segs = [p];
	var seg, div;

	while(segs.length < n)
	{
		seg = segs[segs.length - 1];
		div = this.divide(seg, 1 / (n - segs.length + 1));

		segs[segs.length - 1] = div[0];
		segs.push(div[1]);
	}

	return segs;
};
