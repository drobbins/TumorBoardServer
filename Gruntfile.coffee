module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON 'package.json'
        coffee: # Compile Coffeescripts
            source:
                expand: true
                flatten: true
                cwd: 'src'
                src: ['**/*coffee']
                dest: 'dist'
                ext: '.js'
            tests:
                expand: true
                flatten: true
                cwd: 'test/src'
                src: ['**/*coffee']
                dest: 'test'
                ext: '.js'
        cafemocha:
            tests:
                src: 'test/**/*.js'
                options:
                    ui: 'bdd'
                    require: ['should']
                    reporter: 'spec'
        watch:
            files: ['**/*coffee']
            tasks: ['coffee', 'cafemocha']

    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-cafe-mocha'

    grunt.registerTask 'default', ['coffee', 'cafemocha']

