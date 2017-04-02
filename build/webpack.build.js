const webpack = require('webpack')
const path = require('path')
const config = require('./webpack')

module.exports = Object.assign(config, {
	devtool: 'source-map',
	entry: path.resolve(__dirname, '../src/main.js'),
	output: {
		path: path.resolve(__dirname, '../dist/'),
		filename: 'warp.js',
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			output: { comments: false },
			sourceMap: true,
		}),
	],
})
