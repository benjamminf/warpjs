function Piece(/* points... */)
{
	var points = [];
	var pointStart;
	var pointEnd;
	var pointControl1;
	var pointControl2;

	switch(arguments.length)
	{
		// Quadratic bezier
		case 3:
			pointStart    = arguments[0];
			pointControl1 = arguments[1];
			pointEnd      = arguments[2];
			break;

		// Cubic bezier
		case 4:
			pointStart    = arguments[0];
			pointControl1 = arguments[1];
			pointControl2 = arguments[2];
			pointEnd      = arguments[3];
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

	points.push(pointStart);
	points.push(pointControl1);

	if(pointControl2)
		points.push(pointControl2);

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
	return this._points[index | 0];
};

fn.type = function()
{
	return Piece[this._points.length];
};

fn.interpolate = function()
{
	// TODO Need to interpolate original and resting values too
	// Returns [piece, piece]
	// Also, it only modifies the start and end points from this point as they are shared between
	// points. DON'T FORGET THIS!
};

fn.toString = function(includeMove)
{
	includeMove = (includeMove === true);

	var point;
	var s = [];

	if(includeMove)
	{
		point = this.point(0);
		s.push('M', point.x(), point.y());
	}

	s.push(this.type() === Piece.QUADRATIC ? 'Q' : 'C');

	for(var i = 1; i < this._points.length; i++)
	{
		point = this.point(1);
		s.push(point.x(), point.y());
	}

	return s.join(' ');
};
