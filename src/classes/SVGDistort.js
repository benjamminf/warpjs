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
}
