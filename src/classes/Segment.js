function Segment(/* points... */)
{
	Piece.apply(this, arguments);

	for(var i = 0; i < this._points.length; i++)
	{
		if(!(this._points[i] instanceof FixedPoint))
		{
			throw new Error('All points must be instances of FixedPoint');
		}
	}

	// TODO pieces

	this._pieces = [];
}