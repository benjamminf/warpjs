const modes = {
	sine: (t, l, a, o) => a * Math.sin((2 * Math.PI * (t + o)) / l),
	square: (t, l, a, o, d=0.5) => ((t - o) % l + l) % l < d * l ? a : -a,
	//triangle: (t, l, a, o) => ,
	//sawtooth: (t, l, a, o) => ,
}

/**
 *
 * @param wavelength
 * @param amplitude
 * @param angle
 * @param offset
 * @param mode
 * @returns {function(*[]): *[]}
 */
export default function waveFactory(wavelength, amplitude, angle=0, offset=0, mode='sine')
{
	const modeFunction = typeof mode === 'function' ? mode : modes[mode]

	return function wave([ x, y, ...points ])
	{
		// Rotate by angle
		const x1 = x * Math.cos(-angle) - y * Math.sin(-angle)
		const y1 = x * Math.sin(-angle) + y * Math.cos(-angle)

		// Apply y axis wave
		const x2 = x1
		const y2 = y1 + modeFunction(x1, wavelength, amplitude, offset)

		// Rotate back to normal
		const x3 = x2 * Math.cos(angle) - y2 * Math.sin(angle)
		const y3 = x2 * Math.sin(angle) + y2 * Math.cos(angle)

		return [ x3, y3, ...points ]
	}
}
