import * as normalize from './svg/normalize'

class Warp
{
	constructor(element)
	{
		this.element = element
	}

	normalize(steps=-1, curveType='q')
	{
		if(steps & Warp.TO_PATH)
		{
			normalize.toPath(this.element)
		}
		
		if(steps & Warp.TO_ABSOLUTE)
		{
			normalize.toAbsolute(this.element)
		}
		
		if(steps & Warp.TO_LINE)
		{
			normalize.toLine(this.element)
		}

		if(steps & Warp.TO_CURVE)
		{
			normalize.toCurve(this.element, curveType)
		}
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

Warp.TO_PATH = 1
Warp.TO_ABSOLUTE = 2
Warp.TO_LINE = 4
Warp.TO_CURVE = 8

export default Warp
