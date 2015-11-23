module.exports = function(grunt)
{
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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

		uglify: {
			options: {
				sourceMap: true,
				banner: '/*! <%= pkg.name %> <%= pkg.version %> */'
			},
			dist: {
				files: {
					'dist/dvg.min.js' : 'dist/dvg.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'uglify']);
};
