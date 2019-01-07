const gulp = require('gulp');
const ts = require('gulp-typescript');
const fs = require('fs');
const del = require('del');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('cleanTypes', function () {
  return del(['types']);
});
gulp.task('buildDts', ['cleanTypes'], function () {
  return gulp.src(['src/**/*.ts'])
    .pipe(tsProject())
    .pipe(gulp.dest('types'));
});
gulp.task('cleanTypesJs', ['buildDts'], function () {
  return del(['types/**/*.js']);
});
gulp.task('vueCliService', ['cleanTypesJs'], function () {
  const shell = require('shelljs');
  shell.exec('build/vue-cli-service.sh')
});

gulp.task('default', ['cleanTypes', 'buildDts', 'cleanTypesJs', 'vueCliService']);