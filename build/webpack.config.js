const webpack = require('webpack')
const path = require('path')

module.exports = {
	devtool: 'source-map',
	entry: '../src/main.js',
	output: {
		path: '../dist/',
		filename: 'warp.js'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	],
	module: {
		loaders: [
			{
				loader: 'babel-loader',
				test: /\.jsx?$/,
				include: [
					path.resolve(__dirname, 'src')
				],
				query: {
					presets: ['es2015']
				}
			}
		]
	}
}
