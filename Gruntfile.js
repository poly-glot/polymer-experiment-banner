const path = require('path');

module.exports = function (grunt) {
  const buildPath = path.resolve(path.join(__dirname, 'dist'))
  const vulcanizeFiles = {}
  vulcanizeFiles[buildPath + '/elements.html'] = 'src/elements.html'

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vulcanize: {
      default: {
        options: {
          abspath: '',
          excludes: [],
          inlineScripts: true,
          inlineCss: true,
          stripComments: true
        },
        files: vulcanizeFiles,
      },
    },
    watch: {
      scripts: {
        files: [
          'src/**/*.html',
          'src/**/*.js'
        ],
        tasks: ['jshint:all'],
        options: {
          spawn: false,
        },
      },
    },
    browser_sync: {
      bsFiles: {
        src : 'src/**'
      },
      options: {
        watchTask: true,
        server: {
          baseDir: './src'
        }
      }
    },
    clean: {
      options: {
        force: true
      },
      dist: [
        buildPath
      ],
    },
    mkdir: {
      dist: {
        options: {
          create: [buildPath]
        },
      },
    },
    jshint: {
      all: [
          'src/**/*.html',
          'src/**/*.js'
      ],
      options: {
        jshintrc: true,
        extract: 'always',
        ignores: [
          'src/bower_components/**/*.html',
          'src/bower_components/**/*.js'
        ]
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/bower_components',
            src: '**',
            dest: buildPath + '/bower_components'
          },
          {
            expand: true,
            cwd: 'src/static-assets',
            src: '**',
            dest: buildPath + '/static-assets'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['index.html', 'demo-styles.css'],
            dest: buildPath
          }
        ]
      },
    },
    replace: {
      dist: {
        src: [
          buildPath + '/elements.html'
        ],
        overwrite: true,
        replacements: [
          {
            from: 'polymer.js',
            to: 'polymer.min.js'
          },
          {
            from: '../src/bower_components/',
            to: '/bower_components/'
          },
          {
            from: new RegExp('<!--(.|[\r\n])*?-->', 'gm'),
            to: ''
          }
        ]
      }
    },
    fake_api: {
      target: {

      }
    }
  });


  // Load tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies',
    pattern: ['grunt-*', '@*/grunt-*', '!grunt-cli']
  });

  grunt.registerMultiTask('fake_api', 'Run a fake api server', function() {
    var fakeApiServer = require('./fake-api');
    var server = fakeApiServer();
    grunt.log.ok('Fake API running at http://0.0.0.0:' + server.port);
  });

  grunt.registerTask('default', [
    'fake_api',
    'browser_sync',
    'watch'
  ]);

  grunt.registerTask('build', [
    'jshint:all',
    'clean:dist',
    'mkdir:dist',
    'copy:dist',
    'vulcanize',
    'replace:dist',
  ]);
}
