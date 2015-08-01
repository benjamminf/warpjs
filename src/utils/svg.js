function SVG(tag, attributes)
{
	var el = document.createElementNS('http://www.w3.org/2000/svg', tag);

	for(var name in attributes) if(attributes.hasOwnProperty(name))
	{
		el.setAttribute(name, attributes[name]);
	}

	return el;
}

SVG.attribute = function(element, name)
{
	if(element[name] instanceof SVGAnimatedLength)
	{
		return element[name].baseVal.value;
	}

	return element.getAttribute(name);
};
