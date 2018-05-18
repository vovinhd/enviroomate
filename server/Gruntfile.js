module.exports = function(grunt) {


    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        copy: {
            main: {
                files: [
                    { expand: true, cwd: 'src/', src: ['public/**'], dest: '.' },
                    { expand: true, cwd: 'src/', src: ['views/**'], dest: '.' },

                ]
            }
        },
        run: {
            options: {
                // ...
            },
            npm_test_jest: {
                cmd: 'npm',
                args: [
                    'start'
                ]
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-run');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'copy', 'run']);

};