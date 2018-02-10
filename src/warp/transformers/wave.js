export default function waveTransformerFactory(wavelength, amplitude, angle=0, offset=0, type='sine')
{
	return function waveTransformer([ x, y, ...points ])
	{
		return [
			x,
			y,
			...points,
		]
	}
}

const warp = new Warp
const { wave } = Warp

const init = ([ x, y ]) => [ x, y, x, y ]
const reset = ([ x, y, ox, oy ]) => [ ox, oy, ox, oy ]

warp.transform(init)
warp.transform([ reset, wave(50, 30) ])
