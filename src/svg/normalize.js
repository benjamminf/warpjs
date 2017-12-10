import pathParser from '../path/parser'
import pathEncoder from '../path/encoder'
import pathTransform from '../path/transform'
import absoluteTransformer from '../path/transformers/absolute'
import shortToLongTransformer from '../path/transformers/short-to-long'
import hvzToLineTransformer from '../path/transformers/hvz-to-line'
import lineToCurveTransformer from '../path/transformers/line-to-curve'
import arcToCurveTransformer from '../path/transformers/arc-to-curve'
import * as pathShape from '../path/shape'
import { createElement, getProperty, setProperty } from './utils'

export function shapesToPaths(element)
{
	const shapeMap = {

		line(shapeElement)
		{
			return pathShape.line(
				getProperty(shapeElement, 'x1'),
				getProperty(shapeElement, 'y1'),
				getProperty(shapeElement, 'x2'),
				getProperty(shapeElement, 'y2')
			)
		},

		polyline(shapeElement)
		{
			return pathShape.polyline(...shapeElement.points)
		},

		polygon(shapeElement)
		{
			return pathShape.polygon(...shapeElement.points)
		},

		rect(shapeElement)
		{
			return pathShape.rectangle(
				getProperty(shapeElement, 'x'),
				getProperty(shapeElement, 'y'),
				getProperty(shapeElement, 'width'),
				getProperty(shapeElement, 'height'),
				getProperty(shapeElement, 'rx'),
				getProperty(shapeElement, 'ry')
			)
		},

		ellipse(shapeElement)
		{
			return pathShape.ellipse(
				getProperty(shapeElement, 'cx'),
				getProperty(shapeElement, 'cy'),
				getProperty(shapeElement, 'rx'),
				getProperty(shapeElement, 'ry')
			)
		},

		circle(shapeElement)
		{
			return pathShape.circle(
				getProperty(shapeElement, 'cx'),
				getProperty(shapeElement, 'cy'),
				getProperty(shapeElement, 'r')
			)
		},
	}

	const shapeElements = element.querySelectorAll(Object.keys(shapeMap).join(','))

	for (let shapeElement of shapeElements)
	{
		const shapeName = shapeElement.tagName.toLowerCase()

		if (shapeName in shapeMap)
		{
			const path = shapeMap[shapeName](shapeElement)
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
}

export function preparePaths(element, curveType='q')
{
	const pathElements = element.querySelectorAll('path')

	for (let pathElement of pathElements)
	{
		let pathString = getProperty(pathElement, 'd')
		let path = pathParser(pathString)

		path = pathTransform(path, absoluteTransformer())
		path = pathTransform(path, shortToLongTransformer())
		path = pathTransform(path, hvzToLineTransformer())
		path = pathTransform(path, lineToCurveTransformer(curveType))
		path = pathTransform(path, arcToCurveTransformer())
		
		pathString = pathEncoder(path)

		setProperty(pathElement, 'd', pathString)
	}
}
