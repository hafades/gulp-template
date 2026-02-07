import {
  src, dest, watch, series, lastRun,
} from 'gulp';
import { serverReload } from './server.js';
import config from '../config.js';

const copyBuild = () => (
  src(config.copy.src, { base: config.copy.base, since: lastRun(copyBuild) })
    .pipe(dest(config.copy.dest))
);

const copyWatch = () => watch(
  config.copy.watch,
  series(copyBuild, serverReload),
);

export { copyBuild, copyWatch };
