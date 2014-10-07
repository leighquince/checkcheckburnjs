module.exports = function(grunt) {
    var botName = "checkCheckBurn";


    var getVersion = function() {
        var currentVersion = grunt.file.readJSON("current_version.json");
        currentVersion.version = currentVersion.version + 1;
        grunt.file.delete("current_version.json");
        grunt.file.write("current_version.json", JSON.stringify(currentVersion));
        return (currentVersion.version + "").length == 1 ? "0" + currentVersion.version : currentVersion.version;
    };


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        compress: {
            main: {
                options: {
                    archive: function() {
                        return 'versions/' + botName + '_version_' + getVersion() + '.zip';
                    }
                },
                files: [{
                    expand: true,
                    cwd: 'poker_bot/',
                    src: ['**']
                }, ]
            }
        },
        mocha: {
            test: {
                src: ['test/**.*'],
            },
            options: {
                run: true,
            },
        },
        watch: {
            all: {
                files: ['poker_bot/*', 'test/*'],
                tasks: ['mocha']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['compress']);

};
