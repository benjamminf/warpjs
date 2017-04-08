import { shapesToPaths, preparePaths } from './svg/normalize'
import { getProperty, setProperty } from './svg/utils'
import pathParser from './path/parser'
import pathEncoder from './path/encoder'
import warpTransform from './warp/transform'
import warpInterpolate from './warp/interpolate'
import * as interpolate from './path/interpolate'

const deltaFunction = points => interpolate.euclideanDistance(points.slice(0, 2))

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

	transform(transformer)
	{
		for(let path of this.paths)
		{
			path.data = warpTransform(path.data, transformer)
			const pathString = pathEncoder(path.data)

			setProperty(path.element, 'd', pathString)
		}
	}

	interpolate(threshold)
	{
		let didWork = false

		for(let path of this.paths)
		{
			path.data = warpInterpolate(path.data, threshold, deltaFunction)
			const pathString = pathEncoder(path.data)

			setProperty(path.element, 'd', pathString)
		}

		return didWork
	}

	extrapolate(threshold)
	{
		return false
	}

	preInterpolate(transformer, threshold)
	{
		return false
	}

	preExtrapolate(transformer, threshold)
	{
		return false
	}
}
