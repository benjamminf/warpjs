describe('Path', function()
{
	require('./path/parser')
	require('./path/encoder')
	require('./path/transform')

	describe('Transformers', function()
	{
		require('./path/transformers/absolute')
		require('./path/transformers/arc-to-curve')
	})

	require('./path/interpolate')
})
