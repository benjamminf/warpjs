class Warp
{
	constructor(element)
	{

	}

	normalize(steps=-1)
	{
		if(steps & Warp.TO_PATH)
		{
			
		}
		
		if(steps & Warp.TO_ABSOLUTE)
		{

		}
		
		if(steps & Warp.TO_LINE)
		{

		}

		if(steps & Warp.TO_CURVE)
		{

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
