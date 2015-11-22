(function(root, factory)
{
	if(typeof define === 'function' && define.amd)
	{
		define([], factory);
	}
	else
	{
		root.DVG = factory();
	}
}(this, function()
{
	"use strict";

function SVG(tag, attributes)
{
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);

	for(var name in attributes) if(attributes.hasOwnProperty(name))
	{
		el.setAttribute(name, attributes[name]);
	}

	return el;
}

SVG.attribute = function(element, name)
{
	if(element[name] instanceof SVGAnimatedLength)
	{
		return element[name].baseVal.value;
	}

	return element.getAttribute(name);
};

/**
 *
 * @param p Segment: [StartPoint[x,y], ControlPoint[x,y]..., EndPoint[x,y]]
 * @param t [0-1]
 * @returns Segments [Segment, Segment]
 */
function interpolate(p, t)
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
}

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
		div = this(seg, 1 / (n - segs.length + 1));

		segs[segs.length - 1] = div[0];
		segs.push(div[1]);
	}

	return segs;
};

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
			startPoint = segments.getItem(i - 1);

			var arcSegs = this.arc(
				startPoint.x, startPoint.y,
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
				startPoint = segments.getItem(i - 1);

				segments.replaceItem(path.createSVGPathSegCurvetoQuadraticAbs(
					segment.x, segment.y,
					(startPoint.x + segment.x) / 2,
					(startPoint.y + segment.y) / 2
				), i);
			}
		}
	}
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
	var path = this.convert[shape.tagName](shape);

	normalize.path(path);

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

function Point(x, y, type)
{
	this._id = Point._ids++;

	this._x = 0;
	this._y = 0;
	this._type = Point.NORMAL;

	this.x(x);
	this.y(y);
	this.type(type);

	this._restX = this.x();
	this._restY = this.y();
}

Point._ids = 0;

Point.NORMAL  = Point[1] = 1;
Point.CONTROL = Point[2] = 2;

var fn = Point.prototype;

fn.x = function(x)
{
	if(typeof x === 'number')
	{
		this._x = x;
		this[0] = x;
	}

	return this._x;
};

fn.y = function(y)
{
	if(typeof y === 'number')
	{
		this._y = y;
		this[1] = y;
	}

	return this._y;
};

fn.restX = function(x)
{
	if(typeof x === 'number')
	{
		this._restX = x;
	}

	return this._restX;
};

fn.restY = function(y)
{
	if(typeof y === 'number')
	{
		this._restY = y;
	}

	return this._restY;
};

fn.type = function(type)
{
	if(Point[type])
	{
		this._type = type;
	}

	return this._type;
};

fn.toString = function()
{
	return this._x + ' ' + this._y;
};

fn.hashCode = function()
{
	return this._id;
};

function FixedPoint(x, y, type)
{
	Point.call(this, x, y, type);

	this._origX = this.x();
	this._origY = this.y();
}

var fn = FixedPoint.prototype = new Point;
fn.constructor = FixedPoint;

fn.origX = function(x)
{
	if(typeof x === 'number')
	{
		this._origX = x;
	}

	return this._origX;
};

fn.origY = function(y)
{
	if(typeof y === 'number')
	{
		this._origY = y;
	}

	return this._origY;
};

function Piece(points)
{
	// TODO arguments variable sometimes keeps arguments[0] as empty array! What!?
	var args = (points && points.length ? points : arguments);

	points = [];
	var pointStart;
	var pointEnd;
	var pointControl1;
	var pointControl2;

	switch(args.length)
	{
		// Quadratic bezier
		case 3:
			pointStart    = args[0];
			pointControl1 = args[1];
			pointEnd      = args[2];
			break;

		// Cubic bezier
		case 4:
			pointStart    = args[0];
			pointControl1 = args[1];
			pointControl2 = args[2];
			pointEnd      = args[3];
			break;

		default:
			throw new Error('Need either three or four points to form a piece');
	}

	if(pointStart.type() !== Point.NORMAL)
		throw new Error('First point must be of NORMAL type');

	if(pointEnd.type() !== Point.NORMAL)
		throw new Error('Last point must be of NORMAL type');

	if(pointControl1.type() !== Point.CONTROL)
		throw new Error('Second point must be of CONTROL type');

	if(pointControl2 && pointControl2.type() !== Point.CONTROL)
		throw new Error('Third point must be of CONTROL type');

	points.push(pointStart, pointControl1);
	if(pointControl2) points.push(pointControl2);
	points.push(pointEnd);

	this._points = points;
}

Piece.QUADRATIC = Piece[3] = 3;
Piece.CUBIC     = Piece[4] = 4;

Piece.extrapolate = function(piece1, piece2)
{
	if(piece1.endPoint() !== piece2.startPoint())
	{
		throw new Error('Second piece must be joined to the first piece.');
	}

	if(piece1.type() !== piece2.type())
	{
		throw new Error('Pieces must be of the same type.');
	}

	var startPoint = piece1.startPoint();
	var endPoint = piece2.endPoint();
	var controlPointL, controlPointR, controlPoint;

	var joiningFixed = startPoint instanceof FixedPoint && endPoint instanceof FixedPoint;

	switch(piece1.type())
	{
		case Piece.QUADRATIC:

			controlPointL = piece1.point(1);
			controlPointR = piece2.point(1);

			if(controlPointL instanceof FixedPoint)
			{
				controlPoint = controlPointL;
			}
			else if(controlPointR instanceof FixedPoint)
			{
				controlPoint = controlPointR;
			}
			else
			{
				controlPoint = new Point(0, 0, Point.CONTROL);
			}

			if(joiningFixed)
			{
				controlPoint.restX(controlPoint.origX());
				controlPoint.restY(controlPoint.origY());
			}
			else
			{
				controlPoint.restX((controlPointL.restX() + controlPointR.restX()) / 2);
				controlPoint.restY((controlPointL.restY() + controlPointR.restY()) / 2);
			}

			controlPoint.x((controlPointL.x() + controlPointR.x()) / 2);
			controlPoint.y((controlPointL.y() + controlPointR.y()) / 2);

			return new Piece([startPoint, controlPoint, endPoint]);

			break;
		case Piece.CUBIC:

			var controlPointL1 = piece1.point(1);
			var controlPointL2 = piece1.point(2);
			var controlPointR1 = piece2.point(1);
			var controlPointR2 = piece2.point(2);

			if(controlPointL1 instanceof FixedPoint)
			{
				controlPointL = controlPointL1;
			}
			else
			{
				controlPointL = new Point(0, 0, Point.CONTROL);
			}

			if(controlPointR2 instanceof FixedPoint)
			{
				controlPointR = controlPointR2;
			}
			else
			{
				controlPointR = new Point(0, 0, Point.CONTROL);
			}

			if(joiningFixed)
			{
				controlPointL.restX(controlPointL.origX());
				controlPointL.restY(controlPointL.origY());
				controlPointR.restX(controlPointR.origX());
				controlPointR.restY(controlPointR.origY());
			}
			else
			{
				controlPointL.restX((controlPointL1.restX() + controlPointL2.restX()) / 2);
				controlPointL.restY((controlPointL1.restY() + controlPointL2.restY()) / 2);
				controlPointR.restX((controlPointR1.restX() + controlPointR2.restX()) / 2);
				controlPointR.restY((controlPointR1.restY() + controlPointR2.restY()) / 2);
			}

			controlPointL.x((controlPointL1.x() + controlPointL2.x()) / 2);
			controlPointL.y((controlPointL1.y() + controlPointL2.y()) / 2);
			controlPointR.x((controlPointR1.x() + controlPointR2.x()) / 2);
			controlPointR.y((controlPointR1.y() + controlPointR2.y()) / 2);

			return new Piece([startPoint, controlPointL, controlPointR, endPoint]);

			break;
	}

	return false;
};

var fn = Piece.prototype;

fn.point = function(index)
{
	index = (index | 0) % this._points.length;
	index += (index < 0 ? this._points.length : 0);

	return this._points[index];
};

fn.startPoint = function()
{
	return this.point(0);
};

fn.endPoint = function()
{
	return this.point(-1);
};

fn.type = function()
{
	return Piece[this._points.length];
};

// TODO This should actually calculate the arc length of the curve rather than just the linear distance between
// the start and end. Simple way would be divide path into n segments (probably two)
fn.delta = function()
{
	var start = this.startPoint();
	var end = this.endPoint();

	var dx = end.x() - start.x();
	var dy = end.y() - start.y();

	return Math.sqrt(dx * dx + dy * dy);
};

fn.interpolate = function()
{
	var points = this._points;
	var pointsCount = points.length;
	var i, j, point;

	var primPoints = [];
	var primRestPoints = [];

	for(i = 0; i < pointsCount; i++)
	{
		point = points[i];
		primPoints.push(point);
		primRestPoints.push([point.restX(), point.restY()]);
	}

	var primPieces = interpolate(primPoints, 0.5);
	var primRestPieces = interpolate(primRestPoints, 0.5);

	// ----

	var pieces = [];
	var piecePoints, primPiece, primRestPiece, primPoint, primRestPoint;

	for(i = 0; i < 2; i++)
	{
		primPiece = primPieces[i];
		primRestPiece = primRestPieces[i];
		piecePoints = [];

		for(j = 0; j < pointsCount; j++)
		{
			point = points[j];

			if(!(i === 0 && j === 0) && !(i === 1 && j === pointsCount - 1))
			{
				primPoint = primPiece[j];
				primRestPoint = primRestPiece[j];

				// Make sure fixed points are preserved and not overridden
				if((j < pointsCount / 2) === (i === 0) && point instanceof FixedPoint)
				{
					point.x(primPoint[0]);
					point.y(primPoint[1]);
					point.restX(primRestPoint[0]);
					point.restY(primRestPoint[1]);
				}
				// Make sure last point on first piece is shared with first point on second piece
				else if(i === 1 && j === 0)
				{
					point = pieces[0].endPoint();
				}
				else
				{
					point = new Point(primPoint[0], primPoint[1], point.type());
					point.restX(primRestPoint[0]);
					point.restY(primRestPoint[1]);
				}
			}

			piecePoints.push(point);
		}

		pieces.push(new Piece(piecePoints));
	}

	return pieces;
};

fn.toString = function(includeMove)
{
	includeMove = (includeMove === true);

	var point;
	var s = [];

	if(includeMove)
	{
		point = this.startPoint();
		s.push('M', point.toString());
	}

	s.push(this.type() === Piece.QUADRATIC ? 'Q' : 'C');

	for(var i = 1; i < this._points.length; i++)
	{
		point = this.point(i);
		s.push(point.toString());
	}

	return s.join(' ');
};

function Segment(points)
{
	var args = (points && points.length ? points : arguments);
	var piece = new Piece(args);

	for(var i = 0; i < args.length; i++)
	{
		if(!(args[i] instanceof FixedPoint))
		{
			throw new Error('All points must be instances of FixedPoint');
		}
	}

	this._pieces = [piece];
}

var fn = Segment.prototype;

fn.startPoint = function()
{
	return this._pieces[0].startPoint();
};

fn.endPoint = function()
{
	return this._pieces[this._pieces.length - 1].endPoint();
};

fn.interpolate = function(threshold)
{
	if(threshold <= 0.001)
	{
		throw new Error('Threshold is far too small and will result in either very poor performance or an infinite loop');
	}

	for(var i = 0; i < this._pieces.length; i++)
	{
		var piece = this._pieces[i];

		if(piece.delta() > threshold)
		{
			var pieces = piece.interpolate();

			this._pieces[i] = pieces[0];
			this._pieces.splice(i + 1, 0, pieces[1]); // TODO this increases complexity to n^2, try replacing this by building a new array

			// Step back so the new pieces can be recursively interpolated
			i--;
		}
	}
};

fn.extrapolate = function(threshold)
{
	var priorPiece = this._pieces[0];
	var newPieces = [priorPiece];

	for(var i = 1; i < this._pieces.length; i++)
	{
		var piece = this._pieces[i];

		if(piece.delta() < threshold)
		{
			piece = Piece.extrapolate(priorPiece, piece);
			newPieces[newPieces.length - 1] = piece;
		}
		else
		{
			newPieces.push(piece);
		}

		priorPiece = piece;
	}

	this._pieces = newPieces;
};

fn.toString = function(includeMove)
{
	includeMove = (includeMove === true);

	var s = [];

	for(var i = 0; i < this._pieces.length; i++)
	{
		var piece = this._pieces[i];
		s.push(piece.toString(i === 0 && includeMove));
	}

	return s.join(' ');
};

function Path(segments, interThreshold, extraThreshold)
{
	this._segments = [];

	if(segments && segments.length)
	{
		for(var i = 0; i < segments.length; i++)
		{
			this.addSegment(segments[i]);
		}
	}
}

Path.fromElement = function(element)
{
	var path = new Path();
	var segList = element.pathSegList;
	var priorPoint = new FixedPoint(0, 0);
	var nextPoint;
	var segment;

	for(var i = 0; i < segList.numberOfItems; i++)
	{
		var segItem = segList.getItem(i);
		var type = segItem.pathSegTypeAsLetter;

		switch(type)
		{
			case 'M':

				nextPoint = new FixedPoint(segItem.x, segItem.y);

				break;
			case 'Q':

				nextPoint = new FixedPoint(segItem.x, segItem.y);
				segment = new Segment(
					priorPoint,
					new FixedPoint(segItem.x1, segItem.y1, Point.CONTROL),
					nextPoint
				);

				path.addSegment(segment);

				break;
			case 'C':

				nextPoint = new FixedPoint(segItem.x, segItem.y);
				segment = new Segment(
					priorPoint,
					new FixedPoint(segItem.x1, segItem.y1, Point.CONTROL),
					new FixedPoint(segItem.x2, segItem.y2, Point.CONTROL),
					nextPoint
				);

				path.addSegment(segment);

				break;
		}

		priorPoint = nextPoint;
	}

	return path;
};

var fn = Path.prototype;

fn.addSegment = function(segment)
{
	if(!(segment instanceof Segment))
	{
		throw new Error('Must be a valid Segment instance');
	}

	this._segments.push(segment);
};

fn.points = function()
{
	var pointsMap = {};
	var points = [];

	// TODO Maybe offload these loops to their respective classes?
	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];

		for(var j = 0; j < segment._pieces.length; j++)
		{
			var piece = segment._pieces[j];

			for(var k = 0; k < piece._points.length; k++)
			{
				var point = piece._points[k];
				var hash = point.hashCode();

				if(!pointsMap.hasOwnProperty(hash))
				{
					pointsMap[hash] = point;
					points.push(point);
				}
			}
		}
	}

	return points;
};

// Private?
fn.interpolate = function(threshold)
{
	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];
		segment.interpolate(threshold);
	}
};

// Private?
fn.extrapolate = function(threshold)
{
	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];
		segment.extrapolate(threshold);
	}
};

fn.toString = function()
{
	var priorSegment;
	var s = [];

	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];

		s.push(segment.toString(
			!priorSegment ||
			priorSegment.endPoint() !== segment.startPoint()
		));

		priorSegment = segment;
	}

	return s.join(' ');
};

/**
 *
 * @param svg
 * @param mode
 * @param interThreshold
 * @param extraThreshold
 * @returns {DVG}
 * @constructor
 */
function DVG(svg, mode, interThreshold, extraThreshold)
{
	if(!(this instanceof DVG))
	{
		return new DVG(svg, mode, interThreshold, extraThreshold);
	}

	normalize(svg);

	var pathElements = svg.querySelectorAll('path');

	this._paths = [];
	this._mode = (mode === undefined ? DVG.STATIC_INTERPOLATION : mode);
	this._interThreshold = isNaN(interThreshold) ? DVG.DEFAULT_INTERPOLATION_THRESHOLD : interThreshold;
	this._extraThreshold = isNaN(extraThreshold) ? DVG.DEFAULT_EXTRAPOLATION_THRESHOLD : extraThreshold;

	for(var i = 0; i < pathElements.length; i++)
	{
		var element = pathElements[i];
		var path = Path.fromElement(element);

		path.interpolate(this._interThreshold);
		element.setAttribute('d', path.toString());

		this._paths.push({
			path: path,
			element: element
		});
	}
}

DVG.STATIC_INTERPOLATION  = 1;
DVG.DYNAMIC_INTERPOLATION = 2;
DVG.DYNAMIC_AUTOPOLATION  = 3;

DVG.DEFAULT_INTERPOLATION_THRESHOLD = 10;
DVG.DEFAULT_EXTRAPOLATION_THRESHOLD = 2.5;

var fn = DVG.prototype;

fn.withPoints = function(callback)
{
	var pointsMap = {};

	for(var m = 0; m < this._paths.length; m++)
	{
		var element = this._paths[m].element;
		var path = this._paths[m].path;

		// TODO Maybe offload these loops to their respective classes?
		for(var i = 0; i < path._segments.length; i++)
		{
			var segment = path._segments[i];

			for(var j = 0; j < segment._pieces.length; j++)
			{
				var piece = segment._pieces[j];

				for(var k = 0; k < piece._points.length; k++)
				{
					var point = piece._points[k];
					var hash = point.hashCode();

					if(!pointsMap.hasOwnProperty(hash))
					{
						pointsMap[hash] = point;

						callback.call(point, point.x(), point.y());
					}
				}
			}
		}

		switch(this._mode)
		{
			case DVG.DYNAMIC_INTERPOLATION:
				path.interpolate(this._interThreshold);
				break;

			case DVG.DYNAMIC_AUTOPOLATION:
				path.extrapolate(this._extraThreshold);
				path.interpolate(this._interThreshold);
				break;
		}

		element.setAttribute('d', path.toString());
	}
};

/**
 * Main
 */
function main()
{
	DVG.Point = Point;
	DVG.FixedPoint = FixedPoint;
	DVG.Piece = Piece;
	DVG.Segment = Segment;
	DVG.Path = Path;

	return DVG;
}

	return main();
}));
