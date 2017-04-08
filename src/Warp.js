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

		shapesToPaths(this.element)
		preparePaths(this.element, curveType)

		const pathElements = element.querySelectorAll('path')

		this.paths = [].map.call(pathElements, function(element)
		{
			const pathString = getProperty(element, 'd')
			const data = pathParser(pathString)

			return { element, data }
		})
	}

	update()
	{
		for(let path of this.paths)
		{
			const pathString = pathEncoder(path.data)
			setProperty(path.element, 'd', pathString)
		}
	}

	transform(transformer)
	{
		for(let path of this.paths)
		{
			path.data = warpTransform(path.data, transformer)
		}

		this.update()
	}

	interpolate(threshold)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const delta = euclideanDistance(points.slice(0, 2))
			didWork = didWork || (delta > threshold)

			return delta
		}

		for(let path of this.paths)
		{
			path.data = warpInterpolate(path.data, threshold, deltaFunction)
		}

		this.update()

		return didWork
	}

	extrapolate(threshold)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const delta = euclideanDistance(points.slice(0, 2))
			didWork = didWork || (delta <= threshold)

			return delta
		}

		for(let path of this.paths)
		{
			path.data = warpExtrapolate(path.data, threshold, deltaFunction)
		}

		this.update()

		return didWork
	}

	preInterpolate(transformer, threshold)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const delta = euclideanDistance(points.slice(0, 2))
			didWork = didWork || (delta > threshold)

			return delta
		}

		for(let path of this.paths)
		{
			const transformed = warpTransform(path.data, function(points)
			{
				const newPoints = transformer(points.slice(0, 2))
				newPoints.push(...points)

				return newPoints
			})

			const interpolated = warpInterpolate(transformed, threshold, deltaFunction)

			path.data = warpTransform(interpolated, points => points.slice(2))
		}

		this.update()

		return didWork
	}

	preExtrapolate(transformer, threshold)
	{
		let didWork = false

		function deltaFunction(points)
		{
			const delta = euclideanDistance(points.slice(0, 2))
			didWork = didWork || (delta <= threshold)

			return delta
		}

		for(let path of this.paths)
		{
			const transformed = warpTransform(path.data, function(points)
			{
				const newPoints = transformer(points.slice(0, 2))
				newPoints.push(...points)

				return newPoints
			})

			const extrapolated = warpExtrapolate(transformed, threshold, deltaFunction)

			path.data = warpTransform(extrapolated, points => points.slice(2))
		}

		this.update()

		return didWork
	}
}
