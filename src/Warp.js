import { shapesToPaths, preparePaths } from './svg/normalize'
import { getProperty, setProperty } from './svg/utils'
import pathParser from './path/parser'
import pathEncoder from './path/encoder'
import { euclideanDistance } from './path/interpolate'
import warpTransform from './warp/transform'
import warpInterpolate from './warp/interpolate'
import warpExtrapolate from './warp/extrapolate'

export default class Warp
{
	constructor(element, curveType='q')
	{
		this.element = element

		shapesToPaths(element)
		preparePaths(element, curveType)

		const pathElements = Array.from(element.querySelectorAll('path'))

		this.paths = pathElements.map(pathElement =>
		{
			const pathString = getProperty(pathElement, 'd')
			const pathData = pathParser(pathString)

			return { pathElement, pathData }
		})
	}

	update()
	{
		for (let { pathElement, pathData } of this.paths)
		{
			const pathString = pathEncoder(pathData)
			setProperty(pathElement, 'd', pathString)
		}
	}

	transform(transformers)
	{
		transformers = Array.isArray(transformers) ? transformers : [ transformers ]

		for (let path of this.paths)
		{
			path.pathData = warpTransform(path.pathData, transformers)
		}

		this.update()
	}

	interpolate(threshold, transformer=null)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const linearPoints = [
				points[0].slice(0, 2),
				points[points.length - 1].slice(0, 2),
			]

			const delta = euclideanDistance(linearPoints)
			didWork = didWork || (delta > threshold)

			return delta
		}

		for (let path of this.paths)
		{
			if (transformer)
			{
				const transformed = warpTransform(path.pathData, p => [ ...transformer(p).slice(0, 2), ...p ])
				const interpolated = warpInterpolate(transformed, threshold, deltaFunction)

				path.pathData = warpTransform(interpolated, p => p.slice(2))
			}
			else
			{
				path.pathData = warpInterpolate(path.pathData, threshold, deltaFunction)
			}
		}

		return didWork
	}

	extrapolate(threshold, transformer=null)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const linearPoints = [
				points[0].slice(0, 2),
				points[points.length - 1].slice(0, 2),
			]

			const delta = euclideanDistance(linearPoints)
			didWork = didWork || (delta <= threshold)

			return delta
		}

		for (let path of this.paths)
		{
			if (transformer)
			{
				const transformed = warpTransform(path.pathData, p => [ ...transformer(p).slice(0, 2), ...p ])
				const extrapolated = warpExtrapolate(transformed, threshold, deltaFunction)

				path.pathData = warpTransform(extrapolated, p => p.slice(2))
			}
			else
			{
				path.pathData = warpExtrapolate(path.pathData, threshold, deltaFunction)
			}
		}

		return didWork
	}
}
