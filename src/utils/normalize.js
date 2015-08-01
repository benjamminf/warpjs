/**
 *
 * @param svg
 */
function normalize(svg)
{
	// Convert each SVG shape to a path element, and pass all other style properties across


	return svg;
}

/**
 * TODO Convert Line (L/l) to quadratics
 * @param path
 */
normalize.path = function(path)
{
	var x = 0;
	var y = 0;
	var segments = path.pathSegList;
	var x0, y0, x1, y1, x2, y2;

	for(var i = 0; i < segments.numberOfItems; i++)
	{
		var segment = segments.getItem(i);
		var type = segment.pathSegTypeAsLetter;

		if(/[MLHVCSQTA]/.test(type))
		{
			if('x' in segment) x = segment.x;
			if('y' in segment) y = segment.y;

			// Replace single dimension segments with full X and Y so distortions on this segment can happen on both axis.
			if(type == 'H' || type == 'V')
			{
				segments.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i);
			}
		}
		else
		{
			if('x1' in segment) x1 = x + segment.x1;
			if('x2' in segment) x2 = x + segment.x2;
			if('y1' in segment) y1 = y + segment.y1;
			if('y2' in segment) y2 = y + segment.y2;
			if('x'  in segment) x += segment.x;
			if('y'  in segment) y += segment.y;

			switch(type)
			{
				case 'm': segments.replaceItem(path.createSVGPathSegMovetoAbs(x, y), i); break;
				case 'c': segments.replaceItem(path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2), i); break;
				case 's': segments.replaceItem(path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2), i); break;
				case 'q': segments.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1), i); break;
				case 't': segments.replaceItem(path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y), i); break;
				// TODO Convert arc to bezier
				case 'a': segments.replaceItem(path.createSVGPathSegArcAbs(x, y, segment.r1, segment.r2, segment.angle, segment.largeArcFlag, segment.sweepFlag), i); break;
				// TODO Consider converting line segments to quadratic curves that have the control point midway through
				case 'l': case 'h': case 'v': segments.replaceItem(path.createSVGPathSegLinetoAbs(x, y), i); break;
				case 'z': case 'Z':
				x = x0;
				y = y0;
				break;
			}
		}

		// Record the start of a subpath
		if(type == 'M' || type == 'm')
		{
			x0 = x;
			y0 = y;
		}
	}
};

/**
 *
 * @param segment
 */
normalize.convert = function(segment)
{
	var path = this.path(this.convert[segment.tagName](segment));


};

normalize.convert.KAPPA = 0.55228474;

normalize.convert.line = function(line)
{
	var x1 = SVG.attribute(line, 'x1');
	var y1 = SVG.attribute(line, 'y1');
	var x2 = SVG.attribute(line, 'x2');
	var y2 = SVG.attribute(line, 'y2');

	return SVG('path', {
		d: [
			'M', x1, y1,
			'L', x2, y2
		].join(' ')
	});
};

normalize.convert.circle = function(circle)
{
	var cx = SVG.attribute(circle, 'cx');
	var cy = SVG.attribute(circle, 'cy');
	var r = SVG.attribute(circle, 'r');
	var cd = r * this.KAPPA;

	return SVG('path', {
		d: [
			'M', cx, cy - r,
			'C', cx + cd, cy - r,  cx + r,  cy - cd, cx + r, cy,
			'C', cx + r,  cy + cd, cx + cd, cy + r,  cx,     cy + r,
			'C', cx - cd, cy + r,  cx - r,  cy + cd, cx - r, cy,
			'C', cx - r,  cy - cd, cx - cd, cy - r,  cx,     cy - r
		].join(' ')
	});
};

normalize.convert.ellipse = function(ellipse)
{
	// TODO
};

normalize.convert.polygon = function(polygon)
{
	// TODO
};

normalize.convert.polyline = function(polyline)
{
	// TODO
};

normalize.convert.rect = function(rect)
{
	// TODO
};
