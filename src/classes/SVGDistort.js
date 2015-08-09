/**
 *
 * @param svg
 * @returns {SVGDistort}
 * @constructor
 */
function SVGDistort(svg)
{
	if(!(this instanceof SVGDistort))
	{
		return new SVGDistort(svg);
	}

	normalize(svg);

	this.paths = svg.querySelectorAll('path');
	this.init();
}

/**
 *
 */
SVGDistort.prototype.init = function()
{
	this.origSegments = [];
	this.origPoints = [];

	for(var i = 0; i < this.paths.length; i++)
	{
		var path = this.paths[i];
		var segments = path.pathSegList;

		for(var j = 0; j < segments.numberOfItems; j++)
		{
			var segment = segments.getItem(j);

			this.origSegments.push(segment);

			// Add points if applicable
			if('x'  in segment) this.origPoints.push(Point.from(segment));
			if('x1' in segment) this.origPoints.push(Point.from(segment, Point.CONTROL_1));
			if('x2' in segment) this.origPoints.push(Point.from(segment, Point.CONTROL_2));
		}
	}
};

SVGDistort.prototype.withPoints = function(callback, types)
{
	for(var i = 0; i < this.origPoints.length; i++)
	{
		var point = this.origPoints[i];
		callback.call(point, point.x(), point.y());
	}
};
