import {
  src, dest, watch, series,
} from 'gulp';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import { serverReload } from './server.js';
import config from '../config.js';

const emailsBuild = () => (
  src(config.emails.src)
    .pipe(plumber({
      errorHandler: notify.onError((error) => ({
        title: 'Emails',
        message: error.message,
      })),
    }))
    .pipe(dest(config.emails.dest))
);

const emailsWatch = () => watch(
  config.emails.watch,
  series(emailsBuild, serverReload),
);

export { emailsBuild, emailsWatch };
