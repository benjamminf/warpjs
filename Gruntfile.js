module.exports = function(grunt)
{
	var pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({

		concat: {
			options: {

			},
			dist: {
				src: [
					'src/start.frag',

					'utils/svg.js',
					'utils/interpolate.js',
					'utils/normalize.js',

					'classes/Point.js',
					'classes/FixedPoint.js',
					'classes/Piece.js',
					'classes/Segment.js',
					'classes/Path.js',
					'classes/DVG.js',

					'src/main.js',
					'src/end.frag'
				],
				dest: 'dist/dvg.js'
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015']
			},
			dist: {
				files: {
					'dist/app.js': 'src/app.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('default', ['concat', 'babel']);
};
