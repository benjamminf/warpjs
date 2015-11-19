/**
 *
 * @param svg
 */
function normalize(svg)
{
	var paths = svg.querySelectorAll('path');
	var shapes = svg.querySelectorAll('line, circle, ellipse, polygon, polyline, rect');
	var i, path, shape;

	for(i = 0; i < paths.length; i++)
	{
		path = paths[i];
		normalize.path(path);
	}

	for(i = 0; i < shapes.length; i++)
	{
		shape = shapes[i];
		path = normalize.convert(shape);
		shape.parentNode.replaceChild(path, shape);
	}
}

/**
 * TODO Replace close path types with an extra line back home
 *
 * @param path
 * @param smoothLines
 */
normalize.path = function(path, smoothLines)
{
	smoothLines = (smoothLines === null || smoothLines === undefined ? true : smoothLines);

	var x = 0;
	var y = 0;
	var segments = path.pathSegList;
	var i, segment, type, x0, y0, x1, y1, x2, y2, startPoint;

	for(i = 0; i < segments.numberOfItems; i++)
	{
		segment = segments.getItem(i);
		type = segment.pathSegTypeAsLetter;

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
				case 'm':
					segment = path.createSVGPathSegMovetoAbs(x, y);
					break;

				case 'c':
					segment = path.createSVGPathSegCurvetoCubicAbs(x, y, x1, y1, x2, y2);
					break;

				case 's':
					segment = path.createSVGPathSegCurvetoCubicSmoothAbs(x, y, x2, y2);
					break;

				case 'q':
					segment = path.createSVGPathSegCurvetoQuadraticAbs(x, y, x1, y1);
					break;

				case 't':
					segment = path.createSVGPathSegCurvetoQuadraticSmoothAbs(x, y);
					break;

				case 'a':
					segment = path.createSVGPathSegArcAbs(
						x, y,
						segment.r1, segment.r2,
						segment.angle,
						segment.largeArcFlag,
						segment.sweepFlag
					);
					break;

				case 'l':
				case 'h':
				case 'v':
					segment = path.createSVGPathSegLinetoAbs(x, y);
					break;

				case 'z':
				case 'Z':
					x = x0;
					y = y0;
					break;
			}

			segments.replaceItem(segment, i);
			type = type.toUpperCase();
		}

		// Record the start of a subpath
		if(type == 'M')
		{
			x0 = x;
			y0 = y;
		}
	}

	// Convert arcs to cubic beziers
	for(i = 0; i < segments.numberOfItems; i++)
	{
		segment = segments.getItem(i);

		if(segment.pathSegTypeAsLetter === 'A')
		{
			startPoint = this.getEndPoint(segments.getItem(i - 1));

			var arcSegs = this.arc(
				startPoint[0], startPoint[1],
				segment.r1, segment.r2,
				segment.angle,
				segment.largeArcFlag,
				segment.sweepFlag,
				segment.x, segment.y
			);

			if(arcSegs.length)
			{
				for(var j = 0; j < arcSegs.length; j++)
				{
					var arcSeg = arcSegs[j];
					var lineSeg = this.createLineSegment(path, arcSeg);

					if(!j)
					{
						segments.replaceItem(lineSeg, i);
					}
					else if(i < segments.numberOfItems - 1)
					{
						segments.insertItemBefore(lineSeg, ++i);
					}
					else
					{
						segments.appendItem(lineSeg);
					}
				}
			}
		}
	}

	if(smoothLines)
	{
		// Convert lines to quadratic beziers
		for(i = 0; i < segments.numberOfItems; i++)
		{
			segment = segments.getItem(i);

			if(segment.pathSegTypeAsLetter === 'L')
			{
				startPoint = this.getEndPoint(segments.getItem(i - 1));

				segments.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(
					segment.x, segment.y,
					(startPoint[0] + segment.x) / 2,
					(startPoint[1] + segment.y) / 2
				), i);
			}
		}
	}
};

normalize.getEndPoint = function(segment)
{
	if(segment)
	{
		if('x2' in segment) return [segment.x2, segment.y2];
		if('x1' in segment) return [segment.x1, segment.y1];
		if('x'  in segment) return [segment.x,  segment.y];
	}

	return [0, 0];
};

/**
 *
 * @param path
 * @param points
 * @returns {*}
 */
normalize.createLineSegment = function(path, points)
{
	switch(points.length)
	{
		case 1:
			return path.createSVGPathSegLinetoAbs(point[0][0], points[0][1]);
			break;

		case 2:
			return path.createSVGPathSegCurvetoQuadraticAbs(
				points[0][0], points[0][1],
				points[1][0], points[1][1]
			);
			break;
			break;

		case 3:
			return path.createSVGPathSegCurvetoCubicAbs(
				points[0][0], points[0][1],
				points[1][0], points[1][1],
				points[2][0], points[2][1]
			);
			break;
	}

	return null;
};

/**
 * https://svg.codeplex.com/SourceControl/latest#Source/Paths/SvgArcSegment.cs
 *
 * @param sx
 * @param sy
 * @param rx
 * @param ry
 * @param angle
 * @param large
 * @param sweep
 * @param ex
 * @param ey
 * @returns {*}
 */
normalize.arc = function(sx, sy, rx, ry, angle, large, sweep, ex, ey)
{
	if(sx === ex && sy === ey)
	{
		return [];
	}

	if(!rx && !ry)
	{
		return [
			[
				[ex, ey]
			]
		];
	}

	var sinPhi = Math.sin(angle * Math.PI / 180);
	var cosPhi = Math.cos(angle * Math.PI / 180);

	var xd =  cosPhi * (sx - ex) / 2 + sinPhi * (sy - ey) / 2;
	var yd = -sinPhi * (sx - ex) / 2 + cosPhi * (sy - ey) / 2;

	var rx2 = rx * rx;
	var ry2 = ry * ry;

	var xd2 = xd * xd;
	var yd2 = yd * yd;

	var root = 0;
	var numerator = rx2 * ry2 - rx2 * yd2 - ry2 * xd2;

	if(numerator < 0)
	{
		var s = Math.sqrt(1 - numerator / (rx2 * ry2));

		rx *= s;
		ry *= s;
	}
	else
	{
		root = ((large && sweep) || (!large && !sweep) ? -1 : 1) * Math.sqrt(numerator / (rx2 * yd2 + ry2 * xd2));
	}

	var cxd =  root * rx * yd / ry;
	var cyd = -root * ry * xd / rx;

	var cx = cosPhi * cxd - sinPhi * cyd + (sx + ex) / 2;
	var cy = sinPhi * cxd + cosPhi * cyd + (sy + ey) / 2;

	var theta1 = this.arc.angle(1, 0, (xd - cxd) / rx, (yd - cyd) / ry);
	var dtheta = this.arc.angle((xd - cxd) / rx, (yd - cyd) / ry, (-xd - cxd) / rx, (-yd - cyd) / ry);

	if(!sweep && dtheta > 0)
	{
		dtheta -= Math.PI * 2;
	}
	else if(sweep && dtheta < 0)
	{
		dtheta += Math.PI * 2;
	}

	var segments = [];
	var numSegs = Math.ceil(Math.abs(dtheta / (Math.PI / 2)));
	var delta = dtheta / numSegs;
	var t = 8 / 3 * Math.sin(delta / 4) * Math.sin(delta / 4) / Math.sin(delta / 2);

	for(var i = 0; i < numSegs; i++)
	{
		var cosTheta1 = Math.cos(theta1);
		var sinTheta1 = Math.sin(theta1);
		var theta2 = theta1 + delta;
		var cosTheta2 = Math.cos(theta2);
		var sinTheta2 = Math.sin(theta2);

		var epx = cosPhi * rx * cosTheta2 - sinPhi * ry * sinTheta2 + cx;
		var epy = sinPhi * rx * cosTheta2 + cosPhi * ry * sinTheta2 + cy;

		var dx = t * (-cosPhi * rx * sinTheta1 - sinPhi * ry * cosTheta1);
		var dy = t * (-sinPhi * rx * sinTheta1 + cosPhi * ry * cosTheta1);

		var dxe = t * (cosPhi * rx * sinTheta2 + sinPhi * ry * cosTheta2);
		var dye = t * (sinPhi * rx * sinTheta2 - cosPhi * ry * cosTheta2);

		segments.push([
			[epx, epy],
			[sx + dx, sy + dy],
			[epx + dxe, epy + dye]
		]);

		theta1 = theta2;
		sx = epx;
		sy = epy;
	}

	return segments;
};

/**
 *
 * @param ux
 * @param uy
 * @param vx
 * @param vy
 * @returns {number}
 */
normalize.arc.angle = function(ux, uy, vx, vy)
{
	var ta = Math.atan2(uy, ux);
	var tb = Math.atan2(vy, vx);

	if(tb >= ta)
	{
		return tb - ta;
	}

	return Math.PI * 2 - (ta - tb);
};

/**
 *
 * @param shape
 * @returns {*}
 */
normalize.convert = function(shape)
{
	var path = this.path(this.convert[shape.tagName](shape));

	for(var i = 0; i < shape.attributes.length; i++)
	{
		var attribute = shape.attributes[i];
		var name = attribute.nodeName;
		var value = attribute.nodeValue;

		// Avoid dimensional properties
		if(!/^(x|y|x1|y1|x2|y2|width|height|r|rx|ry|cx|cy|points|d)$/.test(name))
		{
			path.setAttribute(name, value);
		}
	}

	return path;
};

/**
 *
 * @param line
 * @returns {*}
 */
normalize.convert.line = function(line)
{
	var x1 = SVG.attribute(line, 'x1');
	var y1 = SVG.attribute(line, 'y1');
	var x2 = SVG.attribute(line, 'x2');
	var y2 = SVG.attribute(line, 'y2');

	return SVG('path', {
		fill: 'transparent',
		d: [
			'M', x1, y1,
			'L', x2, y2
		].join(' ')
	});
};

/**
 *
 * @param circle
 * @returns {*}
 */
normalize.convert.circle = function(circle)
{
	var cx = SVG.attribute(circle, 'cx');
	var cy = SVG.attribute(circle, 'cy');
	var r  = SVG.attribute(circle, 'r');

	return SVG('path', {
		d: [
			'M', cx, cy - r,
			'A', r, r, 0, 0, 1, cx + r, cy,
			'A', r, r, 0, 0, 1, cx, cy + r,
			'A', r, r, 0, 0, 1, cx - r, cy,
			'A', r, r, 0, 0, 1, cx, cy - r,
			'Z'
		].join(' ')
	});
};

/**
 *
 * @param ellipse
 * @returns {*}
 */
normalize.convert.ellipse = function(ellipse)
{
	var cx = SVG.attribute(ellipse, 'cx');
	var cy = SVG.attribute(ellipse, 'cy');
	var rx = SVG.attribute(ellipse, 'rx');
	var ry = SVG.attribute(ellipse, 'ry');

	return SVG('path', {
		d: [
			'M', cx, cy - ry,
			'A', rx, ry, 0, 0, 1, cx + rx, cy,
			'A', rx, ry, 0, 0, 1, cx, cy + ry,
			'A', rx, ry, 0, 0, 1, cx - rx, cy,
			'A', rx, ry, 0, 0, 1, cx, cy - ry,
			'Z'
		].join(' ')
	});
};

/**
 *
 * @param polygon
 * @returns {*}
 */
normalize.convert.polygon = function(polygon)
{
	var points = polygon.points;
	var path = ['M', points[0].x, points[0].y];

	for(var i = 1; i < points.length; i++)
	{
		path.push('L', points[i].x, points[i].y);
	}

	path.push('Z');

	return SVG('path', {
		d: path.join(' ')
	});
};

/**
 *
 * @param polyline
 * @returns {*}
 */
normalize.convert.polyline = function(polyline)
{
	var points = polyline.points;
	var path = ['M', points[0].x, points[0].y];

	for(var i = 1; i < points.length; i++)
	{
		path.push('L', points[i].x, points[i].y);
	}

	return SVG('path', {
		fill: 'transparent',
		d: path.join(' ')
	});
};

/**
 *
 * @param rect
 * @returns {*}
 */
normalize.convert.rect = function(rect)
{
	var x      = SVG.attribute(rect, 'x');
	var y      = SVG.attribute(rect, 'y');
	var rx     = SVG.attribute(rect, 'rx');
	var ry     = SVG.attribute(rect, 'ry');
	var width  = SVG.attribute(rect, 'width');
	var height = SVG.attribute(rect, 'height');
	var path   = [];

	// Apparently if one of the properties is not defined or zero, then it's just given the value of the other
	if(rx > 0 || ry > 0)
	{
		if(!rx) rx = ry;
		if(!ry) ry = rx;

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
		);
	}
	else
	{
		path.push(
			'M', x, y,
			'H', x + width,
			'V', y + height,
			'H', x,
			'V', y
		);
	}

	path.push('Z');

	return SVG('path', {
		d: path.join(' ')
	});
};
