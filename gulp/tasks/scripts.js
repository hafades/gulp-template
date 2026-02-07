import {
  src, dest, watch, series,
} from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { createGulpEsbuild } from 'gulp-esbuild';
import { serverReload } from './server.js';
import config from '../config.js';

const gulpEsbuild = createGulpEsbuild({
  incremental: true,
  piping: true,
});

const scriptsBuild = () => (
  src(config.scripts.src)
    .pipe(plumber({
      errorHandler: notify.onError((error) => ({
        title: 'Js',
        message: error.message,
      })),
    }))
    .pipe(gulpEsbuild({
      entryNames: '[name].min',
      bundle: true,
      minify: config.isBuild,
      minifySyntax: config.isBuild,
      sourcemap: config.isDev ? 'inline' : false,
    }))
    .pipe(dest(config.scripts.dest))
);

const scriptsWatch = () => watch(config.scripts.watch, series(scriptsBuild, serverReload));

export { scriptsBuild, scriptsWatch };
