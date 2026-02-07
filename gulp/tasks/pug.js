import {
  src, dest, watch, series,
} from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import pug from 'gulp-pug';
import rename from 'gulp-rename';
import { serverReload } from './server.js';
import config from '../config.js';

const pugBuild = () => (
  src(config.pug.src)
    .pipe(plumber({
      errorHandler: notify.onError((error) => ({
        title: 'Pug',
        message: error.message,
      })),
    }))
    .pipe(pug({
      pretty: true,
      venbose: true,
    }))
    .pipe(rename({
      dirname: '',
    }))
    .pipe(dest(config.pug.dest))
);

const pugWatch = () => {
  watch(
    config.pug.watch,
    series(pugBuild, serverReload),
  );
};

export { pugBuild, pugWatch };
