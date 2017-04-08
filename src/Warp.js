import { shapesToPaths, preparePaths } from './svg/normalize'
import { getProperty, setProperty } from './svg/utils'
import pathParser from './path/parser'
import pathEncoder from './path/encoder'
import pathTransformer from './path/transformer'
import { createLineSegment, pointGroups } from './path/utils'
import * as interpolate from './path/interpolate'

const polationTypesExpr = /[lqc]/
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
			path.data = pathTransformer(path.data, segment =>
			{
				for(let i = 0; i < pointGroups.length; i++)
				{
					const [x, y] = pointGroups[i]

					if(x in segment && y in segment)
					{
						const extendedPoints = (segment.extended ? segment.extended[i] : null) || {}
						const newPoints = transformer([segment[x], segment[y], ...extendedPoints])

						if(newPoints.length < 2)
						{
							throw new Error(`Transformer must return at least 2 points`)
						}

						segment[x] = newPoints[0]
						segment[y] = newPoints[1]

						if(newPoints.length > 2)
						{
							segment.extended = segment.extended || {}
							segment.extended[i] = newPoints.slice(2)
						}
					}
				}

				return segment
			})

			const pathString = pathEncoder(path.data)

			setProperty(path.element, 'd', pathString)
		}
	}

	interpolate(threshold)
	{
		let didWork = false

		for(let i = 0; i < this.paths.length; i++)
		{
			let path = this.paths[i]
			let prevPoints = []

			path.data = pathTransformer(path.data, function(segment)
			{
				let segments = segment

				if(polationTypesExpr.test(segment.type))
				{
					const points = [prevPoints]

					for(let j = 0; j < pointGroups.length; j++)
					{
						const [x, y] = pointGroups[j]

						if(x in segment && y in segment)
						{
							const extendedPoints = (segment.extended ? segment.extended[j] : null) || []
							const pointList = [segment[x], segment[y], ...extendedPoints]

							points.push(pointList)
						}
					}

					const rawSegments = interpolate.until(points, threshold, deltaFunction)

					if(rawSegments.length > 1)
					{
						segments = rawSegments.map(rawSegment => createLineSegment(rawSegment))
						didWork = true
					}
				}

				if('x' in segment && 'y' in segment)
				{
					const extendedPoints = (segment.extended ? segment.extended[2] : null) || {}
					const pointList = [segment.x, segment.y, ...extendedPoints]

					prevPoints = pointList
				}

				return segments
			})

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
