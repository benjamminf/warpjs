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

	var pathElements = svg.querySelectorAll('path');

	this._paths = [];

	for(var i = 0; i < pathElements.length; i++)
	{
		var element = pathElements[i];
		var path = Path.fromElement(element);

		path.interpolate();
		element.setAttribute('d', path.toString());

		this._paths.push({
			path: path,
			element: element
		});
	}
}

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

		path.interpolate();

		element.setAttribute('d', path.toString());
	}
};
