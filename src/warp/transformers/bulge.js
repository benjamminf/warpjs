export default function bulgeTransformerFactory(weight, x=0, y=0)
{
	return function bulgeTransformer([ x, y, ...points ])
	{
		return [
			x,
			y,
			...points,
		]
	}
}
