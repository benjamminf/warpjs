export function createElement(tag, attributes={})
{
	const element = document.createElementNS('http://www.w3.org/2000/svg', tag)

	for(let name of Object.keys(attributes))
	{
		setProperty(element, name, attributes[name])
	}

	return element
}

export function getProperty(element, property)
{
	if(element[property] instanceof SVGAnimatedLength)
	{
		return element[property].baseVal.value
	}

	return element.getAttribute(property)
}

export function setProperty(element, property, value)
{
	element.setAttribute(property, value)
}
