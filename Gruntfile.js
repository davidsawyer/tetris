module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            files: ['js/*', 'index.html'],
            tasks: ['concat'],
            options: {
                livereload: true
            }
        },
        concat: {
            dist: {
                src: [
                    'js/opener.js',
                    'js/Tetrimino.js',
                    'js/Block.js',
                    'js/init.js',
                    'js/closer.js'
                ],
                dest: 'compiled/tetris.js',
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['concat', 'watch']);
};