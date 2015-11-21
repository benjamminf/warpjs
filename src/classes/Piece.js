function Piece(points)
{
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
	// TODO Join two pieces together. This'll be fun...
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
