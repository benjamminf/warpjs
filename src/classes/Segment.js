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
