function Segment(/* points... */)
{
	var piece;

	switch(arguments.length)
	{
		case 3: piece = new Piece(arguments[0], arguments[1], arguments[2]); break;
		case 4: piece = new Piece(arguments[0], arguments[1], arguments[2], arguments[3]); break;
		default: throw new Error('Need either three or four points to form a piece');
	}

	for(var i = 0; i < arguments.length; i++)
	{
		if(!(arguments[i] instanceof FixedPoint))
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
	// TODO
	// Looks through pieces and interpolates them if they need to be
};

fn.extrapolate = function(threshold)
{
	// TODO
	// Looks through pieces and extrapolates them if they need to be
};

fn.autopolate = function(threshold)
{
	this.extrapolate(threshold);
	this.interpolate(threshold);
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
