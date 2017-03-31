describe('Path', function()
{
	require('./path/parser')
	require('./path/encoder')
	require('./path/transformer')

	describe('Transformers', function()
	{
		require('./path/transformers/absolute')
	})
})
