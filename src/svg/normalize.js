import pathParser from '../path/parser'
import pathEncoder from '../path/encoder'
import * as pathShape from '../path/shape'
import { createElement, getProperty } from './utils'

export function toPath(element)
{
	const shapeElements = element.querySelectorAll('line, polyline, polygon, rect, ellipse, circle')

	for(let shapeElement of shapeElements)
	{
		let path = {}
		switch(shapeElement.tagName.toLowerCase())
		{
			case 'line':
			{
				path = pathShape.line(
					getProperty(shapeElement, 'x1'),
					getProperty(shapeElement, 'y1'),
					getProperty(shapeElement, 'x2'),
					getProperty(shapeElement, 'y2')
				)
			}
			break
			case 'polyline':
			{
				path = pathShape.polyline(...shapeElement.points)
			}
			break
			case 'polygon':
			{
				path = pathShape.polygon(...shapeElement.points)
			}
			break
			case 'rect':
			{
				path = pathShape.rectangle(
					getProperty(shapeElement, 'x'),
					getProperty(shapeElement, 'y'),
					getProperty(shapeElement, 'width'),
					getProperty(shapeElement, 'height'),
					getProperty(shapeElement, 'rx'),
					getProperty(shapeElement, 'ry')
				)
			}
			break
			case 'ellipse':
			{
				path = pathShape.ellipse(
					getProperty(shapeElement, 'cx'),
					getProperty(shapeElement, 'cy'),
					getProperty(shapeElement, 'rx'),
					getProperty(shapeElement, 'ry')
				)
			}
			break
			case 'circle':
			{
				path = pathShape.circle(
					getProperty(shapeElement, 'cx'),
					getProperty(shapeElement, 'cy'),
					getProperty(shapeElement, 'r')
				)
			}
			break
		}

		const pathString = pathEncoder(path)
		const attributes = { d: pathString }

		for(let attribute of shapeElement.attributes)
		{
			const name = attribute.nodeName
			const value = attribute.nodeValue

			// Avoid dimensional properties
			if(!/^(x|y|x1|y1|x2|y2|width|height|r|rx|ry|cx|cy|points|d)$/.test(name))
			{
				attributes[name] = value
			}
		}

		const pathElement = createElement('path', attributes)
		shapeElement.parentNode.replaceChild(pathElement, shapeElement)
	}
}

export function toAbsolute(element)
{

}

export function toLine(element)
{

}

export function toCurve(element, curveType='q')
{

}
