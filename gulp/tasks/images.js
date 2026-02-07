import {
  src, dest, watch, series,
} from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import cached from 'gulp-cached';
import { serverReload } from './server.js';
import config from '../config.js';

const imagesBuild = () => (
  src(config.images.src)
    .pipe(plumber({
      errorHandler: notify.onError((error) => ({
        title: 'Images',
        message: error.message,
      })),
    }))
    .pipe(cached('Images'))
    .pipe(dest(config.images.dest))
    .pipe(src(config.images.src))
    .pipe(cached('Webp'))
    .pipe(dest(config.images.dest))
);

const imagesWatch = () => watch(config.images.watch, series(imagesBuild, serverReload));

export { imagesBuild, imagesWatch };
