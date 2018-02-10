export default function spiralTransformerFactory(angle, x=0, y=0)
{
	return function spiralTransformer([ x, y, ...points ])
	{
		return [
			x,
			y,
			...points,
		]
	}
}
