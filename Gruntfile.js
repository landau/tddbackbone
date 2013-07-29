module.exports = function (grunt) {
    "use strict";

    // https://github.com/kmiyashiro/grunt-mocha
    grunt.loadNpmTasks("grunt-mocha");

    //https://github.com/gruntjs/grunt-contrib-watch
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.initConfig({
        mocha: {
            all: {
                // Src to test html file
                src: ["js/test/test.html"],
                // Mocha options
                options: {
                    bail: true,
                    log: true,
                    run: true
                }
            }
        },

        watch: {
            tests: {
                files: __dirname + "/js/**/*.js",
                tasks: ["mocha:all"]
            }
        }
    });

    grunt.registerTask("default", ["mocha:all"]);
};