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
