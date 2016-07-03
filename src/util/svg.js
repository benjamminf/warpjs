export function create(tag, attributes)
{
	const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

	for(let name of Object.keys(attributes))
	{
		element.setAttribute(name, attributes[name])
	}

	return element
}

export function attribute(element, name)
{
	if(element[name] instanceof SVGAnimatedLength)
	{
		return element[name].baseVal.value
	}

	return element.getAttribute(name)
}
