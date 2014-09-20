module.exports = function(grunt) {
    var botName = "checkCheckBurn";


    var getVersion = function() {
        var version = grunt.file.readJSON("current_version.json");
        version.version = version.version + 1;
        grunt.file.delete("current_version.json");
        grunt.file.write("current_version.json", JSON.stringify(version));
        return (version.version + "").length == 1 ? "0" + version.version : version.version;
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
                files: [{expand: true, cwd: 'bot/', src: ['**']},]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compress');

    grunt.registerTask('default', ['compress']);

};
