




module.exports = function(grunt) {


// require('load-grunt-tasks')(grunt);


 
grunt.initConfig({
    sass: {
        dist: {
            files: {
                '../css/style.css': 'sass/style.scss'
            }
        }
    },
    watch: {
        scripts: {
          files: ['sass/style.scss','sass/*.scss','sass/tpl/*.scss'],
          tasks: ['sass'],
          options: {
          //  event: ['added', 'deleted'],
          },
        },
      },
});


grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-sass');


grunt.registerTask('default', ['sass','watch']);

};