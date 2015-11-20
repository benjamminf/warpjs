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
		var path = Path.fromElement(pathElements[i]);

		console.log(path.toString());
	}
}
