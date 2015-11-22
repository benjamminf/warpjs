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

					'src/utils/svg.js',
					'src/utils/interpolate.js',
					'src/utils/normalize.js',

					'src/classes/Point.js',
					'src/classes/FixedPoint.js',
					'src/classes/Piece.js',
					'src/classes/Segment.js',
					'src/classes/Path.js',
					'src/classes/DVG.js',

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
