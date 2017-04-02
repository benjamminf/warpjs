import { shapesToPaths, preparePaths } from './svg/normalize'
import { getProperty, setProperty } from './svg/utils'
import pathParser from './path/parser'
import pathEncoder from './path/encoder'
import pathTransformer from './path/transformer'
import interpolator from './interpolator'

const polationTypesExpr = /[lqc]/
const pointGroups = [
	['x1', 'y1'],
	['x2', 'y2'],
	['x', 'y'],
]

function createSegment(points)
{
	const segment = { relative: false }

	switch(points.length)
	{
		case 2: { segment.type = 'l' } break
		case 3: { segment.type = 'q' } break
		case 4: { segment.type = 'c' } break
		default: return false
	}

	for(let i = 1; i < points.length; i++)
	{
		const g = (i < points.length - 1 ? i : pointGroups.length) - 1
		const [x, y] = pointGroups[g]

		segment[x] = points[i][0]
		segment[y] = points[i][1]

		if(points[i].length > 2)
		{
			segment.extended = segment.extended || {}
			segment.extended[g] = points[i].slice(2)
		}
	}

	return segment
}

function getPointDelta(points)
{
	const startPoint = points[0]
	const endPoint = points[points.length - 1]
	const dx = endPoint[0] - startPoint[0]
	const dy = endPoint[1] - startPoint[1]

	return Math.sqrt(dx**2 + dy**2)
}

function interpolateUntil(points, threshold)
{
	const stack = [points]
	const segments = []

	while(stack.length > 0)
	{
		const currentPoints = stack.pop()

		if(getPointDelta(currentPoints) > threshold)
		{
			const newPoints = interpolator(currentPoints)

			// Add new segments backwards so they end up in correct order
			for(let i = newPoints.length - 1; i >= 0; i--)
			{
				stack.push(newPoints[i])
			}
		}
		else
		{
			segments.push(currentPoints)
		}
	}

	return segments
}

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
			const path = pathParser(pathString)

			return { element, path }
		})
	}

	transform(transformer)
	{
		for(let { element, path } of this.paths)
		{
			pathTransformer(path, segment =>
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

			const pathString = pathEncoder(path)

			setProperty(element, 'd', pathString)
		}
	}

	interpolate(threshold)
	{
		let didWork = false

		for(let i = 0; i < this.paths.length; i++)
		{
			let { element, path } = this.paths[i]
			let prevPoints = []

			path = pathTransformer(path, function(segment)
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

					const rawSegments = interpolateUntil(points, threshold)

					if(rawSegments.length > 1)
					{
						segments = rawSegments.map(rawSegment => createSegment(rawSegment))
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

			const pathString = pathEncoder(path)

			setProperty(element, 'd', pathString)

			this.paths[i].path = path
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
