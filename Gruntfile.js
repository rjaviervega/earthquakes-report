module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  	pkg: grunt.file.readJSON('package.json'),
  	uglify: {
  		options: {
  			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
  		},
  		minifyFiles: {
  			files: {
  				'build/earthquakes.min.js': ['earthquakes.js'],
  				'build/server.min.js': ['server.js']
  			}
  		}
  	},
  	less: {
  		production: {
  			files: {
  				'build/css/style.css': 'less/style.less'
  			}
  		}
  	}    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "less" task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'less']);

};