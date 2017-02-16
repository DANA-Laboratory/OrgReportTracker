'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    env : {
      dev : {
        NODE_ENV : 'development'
      }
    },
    mochaTest: {
     test: {
       options: {
         reporter: 'spec',
         captureFile: 'results.txt', // Optionally capture the reporter output to a file
         quiet: false, // Optionally suppress output to standard out (defaults to false)
         clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false)
         noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
       },
       src: ['test/**/*.js']
     }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'mochaTest']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'mochaTest']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-env');

  // Default task.
  grunt.registerTask('default', ['env:dev', 'jshint', 'mochaTest']);

};
