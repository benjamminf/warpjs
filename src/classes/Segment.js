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
