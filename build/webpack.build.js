const webpack = require('webpack')
const path = require('path')
const config = require('./webpack')
const package = require('../package.json')

module.exports = Object.assign(config, {
	devtool: 'source-map',
	entry: path.resolve(__dirname, '../src/main.js'),
	output: {
		path: path.resolve(__dirname, '../dist/'),
		filename: 'warp.js',
		library: 'Warp',
		libraryTarget: 'umd',
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false },
			output: { comments: false },
			sourceMap: true,
		}),
		new webpack.BannerPlugin({
			banner: `/*! Warp.js v${package.version} (${package.license}) */`,
			raw: true,
			entryOnly: true,
		}),
	],
})
