import { deleteSync } from 'del';
import config from '../config.js';

const clean = (cb) => {
  deleteSync(config.clean.build);
  cb();
}

export { clean };
