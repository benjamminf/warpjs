import { shapesToPaths, preparePaths } from './svg/normalize'

export default class Warp
{
	constructor(element)
	{
		this.element = element
	}

	normalize(curveType='q')
	{
		shapesToPaths(this.element)
		preparePaths(this.element, curveType)
	}

	transform(transformer)
	{

	}

	interpolate(threshold)
	{
		return false
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
