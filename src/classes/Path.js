function Path(segments)
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

var fn = Path.prototype;

fn.addSegment = function(segment)
{
	if(!(segment instanceof Segment))
	{
		throw new Error('Must be a valid Segment instance');
	}

	this._segments.push(segment);
};

fn.toString = function()
{
	
};
