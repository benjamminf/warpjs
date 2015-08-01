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

	this.paths = svg.children; // TODO Maybe copy array?
	this.init();
}

/**
 *
 */
SVGDistort.prototype.init = function()
{
	this.originalSegments = [];
	this.originalPoints = [];

	for(var i = 0; i < this.paths.length; i++)
	{
		var path = this.paths[i];
		var segments = path.segments;

		for(var j = 0; j < segments.numberOfItems; j++)
		{
			var segment = segments.getItem(j);

			this.originalSegments.push(segment);

			// Add points if applicable
			if('x'  in segment) this.originalPoints.push(Point.from(segment));
			if('x1' in segment) this.originalPoints.push(Point.from(segment, Point.CONTROL_1));
			if('x2' in segment) this.originalPoints.push(Point.from(segment, Point.CONTROL_2));
		}
	}
};
