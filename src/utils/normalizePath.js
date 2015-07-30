function normalizePath(path)
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
				case 'a': segments.replaceItem(path.createSVGPathSegArcAbs(x, y, segment.r1, segment.r2, segment.angle, segment.largeArcFlag, segment.sweepFlag), i); break;
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
}
