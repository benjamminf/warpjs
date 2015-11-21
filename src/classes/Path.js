function Path(segments, interThreshold, extraThreshold)
{
	this._segments = [];
	this._interThreshold = isNaN(interThreshold) ? Path.DEFAULT_INTERPOLATION_THRESHOLD : interThreshold;
	this._extraThreshold = isNaN(extraThreshold) ? Path.DEFAULT_EXTRAPOLATION_THRESHOLD : extraThreshold;

	if(segments && segments.length)
	{
		for(var i = 0; i < segments.length; i++)
		{
			this.addSegment(segments[i]);
		}
	}
}

Path.DEFAULT_INTERPOLATION_THRESHOLD = 10;
Path.DEFAULT_EXTRAPOLATION_THRESHOLD = 2.5;

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
fn.interpolate = function()
{
	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];
		segment.interpolate(this._interThreshold);
	}
};

// Private?
fn.extrapolate = function()
{
	for(var i = 0; i < this._segments.length; i++)
	{
		var segment = this._segments[i];
		segment.extrapolate(this._extraThreshold);
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
