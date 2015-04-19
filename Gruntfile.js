module.exports = function(grunt) {

    grunt.initConfig({
        jsbeautifier: {
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "test/**/*.js",
                "__test__/**/*.js"
            ]
        },
        jshint: {
            options: {
                es3: true,
                unused: true,
                curly: true,
                eqeqeq: true,
                expr: true,
                eqnull: true,
                proto: true
            },
            files: [
                "Gruntfile.js",
                "src/**/*.js",
                "__test__/**/*.js",
                "!**/*.min.js"
            ]
        }
    });

    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("default", ["jsbeautifier", "jshint"]);
};
