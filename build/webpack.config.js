const webpack = require('webpack')
const path = require('path')

module.exports = {
	devtool: 'source-map',
	entry: path.resolve(__dirname, '../src/main.js'),
	output: {
		path: path.resolve(__dirname, '../dist/'),
		filename: 'warp.js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
					},
				},
			},
		],
	},
}
