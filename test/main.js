describe('Path', function()
{
	require('./path/parser')
	require('./path/encoder')
	require('./path/transform')

	describe('Transformers', function()
	{
		require('./path/transformers/absolute')
		require('./path/transformers/arc-to-curve')
		require('./path/transformers/hvz-to-line')
		require('./path/transformers/line-to-curve')
		require('./path/transformers/short-to-long')
	})

	require('./path/interpolate')
	require('./path/shape')
	require('./path/utils')
})

describe('Warp', function()
{
	require('./warp/transform')
	require('./warp/interpolate')
	require('./warp/extrapolate')
})
