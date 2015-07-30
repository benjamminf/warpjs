function SVGDistort(paths)
{
	if(!(this instanceof SVGDistort))
	{
		return new SVGDistort(paths);
	}

	this.paths = paths;
	this.init();
}

SVGDistort.prototype.init = function()
{
	this.segments = [];
	this.points = [];

	for(var i = 0; i < this.paths.length; i++)
	{
		var path = this.paths[i];
		var segments = path.segments;

		normalizePath(path);

		for(var j = 0; j < segments.numberOfItems; j++)
		{
			var segment = segments.getItem(j);
			var type = segment.pathSegTypeAsLetter;

			// If it's not a close path
			if(type != 'Z' && type != 'z')
			{
				this.segments.push(segment);

				this.points.push(Point.from(segment));
				if('x1' in segment) this.points.push(Point.from(segment, 'x1', 'y1'));
				if('x2' in segment) this.points.push(Point.from(segment, 'x2', 'y2'));
			}
		}
	}
};
