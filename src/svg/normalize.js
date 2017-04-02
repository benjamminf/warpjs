import pathParser from '../path/parser'
import pathEncoder from '../path/encoder'
import pathTransformer from '../path/transformer'
import absoluteTransformer from '../path/transformers/absolute'
import shortToLongTransformer from '../path/transformers/short-to-long'
import hvzToLineTransformer from '../path/transformers/hvz-to-line'
import lineToCurveTransformer from '../path/transformers/line-to-curve'
import arcToCurveTransformer from '../path/transformers/arc-to-curve'
import * as pathShape from '../path/shape'
import { createElement, getProperty, setProperty } from './utils'

export function shapesToPaths(element)
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

export function preparePaths(element, curveType='q')
{
	const pathElements = element.querySelectorAll('path')

	for(let pathElement of pathElements)
	{
		let pathString = getProperty(pathElement, 'd')
		let path = pathParser(pathString)

		path = pathTransformer(path, absoluteTransformer())
		path = pathTransformer(path, shortToLongTransformer())
		path = pathTransformer(path, hvzToLineTransformer())
		path = pathTransformer(path, lineToCurveTransformer(curveType))
		path = pathTransformer(path, arcToCurveTransformer())
		
		pathString = pathEncoder(path)

		setProperty(pathElement, 'd', pathString)
	}
}
