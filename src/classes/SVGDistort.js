/**
 *
 * @param svg
 * @param mode
 * @param interThreshold
 * @param extraThreshold
 * @returns {SVGDistort}
 * @constructor
 */
function SVGDistort(svg, mode, interThreshold, extraThreshold)
{
	if(!(this instanceof SVGDistort))
	{
		return new SVGDistort(svg, mode, interThreshold, extraThreshold);
	}

	normalize(svg);

	var pathElements = svg.querySelectorAll('path');

	this._paths = [];
	this._mode = (mode === undefined ? SVGDistort.STATIC_INTERPOLATION : mode);
	this._interThreshold = isNaN(interThreshold) ? SVGDistort.DEFAULT_INTERPOLATION_THRESHOLD : interThreshold;
	this._extraThreshold = isNaN(extraThreshold) ? SVGDistort.DEFAULT_EXTRAPOLATION_THRESHOLD : extraThreshold;

	for(var i = 0; i < pathElements.length; i++)
	{
		var element = pathElements[i];
		var path = Path.fromElement(element);

		path.interpolate(this._interThreshold);
		element.setAttribute('d', path.toString());

		this._paths.push({
			path: path,
			element: element
		});
	}
}

SVGDistort.STATIC_INTERPOLATION  = 1;
SVGDistort.DYNAMIC_INTERPOLATION = 2;
SVGDistort.DYNAMIC_AUTOPOLATION  = 3;

SVGDistort.DEFAULT_INTERPOLATION_THRESHOLD = 10;
SVGDistort.DEFAULT_EXTRAPOLATION_THRESHOLD = 2.5;

var fn = SVGDistort.prototype;

fn.withPoints = function(callback)
{
	var pointsMap = {};

	for(var m = 0; m < this._paths.length; m++)
	{
		var element = this._paths[m].element;
		var path = this._paths[m].path;

		// TODO Maybe offload these loops to their respective classes?
		for(var i = 0; i < path._segments.length; i++)
		{
			var segment = path._segments[i];

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

						callback.call(point, point.x(), point.y());
					}
				}
			}
		}

		switch(this._mode)
		{
			case SVGDistort.DYNAMIC_INTERPOLATION:
				path.interpolate(this._interThreshold);
				break;

			case SVGDistort.DYNAMIC_AUTOPOLATION:
				path.extrapolate(this._extraThreshold);
				path.interpolate(this._interThreshold);
				break;
		}

		element.setAttribute('d', path.toString());
	}
};
