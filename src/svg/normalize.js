import pathParser from '../path/parser'
import pathEncoder from '../path/encoder'
import * as pathShape from '../path/shape'
import { createElement, getProperty } from './utils'

export function toPath(element)
{
	const shapes = element.querySelectorAll('line, polyline, polygon, rect, ellipse, circle')

	for(let shape of shapes)
	{
		let path = {}
		switch(shape.tagName.toLowerCase())
		{
			case 'line':
			{
				path = pathShape.line(
					getProperty(shape, 'x1'),
					getProperty(shape, 'y1'),
					getProperty(shape, 'x2'),
					getProperty(shape, 'y2')
				)
			}
			break
			case 'polyline':
			{
				path = pathShape.polyline(...shape.points)
			}
			break
			case 'polygon':
			{
				path = pathShape.polygon(...shape.points)
			}
			break
			case 'rect':
			{
				path = pathShape.rectangle(
					getProperty(shape, 'x'),
					getProperty(shape, 'y'),
					getProperty(shape, 'width'),
					getProperty(shape, 'height'),
					getProperty(shape, 'rx'),
					getProperty(shape, 'ry')
				)
			}
			break
			case 'ellipse':
			{
				path = pathShape.ellipse(
					getProperty(shape, 'cx'),
					getProperty(shape, 'cy'),
					getProperty(shape, 'rx'),
					getProperty(shape, 'ry')
				)
			}
			break
			case 'circle':
			{
				path = pathShape.circle(
					getProperty(shape, 'cx'),
					getProperty(shape, 'cy'),
					getProperty(shape, 'r')
				)
			}
			break
		}

		const pathString = pathEncoder(path)
		const attributes = { d: pathString }

		for(let attribute of shape.attributes)
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
		shape.parentNode.replaceChild(pathElement, shape)
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
